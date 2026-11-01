const mongoose = require("mongoose");

const WalkieEnquirySchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalkieVendor",
      default: null,
      index: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      enum: [
        "Wedding",
        "Reception",
        "Sangeet & Mehendi",
        "Corporate Event / Conference",
        "Concert & Music Festival",
        "Exhibition & Trade Show",
        "Security & Crowd Management",
        "Other Celebration",
      ],
      default: "Wedding",
    },
    startDate: {
      type: String,
      required: true,
      trim: true,
    },
    endDate: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: String,
      default: "08:00",
    },
    endTime: {
      type: String,
      default: "22:00",
    },
    durationDays: {
      type: Number,
      default: 1,
      min: 1,
    },
    eventLocation: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    pincode: {
      type: String,
      default: "",
    },
    venueType: {
      type: String,
      enum: [
        "Indoor Banquet / Hotel",
        "Outdoor Lawn / Ground",
        "Multi-Floor Complex",
        "Hybrid Indoor & Outdoor",
      ],
      default: "Indoor Banquet / Hotel",
    },
    floorOrZonesCount: {
      type: Number,
      default: 2,
    },
    coverageRequired: {
      type: String,
      default: "1-3 km Radius / Event Grounds",
    },
    radioCount: {
      type: Number,
      required: true,
      min: 1,
      default: 10,
    },
    headsetCount: {
      type: Number,
      default: 10,
      min: 0,
    },
    extraBatteryCount: {
      type: Number,
      default: 5,
      min: 0,
    },
    chargerCount: {
      type: Number,
      default: 2,
      min: 0,
    },
    categoryPreference: {
      type: String,
      default: "Professional Digital Radios",
    },
    deliveryPreference: {
      type: String,
      enum: ["Vendor Delivery to Venue", "Self Pickup from Vendor Hub"],
      default: "Vendor Delivery to Venue",
    },
    technicalSupportRequired: {
      type: Boolean,
      default: false,
    },
    budget: {
      type: Number,
      default: 0,
    },
    specialInstructions: {
      type: String,
      default: "",
    },
    contactName: {
      type: String,
      required: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Submitted", "Quoted", "Accepted", "Declined", "Cancelled"],
      default: "Submitted",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalkieEnquiry", WalkieEnquirySchema);
