export class LightningChannelClose {
    constructor(readonly channelId: string, readonly closedHeight: number) {}
}
