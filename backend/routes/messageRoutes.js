import express from "express";
import Message from "../models/Message.js";

const r = express.Router();

r.get("/:roomId", async (req,res)=>{
  const msgs = await Message.find({roomId:req.params.roomId});
  res.json(msgs);
});

r.post("/", async (req,res)=>{
  const m = await Message.create(req.body);
  res.json(m);
});

r.delete("/:id", async (req, res) => {
  await Message.deleteOne({ _id: req.params.id });
  res.json({ status: "deleted" });
});



export default r;
