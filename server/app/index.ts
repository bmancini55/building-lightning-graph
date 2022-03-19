import { options } from "./Options";
import { Server } from "./Server";

async function run() {
    // additional configurations here
    const server = new Server(options);
    await server.setup();
    await server.listen();
}

run().catch(ex => {
    console.error(ex);
    process.exit(1);
});
