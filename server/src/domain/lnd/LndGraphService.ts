import { IGraphService } from "../IGraphService";
import { LightningGraph } from "../models/LightningGraph";
import { LndRestClient } from "./LndRestClient";
import { LightningChannel } from "../models/LightningChannel";
import { LightningNode } from "../models/LightningNode";
import { Lnd } from "./LndRestTypes";
import { LightningChannelClose } from "../models/LightningChannelClose";
import { LightningChannelUpdate } from "../models/LightningChannelUpdate";
import { LightningGraphUpdate } from "../models/LightningGraphUpdate";
import { LightningNodeUpdate } from "../models/LightningNodeUpdate";
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
    public async getGraph(): Promise<LightningGraph> {
        // Load the graph from LND
        const lndGraph: Lnd.Graph = await this.lnd.getGraph();

        // Construct a new domain graph
        const graph = new LightningGraph();

        // Convert and add all nodes
        for (const node of lndGraph.nodes) {
            graph.addNode(new LightningNode(node.pub_key, node.alias, node.color));
        }

        // Convert and add all channels
        for (const edge of lndGraph.edges) {
            graph.addChannel(new LightningChannel(edge.channel_id, edge.node1_pub, edge.node2_pub));
        }
        return graph;
    }

    /**
     * Subscribes to LND graph updates and emits `update` events.
     * @param cb
     * @returns
     */
    public async subscribeGraph(): Promise<void> {
        // subscribe to the graph update channel
        return this.lnd.subscribeGraph((lndUpdate: Lnd.GraphUpdate) => {
            // convert the LND node updates into our application's Lightning Node Update
            const nodeUpdates: LightningNodeUpdate[] = lndUpdate.result.node_updates.map(
                (update: Lnd.NodeUpdate) =>
                    new LightningNodeUpdate(update.identity_key, update.alias, update.color),
            );

            // convert the channel update into one that our application can
            // understand
            const channelUpdates: LightningChannelUpdate[] = lndUpdate.result.channel_updates.map(
                (update: Lnd.ChannelEdgeUpdate) =>
                    new LightningChannelUpdate(
                        update.chan_id,
                        update.advertising_node,
                        update.connecting_node,
                    ),
            );

            // convert the channel closures into one that our application can
            // understand
            const channelClosures: LightningChannelClose[] = lndUpdate.result.closed_chans.map(
                (update: Lnd.ClosedChannelUpdate) =>
                    new LightningChannelClose(update.chan_id, update.closed_height),
            );

            const update: LightningGraphUpdate = new LightningGraphUpdate(
                nodeUpdates,
                channelUpdates,
                channelClosures,
            );

            this.emit("update", update);
        });
    }
}

/**
 * Adds type checking for the emit event
 */
export interface LndGraphService {
    emit(event: "update", update: LightningGraphUpdate);
}
