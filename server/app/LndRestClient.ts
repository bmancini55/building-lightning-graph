import https from "https";

export class LndRestClient {
    constructor(readonly host: string, readonly macaroon: Buffer, readonly cert: Buffer) {}

    public async getGraph(): Promise<Lnd.Graph> {
        return this.get("/v1/graph");
    }

    public async get<T>(path: string): Promise<T> {
        return new Promise((resolve, reject) => {
            const url = `${this.host}${path}`;
            console.log(url);
            const options = {
                headers: {
                    "grpc-metadata-macaroon": this.macaroon.toString("hex"),
                },
                ca: this.cert,
            };
            const req = https.request(url, options, res => {
                const bufs: Buffer[] = [];
                res.on("data", buf => bufs.push(buf));
                res.on("end", () => {
                    const result = Buffer.concat(bufs);
                    try {
                        if (res.statusCode === 200) {
                            resolve(JSON.parse(result.toString("utf-8")));
                        } else {
                            reject(result);
                        }
                    } catch (ex) {
                        reject(ex);
                    }
                });
            });
            req.on("error", reject);
            req.end();
        });
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Lnd {
    export interface Graph {
        nodes: LightningNode[];
        edges: ChannelEdge[];
    }

    export interface LightningNode {
        last_update: number;
        pub_key: string;
        alias: string;
        addresses: NodeAddress[];
        color: string;
        features: {
            [key: string]: Feature;
        };
    }

    export interface Feature {
        name: string;
        is_required: boolean;
        is_known: boolean;
    }

    export interface NodeAddress {
        network: string;
        addr: string;
    }

    export interface ChannelEdge {
        channel_id: string;
        chan_point: string;
        last_update: string;
        node1_pub: string;
        node2_pub: string;
        capacity: string;
        node1_policy: RoutingPolicy;
        node2_policy: RoutingPolicy;
    }

    export interface RoutingPolicy {
        time_lock_delta: number;
        min_htlc: string;
        fee_base_msat: string;
        fee_rate_milli_msat: string;
        disabled: boolean;
        max_htlc_msat: string;
        last_update: number;
    }
}
