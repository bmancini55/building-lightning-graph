import React from "react";
import * as d3 from "d3";
import { LightningChannel, LightningGraph, LightningNode } from "../../../services/ApiService";

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

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <svg ref={elem => (this.svgRef = elem)} />;
    }

    updateGraph(graph: LightningGraph) {
        this._initializeGraph(graph);
    }

    _initializeGraph = (graph: LightningGraph) => {
        const width = this.svgRef.parentElement.clientWidth;
        const height = this.svgRef.parentElement.clientHeight;
        const svg = d3
            .select(this.svgRef)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "background-color: #f0f0f0");

        this.create(
            graph.nodes,
            graph.channels,
            svg,
            (p: any) => p.pubkey,
            (p: any) => p.color,
            (p: any) => p.alias ?? p.pubkey,
            (p: any) => p.node1PubKey,
            (p: any) => p.node2PubKey,
        );
    };

    /**
     * Code largely based on example:
     * https://observablehq.com/@d3/force-directed-graph
     */
    create(
        nodes: any,
        links: any,
        svg: any,
        nodeId: (n: any) => string,
        nodeColor: (n: any) => string,
        nodeTitle: (n: any) => string,
        linkSource: (l: any) => string,
        linkTarget: (l: any) => string,
    ) {
        // Compute values.
        const N = d3.map(nodes, nodeId);
        const LS = d3.map(links, linkSource);
        const LT = d3.map(links, linkTarget);
        const T = d3.map(nodes, nodeTitle);
        const C = d3.map(nodes, nodeColor);

        // Replace the input nodes and links with mutable objects for the simulation.
        nodes = d3.map(nodes, (_, i) => ({ id: N[i], color: C[i] }));
        links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

        // Construct the simulation
        const forceNode = d3.forceManyBody().strength(-100);
        const forceLink = d3
            .forceLink(links)
            .id(({ index: i }) => N[i])
            .distance(200);

        const simulation = d3
            .forceSimulation(nodes)
            .force("link", forceLink)
            .force("charge", forceNode)
            .force("center", d3.forceCenter())
            .on("tick", ticked);

        const link = svg
            .append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", 1.5)
            .attr("stroke-linecap", "round")
            .selectAll("line")
            .data(links)
            .join("line");

        const node = svg
            .append("g")
            .selectAll("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 1.5)
            .data(nodes)
            .enter()
            .append("g")
            .attr("fill", val => val.color);

        // add circle to node
        node.append("circle").attr("r", 25);

        // add text to node
        node.append("text")
            .text(d => T[d.index])
            .attr("stroke", "#505050")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", 45);

        function ticked() {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
        }
    }
}
