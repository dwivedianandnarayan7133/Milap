const mongoose = require("mongoose");

const cookingTeamVendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    teamType: {
      type: String,
      enum: [
        "Bhandari",
        "Maharaj",
        "Halwai",
        "Tandoor & Roti",
        "Complete Catering",
        "Custom Team",
      ],
      default: "Bhandari",
      index: true,
    },
    publicPhone: {
      type: String,
      trim: true,
      default: "",
    },
    publicEmail: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    serviceAreas: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    experienceYears: {
      type: Number,
      min: 0,
      max: 60,
      default: 5,
    },
    guestCapacity: {
      min: { type: Number, default: 50, min: 1 },
      max: { type: Number, default: 3000, max: 50000 },
    },
    cookCount: {
      type: Number,
      min: 1,
      max: 50,
      default: 4,
    },
    helperCount: {
      type: Number,
      min: 0,
      max: 100,
      default: 6,
    },
    cuisineSpecializations: {
      type: [String],
      enum: [
        "Awadhi",
        "Bhojpuri",
        "Bihari",
        "Punjabi",
        "Rajasthani",
        "Gujarati",
        "Bengali",
        "Maharashtrian",
        "South Indian",
        "North Indian",
        "Custom regional cuisine",
      ],
      default: ["North Indian"],
      index: true,
    },
    serviceTypes: {
      type: [String],
      enum: [
        "Labour-only cooking team",
        "Cooking team with basic equipment",
        "Cooking team with ingredients",
        "Complete catering package",
        "Custom service",
      ],
      default: ["Labour-only cooking team"],
      index: true,
    },
    pricing: {
      baseDailyRate: { type: Number, default: 15000, min: 0 },
      perGuestRate: { type: Number, default: 0, min: 0 },
      minBookingAmount: { type: Number, default: 10000, min: 0 },
    },
    equipmentSupplied: {
      type: [String],
      default: [],
    },
    ingredientArrangements: {
      type: String,
      default: "Host provides ingredients as per raw material list; Team brings own knives, ladles and master tools.",
    },
    portfolioImages: {
      type: [String],
      default: [],
    },
    specialtyDishes: {
      type: [String],
      default: [],
    },
    ratingAverage: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.8,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    verificationStatus: {
      type: String,
      enum: ["Draft", "Submitted", "Verified", "Suspended"],
      default: "Verified",
      index: true,
    },
    bookedDates: {
      type: [String], // YYYY-MM-DD
      default: [],
    },
    advancePercentageRequired: {
      type: Number,
      min: 0,
      max: 100,
      default: 25,
    },
    cancellationPolicy: {
      type: String,
      default: "100% advance refund if cancelled 15 days before event. 50% refund if cancelled 7 days before event.",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CookingTeamVendor", cookingTeamVendorSchema);
