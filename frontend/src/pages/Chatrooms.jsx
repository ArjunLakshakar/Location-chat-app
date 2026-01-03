import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Chatrooms() {
  const nav = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState("");
  const [radius, setRadius] = useState(2);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // logged in user info
  const myId = localStorage.getItem("userId");
  const myName = localStorage.getItem("username");

  useEffect(() => {
    axios.get("http://localhost:5000/api/chatrooms").then((r) => {
      setRooms(r.data);
      setLoading(false);
    });
  }, []);

  // create chatroom
  const create = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      await axios.post(
        "http://localhost:5000/api/chatrooms/create",
        {
          name,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          radiusKm: radius,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setOpen(false);
      window.location.reload();
    });
  };

  // delete room (creator only)
  const deleteRoom = async (id) => {
    await axios.delete(`http://localhost:5000/api/chatrooms/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    setRooms((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* NAVBAR */}
      <div className="w-full px-6 py-3 bg-white/10 border-b border-white/10 flex items-center">
        <h2
          onClick={() => nav("/chatrooms")}
          className="text-xl font-bold cursor-pointer"
        >
           Location Chat
        </h2>

        <div className="ml-auto flex gap-3 items-center gap-4">
          <span className="text-gray-300 text-sm hidden sm:block">
            Hi, {myName}
          </span>

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

      {/* background glow */}
      <div className="absolute w-96 h-96 bg-purple-700 blur-3xl opacity-30 -top-10 -left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-blue-700 blur-3xl opacity-30 bottom-0 right-0 animate-pulse delay-200"></div>

      {/* page content */}
      <div className="relative z-10 p-8 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold tracking-wide">
            Nearby Chatrooms 
          </h1>

          <button
            onClick={() => setOpen(true)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 shadow-lg font-semibold"
          >
            + Create Chatroom
          </button>
        </div>

        {/* Loading text */}
        {loading && (
          <p className="text-gray-300 text-center text-lg">
            Loading chatrooms...
          </p>
        )}

        {/* no rooms */}
        {!loading && rooms.length === 0 && (
          <p className="text-gray-400 text-center mt-16 text-xl">
            No chatrooms found nearby 😔
            <br />
            <span className="text-blue-400">Create the first one!</span>
          </p>
        )}

        {/* ROOMS GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((r) => (
            <div
              key={r._id}
              className="rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:scale-[1.02] hover:bg-white/20 transition"
            >
              <h3 className="text-xl font-bold">{r.name}</h3>

              <p className="text-gray-300 mt-1 text-sm">
                Radius: <b>{r.radiusKm} km</b>
              </p>

              <p className="text-gray-300 text-sm mt-1">
                Created by:
                <span className="text-blue-300 ml-1">
                  {r.createdBy === myId ? "You" : "Other user"}
                </span>
              </p>

              {/* JOIN BUTTON WITH RADIUS CHECK */}
              <div
                onClick={() => {
                  navigator.geolocation.getCurrentPosition(async (pos) => {
                    const res = await axios.post(
                      "http://localhost:5000/api/chatrooms/check",
                      {
                        roomId: r._id,
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                      }
                    );

                    if (!res.data.allowed) {
                      alert("❌ You are outside the allowed radius");
                      return;
                    }

                    nav(`/chat/${r._id}`);
                  });
                }}
                className="mt-4 text-blue-400 text-sm cursor-pointer"
              >
                Click to join →
              </div>

              {/* DELETE ROOM */}
              {/* ACTION BUTTONS */}
              {r.createdBy === myId && (
                <div className="mt-4 flex gap-3">

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => deleteRoom(r._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl 
                 bg-red-500/20 text-red-400 border border-red-500/40 
                 hover:bg-red-500/30 hover:text-red-300 transition"
                  >
                   Delete
                  </button>

                  {/* EDIT BUTTON */}
                  <button
                    onClick={() => {
                      setEditId(r._id);
                      setEditName(r.name);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl 
                 bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 
                 hover:bg-yellow-400/30 hover:text-yellow-200 transition"
                  >
                   Edit
                  </button>

                </div>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* CREATE ROOM MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 z-50">

          <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white ">
                Create New Chatroom
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✖
              </button>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-400 text-sm mb-6">
              Create a location-based chatroom that users within the selected radius can join.
            </p>

            {/* NAME FIELD */}
            <label className="text-sm text-gray-300">
              Chatroom Name
            </label>
            <input
              className="w-full mb-4 mt-1 p-3 rounded-xl bg-black/50 text-white border border-white/20 focus:border-blue-500 outline-none"
              placeholder="e.g., Arjun's Friends Group"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* RADIUS FIELD */}
            <label className="text-sm text-gray-300">
              Allowed Radius (in kilometers)
            </label>
            <input
              type="number"
              className="w-full mb-2 mt-1 p-3 rounded-xl bg-black/50 text-white border border-white/20 focus:border-blue-500 outline-none"
              placeholder="Enter radius in km"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              min="1"
            />

            <p className="text-xs text-gray-400 mb-5">
               Only users within this distance from the chatroom can join.
            </p>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                disabled={!name.trim()}
                onClick={create}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create Room
              </button>

              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {/* EDIT ROOM MODAL */}
      {editId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 z-50">

          <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                Edit Chatroom Name
              </h2>

              <button
                onClick={() => setEditId(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✖
              </button>
            </div>

            {/* DESCRIPTION */}
            {/* <p className="text-gray-400 text-sm mb-5">
              Change the name of your chatroom. Participants will see the updated name instantly.
            </p> */}

            {/* LABEL */}
            <label className="text-sm text-gray-300">
              New Chatroom Name
            </label>

            <input
              className="w-full mt-1 p-3 rounded-xl bg-black/50 border border-white/20 text-white focus:border-blue-500 outline-none"
              value={editName}
              placeholder="Enter new chatroom name"
              onChange={(e) => setEditName(e.target.value)}
            />

            {/* BUTTONS */}
            <div className="flex gap-3 mt-6">
              <button
                disabled={!editName.trim()}
                onClick={async () => {
                  await axios.put(
                    `http://localhost:5000/api/chatrooms/${editId}`,
                    { name: editName },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    }
                  );

                  setEditId(null);
                  window.location.reload();
                }}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>

              <button
                onClick={() => setEditId(null)}
                className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
