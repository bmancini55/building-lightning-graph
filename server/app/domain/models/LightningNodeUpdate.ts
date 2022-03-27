import { LightningNodeAddress } from "./LightningNodeAddress";
import { LightningNodeFeature } from "./LightningNodeFeature";

export class LightningNodeUpdate {
    constructor(
        readonly pubkey: string,
        readonly alias: string,
        readonly color: string,
        readonly addresses: LightningNodeAddress[],
        readonly features: LightningNodeFeature[],
    ) {}
}
