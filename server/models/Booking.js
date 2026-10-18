
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    service: {
      type: String,
      required: true,
      enum: [
        "Venue",
        "DJ & Stage",
        "Tent & Decor",
        "Bhandari",
        "Jaimala Stage",
        "Invitation",
        "Sweets & Drinks",
        "Other",
      ],
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    eventDate: {
      type: Date,
      default: null,
    },
    providerName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      default: "",
    },
    estimatedCost: {
      type: Number,
      min: 0,
      max: 100000000,
      default: 0,
    },
    advancePaid: {
      type: Number,
      min: 0,
      max: 100000000,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Planned", "Contacted", "Confirmed", "Completed", "Cancelled"],
      default: "Planned",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
