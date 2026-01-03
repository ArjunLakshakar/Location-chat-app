
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: String,
  text: String,
  userId: String,
  user: String,
  createdAt: { type: Date, default: Date.now, expires: 7200 }
});

export default mongoose.model("Message", messageSchema);
