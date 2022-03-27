import { LndGraphService } from "./LndGraphService";
import { LndRestClient } from "./LndRestClient";
import { Options } from "./Options";
import { Server } from "./Server";

async function run() {
    const options = await Options.fromEnv();
    const lnd = new LndRestClient(options.lndHost, options.lndReadonlyMacaroon, options.lndCert);
    const lndService = new LndGraphService(lnd);
    const server = new Server(options, lndService);
    await server.setup();
    await server.listen();
}

run().catch(ex => {
    console.error(ex);
    process.exit(1);
});
