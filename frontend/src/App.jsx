import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chatrooms from "./pages/Chatrooms";
import Chat from "./pages/Chat";
import "./index.css";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/chatrooms"
        element={token ? <Chatrooms /> : <Navigate to="/login" />}
      />

      <Route
        path="/chat/:roomId"
        element={token ? <Chat /> : <Navigate to="/login" />}
      />

    </Routes>
  );
}
