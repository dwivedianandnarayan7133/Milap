const mongoose = require("mongoose");

const MusicTentReviewSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MusicTentVendor",
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    eventDate: {
      type: String,
      default: "",
    },
    serviceUsed: {
      type: String,
      default: "DJ & Sound",
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    isVerifiedBooking: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

MusicTentReviewSchema.index({ vendor: 1, createdAt: -1 });

module.exports =
  mongoose.models.MusicTentReview ||
  mongoose.model("MusicTentReview", MusicTentReviewSchema);
