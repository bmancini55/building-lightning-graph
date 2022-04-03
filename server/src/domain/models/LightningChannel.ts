export class LightningChannel {
    constructor(
        readonly channelId: string,
        readonly node1PubKey: string,
        readonly node2PubKey: string,
    ) {}
}
