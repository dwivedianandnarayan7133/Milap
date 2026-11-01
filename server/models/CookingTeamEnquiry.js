const mongoose = require("mongoose");

const cookingTeamEnquirySchema = new mongoose.Schema(
  {
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
      trim: true,
      default: "",
    },
    customerPhone: {
      type: String,
      trim: true,
      default: "",
    },
    customerEmail: {
      type: String,
      trim: true,
      default: "",
    },
    eventType: {
      type: String,
      enum: [
        "Wedding",
        "Engagement / Ring Ceremony",
        "Sangeet / Mehendi",
        "Reception",
        "Birthday / Anniversary",
        "Religious Function / Katha",
        "Corporate / Gathering",
        "Other",
      ],
      default: "Wedding",
    },
    eventDate: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },
    eventEndDate: {
      type: String, // YYYY-MM-DD
      default: "",
    },
    eventLocation: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
      max: 100000,
    },
    cuisines: {
      type: [String],
      default: [],
    },
    serviceType: {
      type: String,
      enum: [
        "Labour-only cooking team",
        "Cooking team with basic equipment",
        "Cooking team with ingredients",
        "Complete catering package",
        "Custom service",
      ],
      default: "Labour-only cooking team",
    },
    requestedCooks: {
      type: Number,
      min: 1,
      max: 50,
      default: 4,
    },
    requestedHelpers: {
      type: Number,
      min: 0,
      max: 100,
      default: 6,
    },
    budget: {
      type: Number,
      min: 0,
      default: 0,
    },
    // Configurable Checklist: item -> "Supplied by customer" | "Supplied by vendor" | "Included in package" | "Not required"
    ingredientResponsibilities: {
      type: Map,
      of: String,
      default: {},
    },
    equipmentResponsibilities: {
      type: Map,
      of: String,
      default: {},
    },
    specialRequirements: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "Submitted",
        "Quotation Received",
        "Accepted",
        "Declined",
        "Cancelled",
      ],
      default: "Submitted",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CookingTeamEnquiry", cookingTeamEnquirySchema);
