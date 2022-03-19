import "dotenv/config";

export const options = {
    PORT: process.env.PORT,
};

export type Options = typeof options;

for (const [key, value] of Object.entries(options)) {
    if (!value) {
        console.error(`Required config ${key} not found`);
        process.exit(1);
    }
}
