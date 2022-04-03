import { LightningGraph } from "./models/LightningGraph";
import { LightningGraphUpdate } from "./models/LightningGraphUpdate";

export interface IGraphService {
    getGraph(): Promise<LightningGraph>;
    subscribeGraph(): Promise<void>;
    on(event: "update", handler: (update: LightningGraphUpdate) => void): void;
}
