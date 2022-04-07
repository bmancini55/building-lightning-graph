import express from "express";
import { IGraphService } from "../domain/IGraphService";

/**
 * Constructs an Express router for handling application API calls
 * related to the graph. We use a function so we can easily supply
 * dependencies to the handler, making testing easier.
 * @param graphService
 * @returns
 */
export function graphApi(graphService: IGraphService): express.Router {
    // Construct a router object
    const router = express();

    // Adds a handler for returning the graph. By default express does not
    // understand async code, but we can easily adapt Express by calling
    // a promise based handler and if it fails catching the error and
    // supplying it with `next` to allow Express to handle the error.
    router.get("/api/graph", (req, res, next) => getGraph(req, res).catch(next));

    /**
     * Handler that obtains the graph and returns it via JSON
     */
    async function getGraph(req: express.Request, res: express.Response) {
        const graph = await graphService.getGraph();
        res.json(graph);
    }

    return router;
}
