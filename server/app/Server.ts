import http from "http";
import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import { Options } from "./Options";
import { SocketServer } from "./SocketServer";
import { LightningGraphUpdate } from "./domain/models/LightningGraphUpdate";
import { IGraphService } from "./domain/IGraphService";

export class Server {
    public server: http.Server;
    public app: express.Express;
    public ss: SocketServer;

    constructor(readonly options: Options, readonly graphService: IGraphService) {
        this.app = express();
    }

    public async setup() {
        this.app.use(bodyParser.json());
        this.app.use(compression());
        this.ss = new SocketServer();

        // mount routers here
        this.app.get("/api/graph", (req, res, next) => this.getGraph(req, res).catch(next));

        this.graphService.subscribeGraph((update: LightningGraphUpdate) => {
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
        const graph = await this.graphService.getGraph();
        res.json(graph);
    }
}
