import { LightningGraph } from "../../../server/app/domain/models/LightningGraph";

export { LightningGraph } from "../../../server/app/domain/models/LightningGraph";
export { LightningNode } from "../../../server/app/domain/models/LightningNode";
export { LightningChannel } from "../../../server/app/domain/models/LightningChannel";

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
