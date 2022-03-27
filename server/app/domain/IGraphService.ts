import { LightningGraph } from "./models/LightningGraph";
import { LightningGraphUpdate } from "./models/LightningGraphUpdate";

export interface IGraphService {
    getGraph(): Promise<LightningGraph>;
    subscribeGraph(cb: (update: LightningGraphUpdate) => void): Promise<void>;
}
