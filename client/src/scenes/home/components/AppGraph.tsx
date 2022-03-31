import React from "react";
import * as d3 from "d3";
import { LightningGraph, LightningGraphUpdate } from "../../../services/ApiService";

/**
 * This component is simply a wrapper for D3 rendered
 * via SVG. For performance reasons we're not going to use
 * JSX to render the SVG components and will instead rely
 * on D3 to do the heavy lifting.  As such, we're going to
 * use shouldComponentUpdate as an escape hatch to prevent
 * React from re-rendering the control once the SVG has been
 * initialized.
 *
 * This component will break from the React declarative
 * mold and use imperative methods to drive interactions with D3.
 * This will greatly simplify interactions with the graph and will
 * allow us to retain "graph" state inside D3 as separate
 * objects from those stored in our React application.
 */
export class AppGraph extends React.Component {
    protected svgRef: SVGElement;
    protected svg: any;
    protected simulation: any;
    protected nodes: any[];
    protected links: any[];
    protected node: any;
    protected link: any;

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <svg ref={elem => (this.svgRef = elem)} />;
    }

    createGraph(graph: LightningGraph) {
        const width = this.svgRef.parentElement.clientWidth;
        const height = this.svgRef.parentElement.clientHeight;
        this.svg = d3
            .select(this.svgRef)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "background-color: #f0f0f0");

        this.nodes = graph.nodes.map(node => ({
            id: node.pubkey,
            color: node.color,
            title: node.alias,
        }));

        this.links = graph.channels.map(channel => ({
            source: channel.node1PubKey,
            target: channel.node2PubKey,
            id: channel.channelId,
        }));

        this.initialize(width, height);
        this.draw();
    }

    updateGraph(update: LightningGraphUpdate) {
        for (const nodeUpdate of update.nodeUpdates) {
            const node = this.nodes.find(p => p.id === nodeUpdate.pubkey);
            if (node) {
                node.title = nodeUpdate.alias;
                node.color = nodeUpdate.color;
            }
        }

        for (const channelUpdate of update.channelUpdates) {
            const channel = this.links.find(p => p.id === channelUpdate.channelId);
            if (!channel) {
                this.links.push({
                    source: channelUpdate.nodeId1,
                    target: channelUpdate.nodeId2,
                    id: channelUpdate.channelId,
                });
            }
        }

        for (const channelClose of update.channelCloses) {
            const index = this.links.findIndex(p => p.id === channelClose.channelId);
            this.links.splice(index, 1);
        }

        this.draw();
    }

    /**
     * Code largely based on example:
     * https://observablehq.com/@d3/force-directed-graph
     */
    initialize(width, height) {
        const svg = this.svg;

        // Construct the simulation
        this.simulation = d3
            .forceSimulation()
            .force(
                "link",
                d3.forceLink().id((node: any) => node.id),
            )
            .force("charge", d3.forceManyBody().strength(-100).distanceMax(1000))
            .force("center", d3.forceCenter())
            .force("x", d3.forceX(width / 2).strength(0.01))
            .force("y", d3.forceY(height / 2).strength(0.01))
            .on("tick", ticked.bind(this));

        this.link = svg
            .append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", 1.5)
            .attr("stroke-linecap", "round")
            .selectAll("line")

            .data(this.links)
            .join("line");

        this.node = svg
            .append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 1.5)
            .selectAll("g")
            .data(this.nodes)
            .join(enter => {
                const result = enter.append("g").attr("fill", val => val.color);
                result.append("circle").attr("r", 10);
                result
                    .append("text")
                    .text(d => d.title)
                    .attr("stroke", "#505050")
                    .attr("text-anchor", "middle")
                    .attr("x", 0)
                    .attr("y", 35);
                return result;
            });

        function ticked() {
            this.link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            this.node.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
        }
    }

    draw() {
        this.link = this.link.data(this.links).join("line");

        this.node = this.node.data(this.nodes).join(
            enter => {
                const result = enter.append("g").attr("fill", val => val.color);
                result
                    .append("circle")
                    .attr("r", 0)
                    .call(enter => enter.transition().attr("r", 25));
                result
                    .append("text")
                    .text(d => d.title)
                    .attr("stroke", "#505050")
                    .attr("text-anchor", "middle")
                    .attr("x", 0)
                    .attr("y", 45);
                return result;
            },
            update => update,
            exit => exit.remove(),
        );

        this.simulation
            .nodes(this.nodes)
            .force("charge", d3.forceManyBody().strength(-200))
            .force(
                "link",
                d3
                    .forceLink(this.links)
                    .id((node: any) => node.id)
                    .distance(200),
            );
        this.simulation.alpha(1).restart();
    }
}
