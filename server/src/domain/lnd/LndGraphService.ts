import { IGraphService } from "../IGraphService";
import { LndRestClient } from "./LndRestClient";
import { Lnd } from "./LndRestTypes";
import { EventEmitter } from "stream";

/**
 * Provides an adapter for retrieving and subscribing to LND graph data
 */
export class LndGraphService extends EventEmitter implements IGraphService {
    constructor(readonly lnd: LndRestClient) {
        super();
    }

    /**
     * Loads a graph from LND and converts it from the LND graph format
     * into the graph format that our application understands.
     * @returns
     */
    public async getGraph(): Promise<Lnd.Graph> {
        return await this.lnd.getGraph();
    }

    /**
     * Subscribes to LND graph updates and emits `update` events.
     * @param cb
     * @returns
     */
    public async subscribeGraph(): Promise<void> {
        // subscribe to the graph update channel
        return this.lnd.subscribeGraph((update: Lnd.GraphUpdate) => {
            this.emit("update", update);
        });
    }
}

/**
 * Adds type checking for the emit event
 */
export interface LndGraphService {
    emit(event: "update", update: Lnd.GraphUpdate);
}
