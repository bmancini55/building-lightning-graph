import { IncomingMessage, Server } from "http";
import { Duplex } from "stream";
import { WebSocket, WebSocketServer } from "ws";

export class SocketServer {
    public wss: WebSocketServer;
    protected sockets: Set<WebSocket>;
    protected server: Server;

    constructor() {
        this.sockets = new Set();
        this.wss = new WebSocketServer({ noServer: true });
    }

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

    public broadcast(buf: Buffer) {
        for (const socket of this.sockets.values()) {
            console.log("sending", buf.toString());
            socket.send(buf);
        }
    }

    protected onSocketClose(ws: WebSocket) {
        console.log("removing socket");
        this.sockets.delete(ws);
    }

    protected onSocketMessage(data: Buffer) {
        //
    }
}
