const mongoose = require("mongoose");

const ReferenceImageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dataUrl: { type: String, required: true }, // Base64 data URL
    sizeKb: { type: Number, default: 0 },
    mimeType: { type: String, default: "image/jpeg" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const MusicTentEnquirySchema = new mongoose.Schema(
  {
    enquiryNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MusicTentVendor",
      required: true,
      index: true,
    },
    serviceType: {
      type: String,
      enum: ["Music", "TentDecor", "Both"],
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    selectedPackage: {
      id: String,
      name: String,
      price: Number,
      isPriceOnRequest: Boolean,
      inclusions: [String],
    },
    eventDate: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    eventTime: {
      type: String,
      default: "18:00",
    },
    eventLocation: {
      type: String,
      required: true,
      trim: true,
    },
    locality: {
      type: String,
      trim: true,
      default: "",
    },
    pinCode: {
      type: String,
      trim: true,
      default: "",
    },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    guestCount: {
      type: Number,
      default: 300,
    },
    // Music Specifics
    durationHours: {
      type: Number,
      default: 4,
    },
    performersCount: {
      type: Number,
      default: 2,
    },
    soundCoverage: {
      type: String,
      default: "Standard Banquet Hall",
    },
    // Tent/Decor Specifics
    eventAreaSqFt: {
      type: Number,
      default: 2500,
    },
    indoorOutdoor: {
      type: String,
      enum: ["Indoor Banquet", "Outdoor Lawn", "Semi-Covered Hall", "Beach / Resort Garden"],
      default: "Indoor Banquet",
    },
    decorationPreferences: {
      type: [String],
      default: [],
    },
    flowerPreference: {
      type: String,
      default: "Fresh Exotic & Marigold Mix",
    },
    // Reference Images (with file validation)
    referenceImages: {
      type: [ReferenceImageSchema],
      default: [],
    },
    customRequirements: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Quoted", "Confirmed", "Cancelled"],
      default: "Pending",
      index: true,
    },
    vendorNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

MusicTentEnquirySchema.index({ customer: 1, createdAt: -1 });
MusicTentEnquirySchema.index({ vendor: 1, status: 1 });

module.exports =
  mongoose.models.MusicTentEnquiry ||
  mongoose.model("MusicTentEnquiry", MusicTentEnquirySchema);
