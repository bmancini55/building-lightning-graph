import React, { useEffect, useRef } from "react";
import { useApi } from "../../hooks/UseApi";
import { AppGraph } from "./components/AppGraph";

export const HomeScene = () => {
    const api = useApi();
    const graphRef = useRef<AppGraph>();

    useEffect(() => {
        api.fetchGraph().then(graph => {
            console.log("got the graph");
            graphRef.current.updateGraph(graph);
        });
    }, []);

    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                <div className="col h-100">{<AppGraph ref={graphRef} />}</div>
            </div>
        </div>
    );
};
