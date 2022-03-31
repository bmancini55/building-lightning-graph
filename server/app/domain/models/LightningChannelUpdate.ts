import { RoutingPolicy } from "./RoutingPolicy";

export class LightningChannelUpdate {
    constructor(
        readonly channelId: string,
        readonly nodeId1: string,
        readonly nodeId2: string,
        readonly routingPolicy: RoutingPolicy,
    ) {}
}
