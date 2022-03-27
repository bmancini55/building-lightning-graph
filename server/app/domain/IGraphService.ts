import { LightningGraph } from "./models/LightningGraph";
import { LightningGraphUpdate } from "./models/LightningGraphUpdate";

export type GraphUpdateCallback = (update: LightningGraphUpdate) => void;

export interface IGraphService {
    getGraph(): Promise<LightningGraph>;
    subscribeGraph(cb: GraphUpdateCallback): Promise<void>;
}
