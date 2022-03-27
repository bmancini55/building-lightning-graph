import { LightningChannel } from "../../domain/models/LightningChannel";
import { LightningChannelClose } from "../../domain/models/LightningChannelClose";
import { LightningChannelUpdate } from "../../domain/models/LightningChannelUpdate";
import { LightningGraph } from "../../domain/models/LightningGraph";
import { LightningGraphUpdate } from "../../domain/models/LightningGraphUpdate";
import { LightningNode } from "../../domain/models/LightningNode";
import { LightningNodeAddress } from "../../domain/models/LightningNodeAddress";
import { LightningNodeFeature } from "../../domain/models/LightningNodeFeature";
import { LightningNodeUpdate } from "../../domain/models/LightningNodeUpdate";
import { RoutingPolicy } from "../../domain/models/RoutingPolicy";
import { Lnd } from "../data/LndRestTypes";

export class LndGraphFactory {
    public static createGraph(input: Lnd.Graph): LightningGraph {
        const graph = new LightningGraph();
        for (const node of input.nodes) {
            graph.addNode(this.createNode(node));
        }
        for (const channel of input.edges) {
            graph.addChannel(this.createChannel(channel));
        }
        return graph;
    }

    public static createNode(input: Lnd.LightningNode): LightningNode {
        return new LightningNode(
            input.pub_key,
            input.alias,
            input.color,
            this.createNodeAddresses(input.addresses),
            this.createNodeFeatures(input.features),
            input.last_update,
        );
    }

    public static createNodeAddresses(input: Lnd.NodeAddress[]): LightningNodeAddress[] {
        return input.map(address => new LightningNodeAddress(address.network, address.addr));
    }

    public static createNodeFeatures(input: Lnd.FeatureMap): LightningNodeFeature[] {
        const results: LightningNodeFeature[] = [];
        for (const [featureId, feature] of Object.entries(input)) {
            results.push(
                new LightningNodeFeature(
                    Number(featureId),
                    feature.name,
                    feature.is_required,
                    feature.is_known,
                ),
            );
        }
        return results;
    }

    public static createChannel(input: Lnd.ChannelEdge): LightningChannel {
        return new LightningChannel(
            input.channel_id,
            input.chan_point,
            input.node1_pub,
            input.node2_pub,
            input.capacity,
            input.last_update,
            this.createRoutingPolicy(input.node1_policy),
            this.createRoutingPolicy(input.node2_policy),
        );
    }

    public static createRoutingPolicy(input: Lnd.RoutingPolicy): RoutingPolicy {
        return new RoutingPolicy(
            input.disabled,
            input.last_update,
            input.time_lock_delta,
            input.fee_base_msat,
            input.fee_rate_milli_msat,
            input.min_htlc,
            input.max_htlc_msat,
        );
    }

    public static createUpdate(input: Lnd.GraphUpdate): LightningGraphUpdate {
        return new LightningGraphUpdate(
            input.result.node_updates.map(update => this.createNodeUpdate(update)),
            input.result.channel_updates.map(update => this.createChannelUpdate(update)),
            input.result.closed_chans.map(close => this.createChannelClose(close)),
        );
    }

    public static createNodeUpdate(input: Lnd.NodeUpdate): LightningNodeUpdate {
        return new LightningNodeUpdate(
            input.identity_key,
            input.alias,
            input.color,
            this.createNodeAddresses(input.node_addresses),
            this.createNodeFeatures(input.features),
        );
    }

    public static createChannelUpdate(input: Lnd.ChannelEdgeUpdate): LightningChannelUpdate {
        return new LightningChannelUpdate(
            input.chan_id,
            input.advertising_node,
            this.createRoutingPolicy(input.routing_policy),
        );
    }

    public static createChannelClose(input: Lnd.ClosedChannelUpdate): LightningChannelClose {
        return new LightningChannelClose(input.chan_id, input.closed_height);
    }
}
