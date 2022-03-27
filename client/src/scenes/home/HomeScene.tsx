import React, { useEffect, useState } from "react";
import { useApi } from "../../hooks/UseApi";
import { LightningGraph } from "../../services/ApiService";

export const HomeScene = () => {
    const api = useApi();
    const [graph, setGraph] = useState<LightningGraph>();

    useEffect(() => {
        api.fetchGraph().then(result => {
            setGraph(result);
        });
    }, []);

    return (
        <div className="container">
            <h1>Welcome</h1>
        </div>
    );
};
