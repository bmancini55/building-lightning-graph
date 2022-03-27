import http from "http";
import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import { Options } from "./Options";
import { SocketServer } from "./SocketServer";
import { Lnd } from "./lnd/data/LndRestTypes";
import { LndGraphService } from "./lnd/domain/LndGraphService";

export class Server {
    public server: http.Server;
    public app: express.Express;
    public ss: SocketServer;

    constructor(readonly options: Options, readonly lnd: LndGraphService) {
        this.app = express();
    }

    public async setup() {
        this.app.use(bodyParser.json());
        this.app.use(compression());
        this.ss = new SocketServer();

        // mount routers here
        this.app.get("/api/graph", (req, res, next) => this.getGraph(req, res).catch(next));

        this.lnd.subscribeGraph((update: Lnd.GraphUpdate) => {
            this.ss.broadcastJSON(update);
        });
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

    protected async getGraph(req: express.Request, res: express.Response) {
        const graph = await this.lnd.getGraph();
        res.json(graph);
    }
}
