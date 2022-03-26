import http from "http";
import express from "express";
import ws from "ws";
import compression from "compression";
import bodyParser from "body-parser";
import { Options } from "./Options";
import { SocketServer } from "./SocketServer";

export class Server {
    public server: http.Server;
    public app: express.Express;
    public ss: SocketServer;

    constructor(readonly options: Options) {
        this.app = express();
    }

    public async setup() {
        this.app.use(bodyParser.json());
        this.app.use(compression());
        this.ss = new SocketServer();

        // mount routers here
    }

    public async listen(): Promise<void> {
        return new Promise(resolve => {
            this.server = this.app.listen(Number(this.options.port), () => {
                console.log(`server listening on ${this.options.port}`);
                this.ss.listen(this.server);
                resolve();
            });
        });
    }
}
