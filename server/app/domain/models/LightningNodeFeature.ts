export class LightningNodeFeature {
    constructor(
        readonly featureId: number,
        readonly name: string,
        readonly isRequired: boolean,
        readonly isKnown: boolean,
    ) {}
}
