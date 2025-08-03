"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

export default function Sent({ fid }: { fid: number }) {
  // ts-ignore
  const [sent, setSent] = useState<any[]>([]);

  useEffect(() => {
    const fetchSent = async () => {
      const { data, error } = await supabase
        .from("gift")
        .select("*")
        .eq("sender_fid", fid)
        .order("created_at", { ascending: false })
        .limit(2);

      if (error) console.error("Error fetching sent:", error);
      else setSent(data);
    };

    fetchSent();
  }, [fid]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900 text-sm">Recent Sent</h4>
        <button className="text-violet-600 active:text-violet-800 text-xs font-medium">
          View All
        </button>
      </div>

      {sent.length === 0 ? (
        <div className="text-center py-6">
          <svg
            className="w-10 h-10 text-gray-300 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          <p className="text-gray-500 text-sm">No sent transactions yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sent.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg active:bg-gray-100"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    To FID: {tx.recipient_fid}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-gray-900 text-sm">
                  -{Number(tx.amount) / 1e18} ETH
                </p>
                <p className="text-xs text-gray-600">
                  {tx.tx_hash.slice(0, 8)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
