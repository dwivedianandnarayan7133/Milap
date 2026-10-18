
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    fullName: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    weddingDate: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    guestCount: {
      type: Number,
      default: 500,
    },
    budget: {
      type: String,
      default: "",
    },
    foodPreference: {
      type: String,
      default: "Veg",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
