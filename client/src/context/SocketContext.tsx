import React, { useRef, useEffect } from "react";

export const SocketContext = React.createContext<{ socket: WebSocket }>({ socket: null });

export const SocketProvider = ({ children }) => {
    // Persist socket instance between renders using useRef hook
    const socket = useRef(new WebSocket("ws://localhost:8001/ws"));

    // When the provider mounts, it will be initialized and the listener
    // will be registered.
    useEffect(() => {
        socket.current.addEventListener("open", () => {
            console.log("Websocket connected");
        });

        // When the provider unmounts, we'll disconnect the websocket
        return () => {
            if (socket?.current) {
                socket.current.close();
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket: socket.current }}>
            {children}
        </SocketContext.Provider>
    );
};
