import { LightningGraph } from "../../domain/models/LightningGraph";
import { LightningGraphUpdate } from "../../domain/models/LightningGraphUpdate";
import { LndRestClient } from "../data/LndRestClient";
import { LndGraphFactory } from "./LndGraphFactory";

export type GraphUpdateCallback = (update: LightningGraphUpdate) => void;

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
