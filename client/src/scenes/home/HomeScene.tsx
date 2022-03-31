import React, { useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import { useApi } from "../../hooks/UseApi";
import { LightningGraphUpdate } from "../../services/ApiService";
import { AppGraph } from "./components/AppGraph";

export const HomeScene = () => {
    const api = useApi();
    const graphRef = useRef<AppGraph>();

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
                <div className="col h-100">{<AppGraph ref={graphRef} />}</div>
            </div>
        </div>
    );
};
