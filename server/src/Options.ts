import "dotenv/config";
import fs from "fs/promises";

/**
 * Options and configurations used by the application
 */
export class Options {
    /**
     * Constructs an Options instance from environment variables
     * @returns
     */
    public static async fromEnv(): Promise<Options> {
        const port = Number(process.env.PORT);
        const host: string = process.env.LND_HOST;
        const macaroon: Buffer = await fs.readFile(process.env.LND_READONLY_MACAROON_PATH);

        // Exercise: Using fs.readFile read the file in the LND_CERT_PATH
        // environment variable
        const cert: Buffer = undefined;

        return new Options(port, host, macaroon, cert);
    }

    constructor(
        readonly port: number,
        readonly lndHost: string,
        readonly lndReadonlyMacaroon: Buffer,
        readonly lndCert: Buffer,
    ) {}
}
