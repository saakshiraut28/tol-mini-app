"use client";

import { createContext, useContext } from "react";
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY || "",
});

const neynarClient = new NeynarAPIClient(config);

export const NeynarContext = createContext<NeynarAPIClient | null>(null);

export const useNeynarClient = () => {
  const context = useContext(NeynarContext);
  if (!context) {
    throw new Error("useNeynarClient must be used within a NeynarProvider");
  }
  return context;
};

export const NeynarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NeynarContext.Provider value={neynarClient}>
      {children}
    </NeynarContext.Provider>
  );
};
