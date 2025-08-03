import { AuthKitProvider } from "@farcaster/auth-kit";

export const farcasterConfig = {
  rpcUrl: "https://mainnet.optimism.io",
  domain:
    process.env.NEXT_PUBLIC_URL?.replace(/https?:\/\//, "") || "localhost:3000",
  siweUri: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
  relay: "https://relay.farcaster.xyz",
  version: "1",
};
