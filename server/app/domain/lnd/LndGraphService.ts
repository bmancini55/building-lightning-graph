import { GraphUpdateCallback, IGraphService } from "../IGraphService";
import { LightningGraph } from "../models/LightningGraph";
import { LndRestClient } from "./LndRestClient";
import { LightningChannel } from "../models/LightningChannel";
import { LightningNode } from "../models/LightningNode";
import { Lnd } from "./LndRestTypes";
import { LightningChannelClose } from "../models/LightningChannelClose";
import { LightningChannelUpdate } from "../models/LightningChannelUpdate";
import { LightningGraphUpdate } from "../models/LightningGraphUpdate";
import { LightningNodeUpdate } from "../models/LightningNodeUpdate";

/**
 * Provides an adapter for retrieving and subscribing to LND graph data
 */
export class LndGraphService implements IGraphService {
    constructor(readonly lnd: LndRestClient) {}

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
     * Subscribes to graph updates by calling the callback function for
     * every update we receive.
     * @param cb
     * @returns
     */
    public async subscribeGraph(cb: GraphUpdateCallback): Promise<void> {
        // subscribe to the graph update channel
        return this.lnd.subscribeGraph((lndUpdate: Lnd.GraphUpdate) => {
            // convert the node updates into one that our application can
            // understand
            const nodeUpdates = lndUpdate.result.node_updates.map(
                (update: Lnd.NodeUpdate) =>
                    new LightningNodeUpdate(update.identity_key, update.alias, update.color),
            );

            // conver the channel update into one that our application can
            // understand
            const channelUpdates = lndUpdate.result.channel_updates.map(
                (update: Lnd.ChannelEdgeUpdate) =>
                    new LightningChannelUpdate(
                        update.chan_id,
                        update.advertising_node,
                        update.connecting_node,
                    ),
            );

            // convert the channel closures into one that our application can
            // understand
            const channelClosures = lndUpdate.result.closed_chans.map(
                (update: Lnd.ClosedChannelUpdate) =>
                    new LightningChannelClose(update.chan_id, update.closed_height),
            );

            const update = new LightningGraphUpdate(nodeUpdates, channelUpdates, channelClosures);
            cb(update);
        });
    }
}
