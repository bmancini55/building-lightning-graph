import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";
import { Layout } from "./scenes/layout/LayoutScene";

ReactDom.render(
    <SocketProvider>
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    </SocketProvider>,
    document.getElementById("app"),
);
