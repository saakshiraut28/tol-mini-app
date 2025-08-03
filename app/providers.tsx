"use client";

import { type ReactNode } from "react";
import { baseSepolia } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { farcasterConfig } from "@/lib/farcaster-config";

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseSepolia}
      config={{
        appearance: {
          mode: "auto",
          theme: "mini-app-theme",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
    >
      <AuthKitProvider config={farcasterConfig}>
        {props.children}
      </AuthKitProvider>
    </MiniKitProvider>
  );
}
