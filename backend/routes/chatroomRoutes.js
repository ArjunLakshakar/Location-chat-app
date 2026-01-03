import express from "express";
import jwt from "jsonwebtoken";
import Chatroom from "../models/Chatroom.js";

const r = express.Router();

function auth(req,res,next){
  const token = req.headers.authorization?.split(" ")[1];
  const data = jwt.verify(token,"secret");
  req.user = data;
  next();
}

r.get("/", async (req,res)=>{
  const rooms = await Chatroom.find();
  res.json(rooms);
});

r.post("/create", auth, async (req,res)=>{
  const room = await Chatroom.create({
    ...req.body,
    createdBy: req.user.id
  });

  res.json(room);
});

r.delete("/:id", auth, async(req,res)=>{
  await Chatroom.deleteOne({_id:req.params.id, createdBy:req.user.id});
  res.json({status:"deleted"});
});

r.put("/:id", auth, async (req, res) => {
  await Chatroom.updateOne(
    { _id: req.params.id, createdBy: req.user.id },
    { name: req.body.name }
  );
  res.json({ status: "updated" });
});



export default r;
