"use client";
import { useState } from "react";
import Sent from "./Sent";
import Receive from "./Receive";

type ProfileProps = {
  setActiveTab: (tab: string) => void;
};

type User = {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  custody?: `0x${string}`;
  verifications?: string[];
  ethAddress?: string;
  solAddress?: string;
};

export default function Profile({
  setActiveTab,
  user,
}: ProfileProps & { user: User }) {
  const [activeTransactionTab, setActiveTransactionTab] = useState<
    "sent" | "receive"
  >("sent");
  const [copied, setCopied] = useState<string>("");

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 8)}...${address.slice(-4)}`;
  };

  const handleCopy = async (label: string, address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-transparent overflow-y-auto">
      <div className="flex-1 p-4 space-y-4 pb-6">
        {/* Profile Card */}
        {user && (
          <>
            <div className="relative flex items-start justify-between gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-200">
              <div className="flex justify-center items-center gap-4 text-center">
                <img
                  src={
                    user.pfpUrl ||
                    "https://api.dicebear.com/7.x/pixel-art/svg?seed=demo"
                  }
                  alt="User avatar"
                  className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-300"
                />
                <div className="space-y-1 text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    @{user.username}
                  </p>
                  <p className="text-xs text-gray-500">Verified Address:</p>
                  <p className="text-xs text-gray-800">
                    <span className="font-medium text-gray-600">
                      Ethereum:{" "}
                    </span>
                    {user.ethAddress ? (
                      <span
                        onClick={() => handleCopy("eth", user.ethAddress!)}
                        className="cursor-pointer hover:underline hover:text-violet-600 transition-all"
                        title="Click to copy"
                      >
                        {truncateAddress(user.ethAddress)}
                      </span>
                    ) : (
                      "None"
                    )}
                    {copied === "eth" && (
                      <span className="ml-2 text-green-500 text-[10px]">
                        Copied!
                      </span>
                    )}
                  </p>

                  <p className="text-xs text-gray-800">
                    <span className="font-medium text-gray-600">Solana: </span>
                    {user.solAddress ? (
                      <span
                        onClick={() => handleCopy("sol", user.solAddress!)}
                        className="cursor-pointer hover:underline hover:text-violet-600 transition-all"
                        title="Click to copy"
                      >
                        {truncateAddress(user.solAddress)}
                      </span>
                    ) : (
                      "None"
                    )}
                    {copied === "sol" && (
                      <span className="ml-2 text-green-500 text-[10px]">
                        Copied!
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTransactionTab("sent")}
                    className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors duration-200 ${
                      activeTransactionTab === "sent"
                        ? "text-violet-600 border-b-2 border-violet-600 bg-violet-50"
                        : "text-gray-600 active:text-gray-900 active:bg-gray-50"
                    }`}
                  >
                    Sent
                  </button>
                  <button
                    onClick={() => setActiveTransactionTab("receive")}
                    className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors duration-200 ${
                      activeTransactionTab === "receive"
                        ? "text-violet-600 border-b-2 border-violet-600 bg-violet-50"
                        : "text-gray-600 active:text-gray-900 active:bg-gray-50"
                    }`}
                  >
                    Receive
                  </button>
                </div>
              </div>
              <div className="p-4">
                {activeTransactionTab === "sent" ? (
                  <Sent fid={user.fid!} />
                ) : (
                  <Receive fid={user.fid!} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
