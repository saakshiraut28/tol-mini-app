import React, { useState } from "react";
import UserSearch from "./UserSearch";
import AmountInput from "./AmountInput";
import UserPreview from "./UserPreview";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionError,
  TransactionResponse,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionStatus,
} from "@coinbase/onchainkit/transaction";
import { supabase } from "@/lib/supabase-client";
import { v4 as uuidv4 } from "uuid";

type MainHeaderProps = {
  setActiveTab: (tab: string) => void;
  signOut: () => void;
};

type User = {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  verified_addresses: {
    eth_addresses: string[];
    sol_addresses: string[];
  };
};

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

function MainHeader({
  setActiveTab,
  user,
  signOut,
}: MainHeaderProps & { user: FarcasterUser }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const { address } = useAccount();

  // Create the transaction calls
  const createTransactionCalls = async () => {
    if (!selectedUser?.verified_addresses?.eth_addresses?.[0] || !amount) {
      throw new Error(
        "They don't have a verified ETH address or amount is empty",
      );
    }

    const recipientAddress = selectedUser.verified_addresses.eth_addresses[0];
    const value = parseEther(amount);

    return [
      {
        to: recipientAddress as `0x${string}`,
        value: value,
        data: "0x" as `0x${string}`, // Empty data for simple ETH transfer
      },
    ];
  };

  const handleTransactionSuccess = async (response: TransactionResponse) => {
    console.log("Transaction successful:", response);
    const txHash = response.transactionReceipts[0]?.transactionHash;

    const { error } = await supabase.from("gift").insert([
      {
        id: uuidv4(),
        sender_fid: user.fid,
        recipient_fid: selectedUser?.fid,
        recipient_address: selectedUser?.verified_addresses.eth_addresses[0],
        tx_hash: txHash,
        message: message,
        amount: Number(amount) * 1e18,
      },
    ]);

    if (error) {
      console.error("Error saving to Supabase:", error);
    } else {
      console.log("Gift saved to Supabase");
    }
    setAmount("");
    setMessage("");
  };

  const handleTransactionError = (error: TransactionError) => {
    console.error("Transaction failed:", error);
  };

  return (
    <div className="flex-1 p-4 bg-app-background space-y-4">
      <h1 className="text-xl font-semibold">
        🫶 Let 'em know they are special! 🫶
      </h1>
      <p className="text-lg font-semibold">
        Send your friends, fam and loved ones an appreciation token.
      </p>

      {selectedUser ? (
        <UserPreview
          user={selectedUser}
          onClear={() => setSelectedUser(null)}
        />
      ) : (
        <UserSearch onSelectUser={(user) => setSelectedUser(user)} />
      )}

      <textarea
        placeholder="Write a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded-md"
      />

      <AmountInput value={amount} onChange={setAmount} />

      <div className="flex flex-col items-center">
        {address && selectedUser && amount ? (
          <Transaction
            calls={createTransactionCalls}
            onSuccess={handleTransactionSuccess}
            onError={handleTransactionError}
          >
            <TransactionButton
              className="text-white text-md"
              text={`Send ${amount} ETH to ${selectedUser.username}`}
            />
            <TransactionStatus>
              <TransactionStatusAction />
              <TransactionStatusLabel />
            </TransactionStatus>
            <TransactionToast className="mb-4">
              <TransactionToastIcon />
              <TransactionToastLabel />
              <TransactionToastAction />
            </TransactionToast>
          </Transaction>
        ) : (
          <div className="text-center">
            {!address && (
              <p className="text-black-400 text-sm mb-2">
                ⚠️ Connect your wallet to send a transaction
              </p>
            )}
            {address && !selectedUser && (
              <p className="text-black-400 text-sm mb-2">
                ⚠️ Select a user to send to
              </p>
            )}
            {address && selectedUser && !amount && (
              <p className="text-black-400 text-sm mb-2">
                ⚠️ Enter an amount to send
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainHeader;
