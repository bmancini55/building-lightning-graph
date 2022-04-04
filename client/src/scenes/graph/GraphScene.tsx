import React, { useEffect, useRef } from "react";
import { useSocket } from "../../hooks/UseSocket";
import { useApi } from "../../hooks/UseApi";
import { LightningGraphUpdate } from "../../services/ApiTypes";
import { Graph } from "./components/Graph";

export const GraphScene = () => {
    const api = useApi();
    const graphRef = useRef<Graph>();

    useEffect(() => {
        api.fetchGraph().then(graph => {
            console.log("got the graph");
            graphRef.current.createGraph(graph);
        });
    }, []);

    useSocket("graph", (update: LightningGraphUpdate) => {
        console.log(update);
        graphRef.current.updateGraph(update);
    });

    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                <div className="col h-100">{<Graph ref={graphRef} />}</div>
            </div>
        </div>
    );
};
