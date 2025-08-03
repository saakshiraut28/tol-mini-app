"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

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

const UserSearch = ({
  onSelectUser,
}: {
  onSelectUser: (user: User) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `https://api.neynar.com/v2/farcaster/user/search?q=${debouncedTerm}&limit=5`,
          {
            headers: {
              "x-api-key":
                process.env.NEXT_PUBLIC_NEYNAR_API_KEY || "NEYNAR_API_DOCS",
              "x-neynar-experimental": "false",
            },
          },
        );

        if (!res.ok) return;

        const data = await res.json();
        setUsers(data.result?.users || []);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (debouncedTerm.trim().length > 0) {
      fetchUsers();
    }
  }, [debouncedTerm]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    onSelectUser(user);
  };

  return (
    <div className="p relative">
      {/* Search bar only if no user is selected */}
      {!selectedUser && (
        <input
          type="text"
          placeholder="Search for users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md w-full"
        />
      )}

      {/* User list */}
      {!selectedUser && (
        <ul className="mt-4 space-y-2">
          {users.map((user) => (
            <li
              key={user.fid}
              onClick={() => handleUserSelect(user)}
              className="cursor-pointer p-2 border rounded bg-white hover:bg-gray-200"
            >
              <div className="flex items-center space-x-2">
                <Image
                  src={user.pfp_url}
                  alt="pfp"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium text-black">{user.username}</span>
                <span className="text-black">({user.display_name})</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
