import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppNav } from "./components/AppNav";
import { HomeScene } from "../home/HomeScene";

export const Layout = () => {
    return (
        <div className="layout">
            <div className="content">
                <div className="container">
                    <AppNav />
                </div>
                <div className="container mt-3">
                    <Routes>
                        <Route path="/" element={<HomeScene />} />
                    </Routes>
                </div>
            </div>
            <footer className="footer">
                <div>Copyright &copy; {new Date().getFullYear()}</div>
            </footer>
        </div>
    );
};
