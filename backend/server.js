
import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import chatroomRoutes from "./routes/chatroomRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import Chatroom from "./models/Chatroom.js";

import { getDistance } from "./utils/distance.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/chatrooms", chatroomRoutes);
app.use("/api/messages", messageRoutes);

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/location-chat-app").then(() => console.log("MongoDB connected"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }
});

io.on("connection", (socket) => {

  socket.on("sendMessage", (msg) => io.to(msg.roomId).emit("receiveMessage", msg));
  socket.on("joinRoom", async ({ roomId, userId, username }) => {
    socket.join(roomId);

    await Chatroom.updateOne(
      { _id: roomId },
      { $addToSet: { participants: { userId, username } } }
    );

    const room = await Chatroom.findById(roomId);
    io.to(roomId).emit("participants", room.participants);
  });

});

app.post("/api/chatrooms/check", async (req, res) => {
  const { roomId, lat, lng } = req.body;

  const room = await Chatroom.findById(roomId);

  const dist = getDistance(
    room.latitude,
    room.longitude,
    lat,
    lng
  );

  res.json({ allowed: dist <= room.radiusKm + 1 });

});


server.listen(5000, () => console.log("Server running on 5000"));

