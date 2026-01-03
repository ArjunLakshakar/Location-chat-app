
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    // find/create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        password: "google-auth",
      });
    }

    const token = jwt.sign({ id: user._id }, "secret");

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Google login failed" });
  }
});


router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  res.json(user);
});

router.post("/login", async (req, res) => {

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ msg: "no user" });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(400).json({ msg: "wrong" });

  const token = jwt.sign({ id: user._id }, "secret");

  res.json({
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email
    }
  });
});

export default router;
