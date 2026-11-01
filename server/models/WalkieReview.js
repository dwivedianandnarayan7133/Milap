const mongoose = require("mongoose");

const WalkieReviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalkieBooking",
      required: true,
      unique: true,
      index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalkieVendor",
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    soundClarityRating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    batteryPerformanceRating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    customerSupportRating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalkieReview", WalkieReviewSchema);
