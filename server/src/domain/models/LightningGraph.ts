import { LightningNode } from "./LightningNode";
import { LightningChannel } from "./LightningChannel";

export class LightningGraph {
    public nodes: LightningNode[];
    public channels: LightningChannel[];

    constructor() {
        this.nodes = [];
        this.channels = [];
    }

    public addNode(node: LightningNode): void {
        this.nodes.push(node);
    }

    public addChannel(channel: LightningChannel): void {
        this.channels.push(channel);
    }
}
