import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import { Options } from "./Options";

export class Server {
    constructor(readonly options: Options) {}

    public app: express.Express;

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
            this.app.listen(Number(this.options.PORT), () => {
                console.log(`server listening on ${this.options.PORT}`);
                resolve();
            });
        });
    }
}
