import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import { Options } from "./Options";

export class Server {
    public app: express.Express;

    constructor(readonly options: Options) {}

    public async setup() {
        this.app = express();

        // add JSON body parsing
        this.app.use(bodyParser.json());

        // add GZIP compression to responses
        this.app.use(compression());

        // mount routers here
    }

    public async listen(): Promise<void> {
        return new Promise(resolve => {
            this.app.listen(Number(this.options.port), () => {
                console.log(`server listening on ${this.options.port}`);
                resolve();
            });
        });
    }
}
