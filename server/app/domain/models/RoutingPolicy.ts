export class RoutingPolicy {
    constructor(
        readonly disabled: boolean,
        readonly lastUpdate: number,
        readonly timeLockDelta: number,
        readonly feeBaseMsat: string,
        readonly feeRatePerMicroSat: string,
        readonly minHtlcMsat: string,
        readonly maxHtlcMsat: string,
    ) {}
}
