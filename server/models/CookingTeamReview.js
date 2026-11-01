const mongoose = require("mongoose");

const cookingTeamReviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CookingTeamBooking",
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CookingTeamVendor",
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      default: "Verified Host",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    dishHighlights: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "CookingTeamReview",
  cookingTeamReviewSchema
);
