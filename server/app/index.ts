import { LndRestClient } from "./LndRestClient";
import { Options } from "./Options";
import { Server } from "./Server";

async function run() {
    const options = await Options.fromEnv();
    const lnd = new LndRestClient(options.lndHost, options.lndReadonlyMacaroon, options.lndCert);
    const server = new Server(options, lnd);
    await server.setup();
    await server.listen();
}

run().catch(ex => {
    console.error(ex);
    process.exit(1);
});
