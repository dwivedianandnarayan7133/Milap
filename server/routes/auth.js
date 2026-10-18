
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Username, email aur password required hain",
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
      return res.status(400).json({
        message: "Username 3-30 characters ka ho; letters, numbers aur _ use karein",
      });
    }

    if (
      cleanEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      return res.status(400).json({
        message: "Valid email address enter karein",
      });
    }

    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({
        message: "Password 8 characters se kam nahi aur 72 bytes se zyada nahi hona chahiye",
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { username: cleanUsername },
        { email: cleanEmail },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username ya email pehle se registered hai",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
    });

    return res.status(201).json({
      message: "Registration successful",
      token: createToken(user),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Username ya email pehle se registered hai",
      });
    }

    console.error("Registration error:", error.message);
    return res.status(500).json({
      message: "Registration abhi complete nahi ho saka",
    });
  }
});

// Login with username OR email
router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body || {};

    if (
      typeof userId !== "string" ||
      typeof password !== "string" ||
      !userId.trim() ||
      !password ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        message: "User ID/email aur password enter karein",
      });
    }

    const identifier = userId.trim().toLowerCase();

    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
      ],
    }).select("+passwordHash");

    if (
      !user ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      return res.status(401).json({
        message: "User ID/email ya password galat hai",
      });
    }

    return res.json({
      message: "Login successful",
      token: createToken(user),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      message: "Login abhi complete nahi ho saka",
    });
  }
});

module.exports = router;
