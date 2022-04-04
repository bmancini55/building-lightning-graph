import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";

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
