import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppNav } from "./components/AppNav";
import { HomeScene } from "../home/HomeScene";

export const Layout = () => {
    return (
        <div className="layout">
            <div className="container-fluid mb-3">
                <AppNav />
            </div>
            <Routes>
                <Route path="/" element={<HomeScene />} />
            </Routes>
        </div>
    );
};
