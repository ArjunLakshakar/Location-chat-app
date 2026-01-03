import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   /* global google */
  //   if (!window.google) return;

  //   google.accounts.id.initialize({
  //     client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  //     callback: handleGoogle,
  //   });

  //   google.accounts.id.renderButton(
  //     document.getElementById("googleBtn"),
  //     { theme: "outline", size: "large" }
  //   );
  // }, []);


  const login = async () => {
    try {
      if (!email || !password) {
        setError("Email and password are required");
        return;
      }

      setLoading(true);
      setError("");

      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("username", res.data.user.username);
      nav("/chatrooms");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (response) => {
    const res = await axios.post("http://localhost:5000/api/auth/google", {
      credential: response.credential,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", res.data.user.username);
    localStorage.setItem("userId", res.data.user._id);

    nav("/chatrooms");
  };


  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black">

      {/* animated gradient blobs */}
      <div className="absolute w-96 h-96 bg-purple-600 blur-3xl opacity-30 rounded-full -top-20 -left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-blue-600 blur-3xl opacity-30 rounded-full bottom-0 right-0 animate-pulse delay-200"></div>

      {/* card */}
      <div className="relative z-10 w-[95%] sm:w-[420px] backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,.7)]">

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-extrabold text-white tracking-wide">
            Location Chat
          </h1>
          <p className="text-gray-300 mt-2">
            Login to continue chatting nearby 
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="w-full mb-4 p-2 text-sm text-center rounded-md bg-red-900/40 text-red-300 border border-red-500/40">
            {error}
          </div>
        )}

        {/* Email */}
        <label className="text-gray-300 text-sm">Email</label>
        <input
          className="w-full mt-1 mb-4 p-3 rounded-xl bg-black/50 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <label className="text-gray-300 text-sm">Password</label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            className="w-full mt-1 mb-4 p-3 pr-12 rounded-xl bg-black/50 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* toggle eye */}
          <span
            onClick={() => setShow(!show)}
            className="absolute right-3 top-4 text-gray-300 cursor-pointer"
          >
            {show ? "👁️" : "👁️‍🗨️"}
          </span>
        </div>

        {/* login button */}
        <button
          onClick={login}
          disabled={!email || !password || loading}

          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition text-white font-bold shadow-lg active:scale-95"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        {/* <div className="my-4 flex items-center gap-2 text-gray-400">
          <span className="h-[1px] w-full bg-white/20" />
          or
          <span className="h-[1px] w-full bg-white/20" />
        </div> */}

        {/* Fake Google button (UI only, optional auth later) */}
        {/* <button id="googleBtn" className="w-full py-3 rounded-xl bg-white text-black font-semibold shadow-xl hover:bg-gray-200 transition">
          Continue with Google
        </button> */}

        {/* Register */}
        <p className="text-gray-300 mt-5 text-center">
          Don’t have an account?
          <span
            onClick={() => nav("/register")}
            className="text-blue-400 hover:text-blue-300 ml-1 cursor-pointer"
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
