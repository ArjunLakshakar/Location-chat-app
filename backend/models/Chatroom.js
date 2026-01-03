
import mongoose from "mongoose";

const chatroomSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  radiusKm: Number,
  createdBy: String,
  participants: [
  {
    userId: String,
    username: String,
  }
],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Chatroom", chatroomSchema);
