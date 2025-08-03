"use client";

import React from "react";
import { useSIWF } from "../hooks/useSIWF";
import { ArrowRight } from "lucide-react";

interface SIWFButtonProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
}

export default function SIWFButton({
  onSuccess,
  onError,
  className = "",
  size = "md",
  variant = "primary",
}: SIWFButtonProps) {
  const { signIn, loading, error, user, isAuthenticated } = useSIWF();

  React.useEffect(() => {
    if (user && onSuccess) {
      onSuccess(user);
    }
  }, [user, onSuccess]);

  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Size classes
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Variant classes
  const variantClasses = {
    primary:
      "bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-400",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-400",
    outline:
      "border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white disabled:border-gray-400 disabled:text-gray-400",
  };

  if (isAuthenticated && user) {
    return (
      <div
        className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${className}`}
      >
        {user.pfp && (
          <img
            src={user.pfp}
            alt={`${user.displayName} avatar`}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <div className="font-semibold text-gray-900">{user.displayName}</div>
          <div className="text-sm text-gray-600">
            @{user.username} · FID {user.fid}
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={signIn}
      disabled={loading}
      className={`
        flex items-center justify-center gap-2 
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        font-semibold rounded-lg transition-all duration-200 
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <ArrowRight /> Sign in with Farcaster
        </>
      )}
    </button>
  );
}
