
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Booking = require("../models/Booking");

const router = express.Router();

// JWT token verify karein
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.userId || payload.id || payload._id;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ message: "Invalid login token" });
    }

    req.userId = userId;
    next();
  } catch {
    return res.status(401).json({ message: "Session expired. Login again." });
  }
}

router.use(requireAuth);

// Sirf current user ki bookings dekhein
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .sort({ eventDate: 1, createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (error) {
    console.error("Bookings load error:", error.message);
    res.status(500).json({ message: "Bookings load nahi hui" });
  }
});

// Nayi booking save karein
router.post("/", async (req, res) => {
  try {
    const allowed = [
      "service",
      "title",
      "eventDate",
      "providerName",
      "phone",
      "estimatedCost",
      "advancePaid",
      "status",
      "notes",
    ];

    const body = req.body;

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      Object.keys(body).some((key) => !allowed.includes(key))
    ) {
      return res.status(400).json({ message: "Invalid request fields" });
    }

    if (
      typeof body.title !== "string" ||
      !body.title.trim() ||
      body.title.trim().length > 120
    ) {
      return res.status(400).json({ message: "Booking title required" });
    }

    for (const field of ["providerName", "phone", "notes"]) {
      if (body[field] !== undefined && typeof body[field] !== "string") {
        return res.status(400).json({ message: `Invalid ${field}` });
      }
    }

    for (const field of ["estimatedCost", "advancePaid"]) {
      if (
        body[field] !== undefined &&
        (typeof body[field] !== "number" ||
          !Number.isFinite(body[field]) ||
          body[field] < 0 ||
          body[field] > 100000000)
      ) {
        return res.status(400).json({ message: `Invalid ${field}` });
      }
    }

    if (
      body.advancePaid !== undefined &&
      body.estimatedCost !== undefined &&
      body.advancePaid > body.estimatedCost
    ) {
      return res.status(400).json({
        message: "Advance paid cannot exceed estimated cost",
      });
    }

    if (body.eventDate !== undefined && body.eventDate !== null) {
      if (
        typeof body.eventDate !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(body.eventDate) ||
        Number.isNaN(Date.parse(`${body.eventDate}T00:00:00.000Z`)) ||
        new Date(`${body.eventDate}T00:00:00.000Z`)
          .toISOString()
          .slice(0, 10) !== body.eventDate
      ) {
        return res.status(400).json({ message: "Invalid event date" });
      }
    }

    const booking = await Booking.create({
      ...body,
      title: body.title.trim(),
      user: req.userId,
    });

    res.status(201).json({
      message: "Booking saved successfully",
      booking,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "Booking details invalid" });
    }

    console.error("Booking save error:", error.message);
    res.status(500).json({ message: "Booking save nahi hui" });
  }
});

// Booking update karein; sirf apni booking
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const allowed = [
      "service",
      "title",
      "eventDate",
      "providerName",
      "phone",
      "estimatedCost",
      "advancePaid",
      "status",
      "notes",
    ];

    const body = req.body;

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      Object.keys(body).length === 0 ||
      Object.keys(body).some((key) => !allowed.includes(key))
    ) {
      return res.status(400).json({ message: "Invalid request fields" });
    }

    if (body.title !== undefined &&
      (typeof body.title !== "string" ||
       !body.title.trim() ||
       body.title.trim().length > 120)) {
      return res.status(400).json({ message: "Invalid booking title" });
    }

    for (const field of ["providerName", "phone", "notes"]) {
      if (body[field] !== undefined && typeof body[field] !== "string") {
        return res.status(400).json({ message: `Invalid ${field}` });
      }
    }

    for (const field of ["estimatedCost", "advancePaid"]) {
      if (body[field] !== undefined &&
        (typeof body[field] !== "number" ||
         !Number.isFinite(body[field]) ||
         body[field] < 0 ||
         body[field] > 100000000)) {
        return res.status(400).json({ message: `Invalid ${field}` });
      }
    }

    if (body.eventDate !== undefined && body.eventDate !== null) {
      if (
        typeof body.eventDate !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(body.eventDate) ||
        Number.isNaN(Date.parse(`${body.eventDate}T00:00:00.000Z`)) ||
        new Date(`${body.eventDate}T00:00:00.000Z`)
          .toISOString()
          .slice(0, 10) !== body.eventDate
      ) {
        return res.status(400).json({ message: "Invalid event date" });
      }
    }

    const current = await Booking.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!current) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const updated = {
      ...current.toObject(),
      ...body,
    };

    if (
      updated.estimatedCost !== undefined &&
      updated.advancePaid !== undefined &&
      updated.advancePaid > updated.estimatedCost
    ) {
      return res.status(400).json({
        message: "Advance paid cannot exceed estimated cost",
      });
    }

    for (const [key, value] of Object.entries(body)) {
      current[key] = key === "title" ? value.trim() : value;
    }

    await current.save();
    res.json({ message: "Booking updated", booking: current });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "Booking details invalid" });
    }

    console.error("Booking update error:", error.message);
    res.status(500).json({ message: "Booking update nahi hui" });
  }
});

// Booking delete karein; sirf apni booking
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Booking delete error:", error.message);
    res.status(500).json({ message: "Booking delete nahi hui" });
  }
});

module.exports = router;
