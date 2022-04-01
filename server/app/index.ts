import { LndGraphAdapter } from "./domain/lnd/LndGraphAdapter";
import { LndRestClient } from "./domain/lnd/LndRestClient";
import { Options } from "./Options";
import { Server } from "./Server";

async function run() {
    const options = await Options.fromEnv();
    const lnd = new LndRestClient(options.lndHost, options.lndReadonlyMacaroon, options.lndCert);
    const lndService = new LndGraphAdapter(lnd);
    const server = new Server(options, lndService);
    await server.setup();
    await server.listen();
}

run().catch(ex => {
    console.error(ex);
    process.exit(1);
});
