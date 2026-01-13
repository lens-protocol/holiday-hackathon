import { PublicClient, testnet } from "@lens-protocol/client";

export const lensClient = PublicClient.create({
    environment: testnet,
    origin: "https://api.testnet.lens.dev/graphql",
    storage: window.localStorage,
});