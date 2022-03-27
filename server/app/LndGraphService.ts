import { Lnd, LndRestClient } from "./LndRestClient";

export class LndGraphService {
    constructor(readonly lnd: LndRestClient) {}

    public async getGraph(): Promise<Lnd.Graph> {
        return await this.lnd.getGraph();
    }

    public async subscribeGraph(cb: (update: Lnd.GraphUpdate) => void): Promise<void> {
        return this.lnd.subscribeGraph(cb);
    }
}
