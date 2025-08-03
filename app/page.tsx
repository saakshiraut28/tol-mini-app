"use client";

import React from "react";
import SIWFButton from "./components/SIWFButton";
import { useSIWF } from "./hooks/useSIWF";
import { Home, User } from "lucide-react";
import MainHeader from "./components/MainHeader";
import Profile from "./components/Profile";

export default function HomePage() {
  const { isAuthenticated, user } = useSIWF();
  const [activeTab, setActiveTab] = React.useState("main");

  return (
    <div
      className="h-screen max-w-md flex-1 justify-center items-center mx-auto text-center"
      style={{
        backgroundImage: `url('./bg1.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <nav className="flex justify-between w-full py-4 px-4 rounded-md mb-6 bg-white/20 backdrop-blur-md">
        <h1 className="text-xl font-bold mb-2">Send Smiles ;)</h1>
        {isAuthenticated &&
          (activeTab === "main" ? (
            <button
              onClick={() => setActiveTab("profile")}
              className="flex items-center gap-2 text-gray-800"
            >
              <User className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setActiveTab("main")}
              className="flex items-center gap-2 text-gray-800"
            >
              <Home className="w-5 h-5" />
            </button>
          ))}
      </nav>

      {isAuthenticated && activeTab === "main" ? (
        <MainHeader user={user} />
      ) : activeTab === "profile" ? (
        <Profile user={user} />
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 my-10">
          <p className="font-semibold text-lg">
            sign-in urself to get started.
          </p>
          <SIWFButton />
        </div>
      )}
    </div>
  );
}
