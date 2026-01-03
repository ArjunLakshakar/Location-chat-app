import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const register = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });

      setSuccess("Account created successfully Redirecting to login…");
      setTimeout(() => nav("/login"), 1200);
    } catch (err) {
      setError("Registration failed. Try another email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black">

      {/* animated background blobs */}
      <div className="absolute w-96 h-96 bg-pink-600 blur-3xl opacity-30 rounded-full -top-20 -left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-indigo-600 blur-3xl opacity-30 rounded-full bottom-0 right-0 animate-pulse delay-200"></div>

      {/* main card */}
      <div className="relative z-10 w-[95%] sm:w-[420px] backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,.7)]">

        <div className="text-center mb-4">
          <h1 className="text-4xl font-extrabold text-white tracking-wide">
            Create Account 
          </h1>
          <p className="text-gray-300 mt-1">
            Join location-based chatrooms instantly
          </p>
        </div>

        {/* success msg */}
        {success && (
          <div className="w-full mb-4 p-2 text-sm text-center rounded-md bg-green-900/40 text-green-300 border border-green-500/40">
            {success}
          </div>
        )}

        {/* error msg */}
        {error && (
          <div className="w-full mb-4 p-2 text-sm text-center rounded-md bg-red-900/40 text-red-300 border border-red-500/40">
            {error}
          </div>
        )}

        {/* username */}
        <label className="text-gray-300 text-sm">Username</label>
        <input
          className="w-full mt-1 mb-4 p-3 rounded-xl bg-black/50 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          placeholder="enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* email */}
        <label className="text-gray-300 text-sm">Email</label>
        <input
          className="w-full mt-1 mb-4 p-3 rounded-xl bg-black/50 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          placeholder="enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* password with eye toggle */}
        <label className="text-gray-300 text-sm">Password</label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            className="w-full mt-1 mb-4 p-3 pr-12 rounded-xl bg-black/50 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            placeholder="enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShow(!show)}
            className="absolute right-3 top-4 text-gray-300 cursor-pointer select-none"
          >
            {show ? "🙈" : "👁️"}
          </span>
        </div>

        {/* register button */}
        <button
          onClick={register}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 transition text-white font-bold shadow-lg active:scale-95"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        {/* go to login */}
        <p className="text-gray-300 mt-5 text-center">
          Already have an account?
          <span
            onClick={() => nav("/login")}
            className="text-pink-400 hover:text-pink-300 ml-1 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
