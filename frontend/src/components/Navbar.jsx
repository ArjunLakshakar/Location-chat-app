import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();

  return (
    <div className="w-full px-6 py-3 bg-white/10 border-b border-white/10 flex items-center gap-4">

      <h1
        onClick={() => nav("/chatrooms")}
        className="font-bold text-xl cursor-pointer"
      >
        Location Chat
      </h1>

      <div className="ml-auto flex gap-3">

        <button
          onClick={() => nav("/chatrooms")}
          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
        >
          Chatrooms
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            nav("/login");
          }}
          className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700"
        >
          Logout
        </button>

      </div>
    </div>
  );
}
