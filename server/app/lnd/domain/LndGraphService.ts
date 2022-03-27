import { GraphUpdateCallback } from "../../domain/IGraphService";
import { LightningGraph } from "../../domain/models/LightningGraph";
import { LndRestClient } from "../data/LndRestClient";
import { LndGraphFactory } from "./LndGraphFactory";

export class LndGraphService {
    constructor(readonly lnd: LndRestClient) {}

    public async getGraph(): Promise<LightningGraph> {
        const lndGraph = await this.lnd.getGraph();
        return LndGraphFactory.createGraph(lndGraph);
    }

    public async subscribeGraph(cb: GraphUpdateCallback): Promise<void> {
        return this.lnd.subscribeGraph(lndUpdate => {
            const update = LndGraphFactory.createUpdate(lndUpdate);
            cb(update);
        });
    }
}
