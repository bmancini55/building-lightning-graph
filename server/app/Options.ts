import "dotenv/config";
import fs from "fs/promises";

export class Options {
    public static env = {
        PORT: process.env.PORT,
        LND_HOST: process.env.LND_HOST,
        LND_READONLY_MACAROON_PATH: process.env.LND_READONLY_MACAROON_PATH,
        LND_CERT_PATH: process.env.LND_CERT_PATH,
    };

    public static async fromEnv(): Promise<Options> {
        for (const [key, value] of Object.entries(Options.env)) {
            if (!value) {
                throw new Error(`Required option ENV.${key} is not defined`);
            }
        }

        const port = Number(Options.env.PORT);
        const lndHost = Options.env.LND_HOST;
        const lndReadonlyMacaroon = await fs.readFile(Options.env.LND_READONLY_MACAROON_PATH);
        const lndCert = await fs.readFile(Options.env.LND_CERT_PATH);

        return new Options(port, lndHost, lndReadonlyMacaroon, lndCert);
    }

    constructor(
        readonly port: number,
        readonly lndHost: string,
        readonly lndReadonlyMacaroon: Buffer,
        readonly lndCert: Buffer,
    ) {}
}
