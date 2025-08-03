"use client";

import { useSignIn, useProfile } from "@farcaster/auth-kit";
import { useState, useEffect, useCallback } from "react";

export interface SIWFUser {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  custody?: `0x${string}`;
  verifications?: string[];
}

export function useSIWF() {
  const [user, setUser] = useState<SIWFUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    signIn,
    signOut,
    isSuccess,
    isError,
    validSignature,
    channelToken,
    data: signInData,
    url,
  } = useSignIn();

  const { profile, isAuthenticated } = useProfile();

  // Set user info from profile if authenticated
  useEffect(() => {
    if (isAuthenticated && profile) {
      setUser({
        fid: profile.fid,
        username: profile.username,
        displayName: profile.displayName || profile.username,
        pfpUrl: profile.pfpUrl,
        bio: profile.bio,
        custody: profile.custody,
        verifications: profile.verifications || [],
      });
      setError(null);
    } else {
      setUser(null);
    }
  }, [isAuthenticated, profile]);

  // Handle sign-in success
  useEffect(() => {
    if (isSuccess && validSignature) {
      setLoading(false);
      setError(null);
    }
  }, [isSuccess, validSignature]);

  // Handle sign-in error
  useEffect(() => {
    if (isError) {
      setError("Failed to sign in with Farcaster. Please try again.");
      setLoading(false);
    }
  }, [isError]);

  // Trigger sign-in
  const handleSignIn = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await signIn();
    } catch (err) {
      console.error("SIWF sign-in error:", err);
      setError("Failed to initiate sign-in process");
      setLoading(false);
    }
  }, [signIn, loading]);

  // Trigger sign-out
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("SIWF sign-out error:", err);
      setError("Failed to sign out");
    }
  }, [signOut]);

  return {
    // State
    user,
    loading,
    error,
    isAuthenticated,

    // Actions
    signIn: handleSignIn,
    signOut: handleSignOut,

    // Metadata
    url,
    channelToken,
    signInData,
    validSignature,

    // Utility
    clearError: () => setError(null),
  };
}
