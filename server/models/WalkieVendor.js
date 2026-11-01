const mongoose = require("mongoose");

const WalkieVendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
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
    address: {
      type: String,
      default: "",
    },
    experienceYears: {
      type: Number,
      default: 5,
    },
    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Suspended"],
      default: "Verified",
      index: true,
    },
    wpcLicenseStatus: {
      type: String,
      default: "License-Free PMR446 / Commercial Frequency Compliance Certified",
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    deliveryOffered: {
      type: Boolean,
      default: true,
    },
    pickupOffered: {
      type: Boolean,
      default: true,
    },
    technicalSupportOffered: {
      type: Boolean,
      default: true,
    },
    depositPolicy: {
      type: String,
      default: "100% refundable security deposit returned within 24 hours post equipment inspection.",
    },
    cancellationPolicy: {
      type: String,
      default: "Full refund on cancellation up to 48 hours prior to event dispatch.",
    },
    pricingDefaults: {
      baseDailyPerRadio: { type: Number, default: 250 },
      headsetDailyRate: { type: Number, default: 40 },
      batteryDailyRate: { type: Number, default: 50 },
      chargerDailyRate: { type: Number, default: 100 },
      deliveryFee: { type: Number, default: 500 },
      setupFee: { type: Number, default: 1500 },
    },
    description: {
      type: String,
      default: "",
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

WalkieVendorSchema.index({ city: 1, isAvailable: 1, verificationStatus: 1 });

module.exports = mongoose.model("WalkieVendor", WalkieVendorSchema);
