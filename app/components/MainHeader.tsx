import React, { useState, useEffect } from "react";
import UserSearch from "./UserSearch";
import AmountInput from "./AmountInput";
import UserPreview from "./UserPreview";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { supabase } from "@/lib/supabase-client";
import { v4 as uuidv4 } from "uuid";
import { SIWFUser } from "../hooks/useSIWF";

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

function MainHeader({ user }: { user: SIWFUser }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const { address } = useAccount();

  const {
    data: sendResult,
    sendTransactionAsync,
    isPending,
  } = useSendTransaction();

  const { isSuccess } = useWaitForTransactionReceipt({
    // ts-ignore-next-line
    hash: sendResult,
  });

  const handleSend = async () => {
    if (!selectedUser || !amount) return;

    const toAddress = selectedUser.verified_addresses?.eth_addresses?.[0];
    if (!toAddress) return;

    try {
      const tx = await sendTransactionAsync({
        to: toAddress as `0x${string}`,
        value: parseEther(amount),
      });

      setTxHash(tx);
    } catch (err) {
      console.error("Error sending ETH:", err);
    }
  };

  useEffect(() => {
    const saveToSupabase = async () => {
      if (!txHash || !isSuccess || !selectedUser) return;

      const { error } = await supabase.from("gift").insert([
        {
          id: uuidv4(),
          sender_fid: user.fid,
          recipient_fid: selectedUser.fid,
          recipient_address: selectedUser.verified_addresses.eth_addresses[0],
          tx_hash: txHash,
          message: message,
          amount: Number(amount) * 1e18,
        },
      ]);

      if (error) console.error("Error saving to Supabase:", error);
      else console.log("Gift saved!");

      setMessage("");
      setAmount("");
      setSelectedUser(null);
      setTxHash(null);
    };

    saveToSupabase();
  }, [isSuccess]);

  return (
    <div className="flex-1 p-4 bg-app-background space-y-4">
      <h1 className="text-xl font-semibold">🫶 Let &lsquo;em know they are special! 🫶</h1>
      <p className="text-lg font-semibold">
        Send your friends, fam and loved ones a token of appreciation in ETH.
      </p>

      {selectedUser ? (
        <UserPreview user={selectedUser} onClear={() => setSelectedUser(null)} />
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
          <button
            onClick={handleSend}
            disabled={isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isPending ? "Sending..." : `Send ${amount} ETH to ${selectedUser.username}`}
          </button>
        ) : (
            <div className="text-center text-black-400 text-sm mb-2">
              {!address && "⚠️ Connect your wallet to send a transaction"}
              {address && !selectedUser && "⚠️ Select a user to send to"}
              {address && selectedUser && !amount && "⚠️ Enter an amount to send"}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainHeader;
