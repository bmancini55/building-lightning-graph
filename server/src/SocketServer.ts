import { IncomingMessage, Server } from "http";
import { Duplex } from "stream";
import { WebSocket, WebSocketServer } from "ws";

/**
 * Implements a generic socket server that maintains a `Set` of connected
 * sockets. This class allows us to broadcast messages to all connected
 * sockets.
 */
export class SocketServer {
    public wss: WebSocketServer;
    protected sockets: Set<WebSocket>;
    protected server: Server;

    constructor() {
        this.sockets = new Set();
        this.wss = new WebSocketServer({ noServer: true });
    }

    /**
     * Listens to an HTTP server for connection upgrades. Upon successful
     * upgrade, the websocket is added to a list of connected sockets.
     * @param server
     */
    public listen(server: Server) {
        this.server = server;
        server.on("upgrade", (request: IncomingMessage, socket: Duplex, head: Buffer) => {
            if (request.url !== "/ws") {
                console.log("Unknown socket path", request.url);
                return;
            }

            this.wss.handleUpgrade(request, socket, head, ws => {
                console.log("adding socket");
                this.wss.emit("connection", ws, request);
                this.sockets.add(ws);
                ws.on("close", this.onSocketClose.bind(this, ws));
                ws.on("message", this.onSocketMessage.bind(this, ws));
            });
        });
    }

    /**
     * Broadcast a message to all connected sockets on the supplied channel.
     * @param channel
     * @param data
     */
    public broadcast(channel: string, data: object) {
        const payload = {
            channel,
            data,
        };
        const buf = Buffer.from(JSON.stringify(payload));
        for (const socket of this.sockets.values()) {
            socket.send(buf);
        }
    }

    /**
     * Handles when a socket closes
     * @param ws
     */
    protected onSocketClose(ws: WebSocket) {
        console.log("removing socket");
        this.sockets.delete(ws);
    }

    /**
     * Handles when we receive a message from a socket.
     * @param data
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onSocketMessage(data: Buffer) {
        // Our application does not currently listen to client messages,
        // but if it did, we could parse and handle messages here.
    }
}
