import { RoutingPolicy } from "./RoutingPolicy";

export class LightningChannelUpdate {
    constructor(
        readonly channelId: string,
        readonly nodeId: string,
        readonly routingPolicy: RoutingPolicy,
    ) {}
}

// export interface GraphUpdate {
//     node_updates: NodeUpdate[];
//     channel_updates: ChannelEdgeUpdate[];
//     closed_chans: ClosedChannelUpdate[];
// }
