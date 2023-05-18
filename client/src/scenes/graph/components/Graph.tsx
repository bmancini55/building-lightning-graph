import React from "react";
import * as d3 from "d3";
import { Lnd } from "../../../services/ApiTypes";

interface D3Node {
    id: string;
    color: string;
    title: string;
}

interface D3Link {
    id: string;
    source: string;
    target: string;
}

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
export class Graph extends React.Component {
    protected svgRef: SVGElement;
    protected svg: any;
    protected simulation: any;
    protected nodes: D3Node[];
    protected links: D3Link[];
    protected nodeElements: any;
    protected linkElements: any;

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <svg ref={elem => (this.svgRef = elem)} />;
    }

    createGraph(graph: Lnd.Graph) {
        // map the graph nodes into simple objects that d3 will use
        // during rendering
        if("nodes" in graph && Array.isArray(graph.nodes)) {
            this.nodes = graph.nodes.map(node => ({
                id: node.pub_key,
                color: node.color,
                title: node.alias,
            }));
        }

        // map the graph channels into simple objects that d3 will use
        // during rendering
        if("edges" in graph && Array.isArray(graph.edges)) {
            this.links = graph.edges.map(channel => ({
                source: channel.node1_pub,
                target: channel.node2_pub,
                id: channel.channel_id,
            }));
        }

        // construct the initial svg container
        const width = this.svgRef.parentElement.clientWidth;
        const height = this.svgRef.parentElement.clientHeight;
        this.svg = d3
            .select(this.svgRef)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "background-color: #f0f0f0");

        // construct container for links
        this.svg
            .append("g")
            .attr("class", "links")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", 1.5)
            .attr("stroke-linecap", "round");

        // construct container for nodes
        this.svg
            .append("g")
            .attr("class", "nodes")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 1.5);

        // construct the initial simulation but start it at the end since
        // the draw method will take care of adding elements and starting
        // the simulation
        this.simulation = d3
            .forceSimulation()
            .force("charge", d3.forceManyBody().strength(-200).distanceMax(1000))
            .force("center", d3.forceCenter())
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .on("tick", () => {
                this.linkElements
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);

                this.nodeElements.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
            })
            .alpha(0);

        this.draw();
    }

    updateGraph(update: Lnd.GraphUpdate) {
        // Updates existing nodes or adds new ones if they don't already
        // exist in the graph
        for (const nodeUpdate of update.result.node_updates) {
            const node = this.nodes.find(p => p.id === nodeUpdate.identity_key);
            if (node) {
                node.title = nodeUpdate.alias;
                node.color = nodeUpdate.color;
            } else {
                this.nodes.push({
                    id: nodeUpdate.identity_key,
                    color: nodeUpdate.color,
                    title: nodeUpdate.alias,
                });
            }
        }

        // Adds new channels to the graph. Note that for the purposes of
        // our visualization we only care that a link exists. We will end
        // up receiving two updates, one from each node and we just add
        // the first one.
        for (const channelUpdate of update.result.channel_updates) {
            const channel = this.links.find(p => p.id === channelUpdate.chan_id);
            // add node 1 if not exists
            if(!this.nodes.find(p => p.id === channelUpdate.advertising_node)) {
                this.nodes.push({
                    id: channelUpdate.advertising_node,
                    color: "",
                    title: "",
                })
            }

            // add node 2 if not exists
            if(!this.nodes.find(p => p.id === channelUpdate.connecting_node)) {
                this.nodes.push({
                    id: channelUpdate.connecting_node,
                    color: "",
                    title: "",
                })
            }

            if (!channel) {
                this.links.push({
                    source: channelUpdate.advertising_node,
                    target: channelUpdate.connecting_node,
                    id: channelUpdate.chan_id,
                });
            }
        }

        // Remove closed channels from `this.links`
        for (const channelClose of update.result.closed_chans) {
            const index = this.links.findIndex(p => p.id === channelClose.chan_id);
            this.links.splice(index, 1);
        }

        this.draw();
    }

    draw() {
        // constructs the node elements
        this.nodeElements = this.svg
            .select(".nodes")
            .selectAll("g")
            .data(this.nodes)
            .join(
                enter => {
                    const result = enter
                        .append("g")
                        .attr("class", "node")
                        .attr("fill", val => val.color);
                    result
                        .append("circle")
                        .attr("r", 0)
                        .call(enter => enter.transition().attr("r", 10));
                    result
                        .append("text")
                        .text(d => d.title)
                        .attr("stroke", "#000000")
                        .attr("stroke-width", 1)
                        .attr("text-anchor", "middle")
                        .attr("x", 0)
                        .attr("y", 35);
                    return result;
                },
                update => update,
                exit => exit.remove(),
            );

        // constructs the link elements
        this.linkElements = this.svg
            .select(".links")
            .selectAll("line")
            .data(this.links)
            .join("line");

        // restarts the simulation with the latest data
        this.simulation
            .nodes(this.nodes)
            .force(
                "link",
                d3
                    .forceLink(this.links)
                    .id((node: any) => node.id)
                    .distance(100),
            )
            .alpha(1)
            .restart();
    }
}
