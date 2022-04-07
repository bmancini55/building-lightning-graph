import React, { useEffect, useRef } from "react";
import { useSocket } from "../../hooks/UseSocket";
import { useApi } from "../../hooks/UseApi";
import { Lnd } from "../../services/ApiTypes";
import { Graph } from "./components/Graph";

export const GraphScene = () => {
    const api = useApi();
    const graphRef = useRef<Graph>();

    useEffect(() => {
        api.fetchGraph().then((graph: Lnd.Graph) => {
            console.log("got the graph");
            graphRef.current.createGraph(graph);
        });
    }, []);

    useSocket("graph", (update: Lnd.GraphUpdate) => {
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
