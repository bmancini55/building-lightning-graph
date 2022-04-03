import { LightningChannelClose } from "./LightningChannelClose";
import { LightningChannelUpdate } from "./LightningChannelUpdate";
import { LightningNodeUpdate } from "./LightningNodeUpdate";

export class LightningGraphUpdate {
    constructor(
        readonly nodeUpdates: LightningNodeUpdate[],
        readonly channelUpdates: LightningChannelUpdate[],
        readonly channelCloses: LightningChannelClose[],
    ) {}
}
