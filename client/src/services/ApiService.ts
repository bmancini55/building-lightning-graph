import { LightningGraph } from "../../../server/app/domain/models/LightningGraph";

export { LightningGraph } from "../../../server/app/domain/models/LightningGraph";
export { LightningNode } from "../../../server/app/domain/models/LightningNode";
export { LightningChannel } from "../../../server/app/domain/models/LightningChannel";
export { LightningGraphUpdate } from "../../../server/app/domain/models/LightningGraphUpdate";
export { LightningNodeUpdate } from "../../../server/app/domain/models/LightningNodeUpdate";
export { LightningChannelUpdate } from "../../../server/app/domain/models/LightningChannelUpdate";
export { LightningChannelClose } from "../../../server/app/domain/models/LightningChannelClose";

export class ApiService {
    constructor(readonly host: string = "http://127.0.0.1:8001") {}

    protected async get<T>(path: string): Promise<T> {
        const res = await fetch(path, { credentials: "include" });
        return await res.json();
    }

    public fetchGraph(): Promise<LightningGraph> {
        return this.get("/api/graph");
    }
}
