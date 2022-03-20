import "dotenv/config";

export class Options {
    public static env = {
        PORT: process.env.PORT,
    };

    public static async fromEnv(): Promise<Options> {
        for (const [key, value] of Object.entries(Options.env)) {
            if (!value) {
                throw new Error(`Required option ENV.${key} is not defined`);
            }
        }
        return new Options(Number(Options.env.PORT));
    }

    constructor(readonly port: number) {}
}
