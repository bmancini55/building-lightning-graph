import React, { useRef, useEffect, useContext } from "react";

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

export function useSocket<T>(channel: string, handler: (data: T) => void) {
    // Obtain the socket from the context
    const { socket } = useContext(SocketContext);

    // Attach the listener to the socket when the
    useEffect(() => {
        // Construct a listener function that parses the event from JSON
        // and calls the handler with the data if we are subscribing to
        // the requested channel.
        console.log("Adding listener for channel:", channel);
        const listener = async e => {
            try {
                const text = await e.data.text();
                const obj = JSON.parse(text);
                if (obj.channel == channel) {
                    handler(obj.data);
                }
            } catch (ex) {
                console.error("Failed to parse ws payload", ex);
            }
        };
        socket.addEventListener("message", listener);

        // Remove the handler from the socket when the component unmounts
        return () => {
            console.log("Removing listener for channel:", channel);
            socket.removeEventListener("message", listener);
        };
    }, [handler]);
}
