import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppNav } from "./components/AppNav";
import { GraphScene } from "../graph/GraphScene";

export const LayoutScene = () => {
    return (
        <div className="layout">
            <div className="container-fluid mb-3">
                <AppNav />
            </div>
            <Routes>
                <Route path="/" element={<GraphScene />} />
            </Routes>
        </div>
    );
};
