"use client";
import { useState, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
  verified_addresses?: {
    eth_addresses: string[];
    sol_addresses: string[];
  };
}

export function useFarcasterAuth() {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to initiate login (called when user clicks login button)
  const initiateLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // Make authenticated request to your API
      const response = await sdk.quickAuth.fetch("/api/auth/me");

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        sdk.actions.ready(); // Tell Farcaster the app is ready
      } else {
        throw new Error("Authentication failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setError(null);
    // Clear any local storage or cookies if needed
  };

  // Don't auto-authenticate on mount - wait for user to click login
  return { user, loading, error, signOut, initiateLogin };
}
