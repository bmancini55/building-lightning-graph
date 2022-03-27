import { RoutingPolicy } from "./RoutingPolicy";
export class LightningChannel {
    constructor(
        readonly channelId: string,
        readonly channelPoint: string,
        readonly node1PubKey: string,
        readonly node2PubKey: string,
        readonly capacity: string,
        public updated: string,
        public node1Policy: RoutingPolicy,
        public node2Policy: RoutingPolicy,
    ) {}
}
