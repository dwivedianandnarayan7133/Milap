
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), userId: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

// Register
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      fullName,
      phone,
      weddingDate,
      city,
      guestCount,
      budget,
      foodPreference,
      notes,
    } = req.body || {};

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
      fullName: typeof fullName === "string" ? fullName.trim() : "",
      phone: typeof phone === "string" ? phone.trim() : "",
      weddingDate: typeof weddingDate === "string" ? weddingDate.trim() : "",
      city: typeof city === "string" ? city.trim() : "",
      guestCount: Math.max(1, Math.min(100000, Number(guestCount) || 500)),
      budget: typeof budget === "string" ? budget.trim() : "",
      foodPreference: typeof foodPreference === "string" ? foodPreference.trim() : "Veg",
      notes: typeof notes === "string" ? notes.trim() : "",
    });

    return res.status(201).json({
      message: "Registration successful",
      token: createToken(user),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName || "",
        phone: user.phone || "",
        weddingDate: user.weddingDate || "",
        city: user.city || "",
        guestCount: user.guestCount || 500,
        budget: user.budget || "",
        foodPreference: user.foodPreference || "Veg",
        notes: user.notes || "",
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
        fullName: user.fullName || "",
        phone: user.phone || "",
        weddingDate: user.weddingDate || "",
        city: user.city || "",
        guestCount: user.guestCount || 500,
        budget: user.budget || "",
        foodPreference: user.foodPreference || "Veg",
        notes: user.notes || "",
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      message: "Login abhi complete nahi ho saka",
    });
  }
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Login token required" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.userId || payload.id || payload._id || payload.sub;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ message: "Invalid login token" });
    }
    req.userId = userId;
    next();
  } catch {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
}

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName || "",
        phone: user.phone || "",
        weddingDate: user.weddingDate || "",
        city: user.city || "",
        guestCount: user.guestCount || 500,
        budget: user.budget || "",
        foodPreference: user.foodPreference || "Veg",
        notes: user.notes || "",
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const {
      fullName,
      phone,
      weddingDate,
      city,
      guestCount,
      budget,
      foodPreference,
      notes,
    } = req.body || {};

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = String(fullName).trim();
    if (phone !== undefined) updateData.phone = String(phone).trim();
    if (weddingDate !== undefined) updateData.weddingDate = String(weddingDate).trim();
    if (city !== undefined) updateData.city = String(city).trim();
    if (guestCount !== undefined) {
      updateData.guestCount = Math.max(1, Math.min(100000, Number(guestCount) || 500));
    }
    if (budget !== undefined) updateData.budget = String(budget).trim();
    if (foodPreference !== undefined) updateData.foodPreference = String(foodPreference).trim();
    if (notes !== undefined) updateData.notes = String(notes).trim();

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName || "",
        phone: user.phone || "",
        weddingDate: user.weddingDate || "",
        city: user.city || "",
        guestCount: user.guestCount || 500,
        budget: user.budget || "",
        foodPreference: user.foodPreference || "Veg",
        notes: user.notes || "",
      },
    });
  } catch (error) {
    console.error("Profile update error:", error.message);
    return res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
