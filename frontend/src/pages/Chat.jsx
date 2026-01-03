import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

export default function Chat() {
  const { roomId } = useParams();
  const nav = useNavigate();

  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [expired, setExpired] = useState(false);
  const [users, setUsers] = useState([]);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const myId = localStorage.getItem("userId");
  const myName = localStorage.getItem("username");

  // connect socket once
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // join room + events
  useEffect(() => {
    if (!socketRef.current) return;

    // join with identity
    socketRef.current.emit("joinRoom", {
      roomId,
      userId: myId,
      username: myName,
    });

    // live participants list
    socketRef.current.on("participants", (list) => {
      // remove duplicates by userId
      const unique = list.filter(
        (u, index, self) =>
          index === self.findIndex((x) => x.userId === u.userId)
      );

      setUsers(unique);
    });


    // load old messages
    axios.get(`http://localhost:5000/api/messages/${roomId}`).then((r) => {
      setMsgs(r.data);

      // 2-hour expiry check
      const firstTime = new Date(r.data[0]?.createdAt || Date.now());
      if (Date.now() - firstTime.getTime() > 2 * 60 * 60 * 1000) {
        setExpired(true);
      }
    });

    // incoming messages
    const handler = (m) => setMsgs((p) => [...p, m]);
    socketRef.current.on("receiveMessage", handler);

    return () => {
      socketRef.current.emit("leaveRoom", roomId);
      socketRef.current.off("receiveMessage", handler);
    };
  }, [roomId]);

  // send message
  const send = async () => {
    if (!text.trim() || expired) return;

    const msg = {
      roomId,
      text,
      userId: myId,
      user: myName,
      createdAt: new Date(),
    };

    // realtime
    socketRef.current.emit("sendMessage", msg);

    // persist
    await axios.post("http://localhost:5000/api/messages", msg);

    setText("");
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col">

      {/* HEADER */}
      <div className="p-4 flex items-center gap-3 bg-white/10 border-b border-white/10">
        <button onClick={() => nav(-1)} className="px-3 py-1 bg-white/10 rounded">
          ← Back
        </button>

        <div className="font-bold text-lg">Chatroom</div>

        <span className="ml-auto text-green-400 text-sm">● Online</span>
      </div>

      {/* PARTICIPANTS BAR */}
      <div className="px-4 py-2 text-sm bg-white/5 border-b border-white/10">
        👥 Participants:{" "}
        {users.length === 0
          ? "Loading..."
          : users.map((u) => u.username).join(", ")}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">

        {msgs.map((m, i) => {
          const isYou = m.userId === myId;

          return (
            <div key={i} className={`flex ${isYou ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] p-3 rounded-2xl shadow 
                  ${isYou ? "bg-blue-600" : "bg-white/10 border border-white/20"}`}
              >
                {!isYou && (
                  <p className="text-xs text-purple-300 mb-1">
                    {m.user || "User"}
                  </p>
                )}

                <p>{m.text}</p>

                {/* delete own message
                {isYou && (
                  <button
                    onClick={async () => {
                      try {
                        await axios.delete(
                          `http://localhost:5000/api/messages/${m._id}`
                        );
                        setMsgs((prev) => prev.filter((x) => x._id !== m._id));
                      } catch {
                        alert("Failed to delete message");
                      }
                    }}
                    className="text-xs text-red-300 mt-1"
                  >
                    🗑 delete
                  </button>
                )} */}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* EXPIRED */}
      {expired ? (
        <div className="bg-red-700 text-center py-2">
          Messaging disabled after 2 hours
        </div>
      ) : (
        <div className="p-4 flex gap-3 bg-white/10 border-t border-white/10">
          <input
            className="flex-1 p-3 rounded-xl bg-black/50"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
          />

          <button
            disabled={!text.trim()}
            onClick={send}
            className="px-5 py-2 rounded-xl bg-blue-600 disabled:opacity-40"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
