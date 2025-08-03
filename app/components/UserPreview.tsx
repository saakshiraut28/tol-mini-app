import React from "react";
import { X } from "lucide-react";

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

const UserPreview = ({
  user,
  onClear,
}: {
  user: User;
  onClear: () => void;
}) => (
  <div className="relative flex items-start justify-between gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-200">
    <div className="flex justify-center items-center gap-4 text-center">
      <img
        src={user.pfp_url}
        alt="User avatar"
        className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-300"
      />
      <div className="space-y-1 text-left">
        <p className="text-sm font-semibold text-gray-900">@{user.username}</p>
        <p className="text-xs text-gray-500">Verified Address:</p>
        <p className="text-xs text-gray-800">
          <span className="font-medium text-gray-600">Ethereum:</span>{" "}
          {user.verified_addresses.eth_addresses.length > 0
            ? user.verified_addresses.eth_addresses
                .map((addr) => `${addr.slice(0, 7)}...`)
                .join(", ")
            : "None"}
        </p>
        <p className="text-xs text-gray-800">
          <span className="font-medium text-gray-600">Solana:</span>{" "}
          {user.verified_addresses.sol_addresses.length > 0
            ? user.verified_addresses.sol_addresses
                .map((addr) => `${addr.slice(0, 7)}...`)
                .join(", ")
            : "None"}
        </p>
      </div>
    </div>
    <button
      onClick={onClear}
      className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition-colors"
      aria-label="Close"
    >
      <X className="w-3 h-3" />
    </button>
  </div>
);

export default UserPreview;
