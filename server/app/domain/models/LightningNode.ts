import { LightningNodeAddress } from "./LightningNodeAddress";
import { LightningNodeFeature } from "./LightningNodeFeature";

export class LightningNode {
    constructor(
        public pubkey: string,
        public alias: string,
        public color: string,
        public addresses: LightningNodeAddress[],
        public features: LightningNodeFeature[],
        public lastUpdate: number,
    ) {}
}
