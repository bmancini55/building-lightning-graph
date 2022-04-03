import express from "express";
import { IGraphService } from "../domain/IGraphService";

export function graphApi(graphService: IGraphService): express.Router {
    const router = express();
    router.get("/api/graph", (req, res, next) => getGraph(req, res).catch(next));
    return router;

    async function getGraph(req: express.Request, res: express.Response) {
        const graph = await graphService.getGraph();
        res.json(graph);
    }
}
