const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, default: 0 },
    isPriceOnRequest: { type: Boolean, default: false },
    validityDays: { type: Number, default: 30 },
    durationHours: { type: Number, default: 4 },
    performersCount: { type: Number, default: 2 },
    soundCoverage: { type: String, default: "Up to 500 Guests" },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    optionalExtras: [
      {
        name: { type: String },
        price: { type: Number, default: 0 },
      },
    ],
    isLiveAvailable: { type: Boolean, default: true },
    sampleOnly: { type: Boolean, default: false }, // Sample prices vs live prices
  },
  { _id: false }
);

const EquipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, default: "Audio" },
    brand: { type: String, default: "" },
    quantity: { type: Number, default: 1 },
    specs: { type: String, default: "" },
  },
  { _id: false }
);

const ThemePortfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "Mandap" },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    tags: { type: [String], default: [] },
    estimatedPrice: { type: Number, default: 0 },
  },
  { _id: false }
);

const MusicPricingBasisSchema = new mongoose.Schema(
  {
    baseHours: { type: Number, default: 4 },
    basePerformers: { type: Number, default: 2 },
    hourlyOvertimeRate: { type: Number, default: 2500 },
    soundCoverageGuests: { type: Number, default: 500 },
    setupTeardownIncluded: { type: Boolean, default: true },
    transportIncluded: { type: Boolean, default: true },
    transportFeePerKm: { type: Number, default: 25 },
    refundableDeposit: { type: Number, default: 5000 },
  },
  { _id: false }
);

const TentPricingBasisSchema = new mongoose.Schema(
  {
    baseAreaSqFt: { type: Number, default: 2000 },
    baseGuestCapacity: { type: Number, default: 400 },
    flowerTypeSupported: {
      type: [String],
      default: ["Marigold & Mogra", "Fresh Exotic", "Hybrid Floral", "Silk Artificial"],
    },
    labourIncluded: { type: Boolean, default: true },
    transportIncluded: { type: Boolean, default: true },
    installationDismantlingIncluded: { type: Boolean, default: true },
    extraSqFtRate: { type: Number, default: 25 },
    refundableDeposit: { type: Number, default: 10000 },
  },
  { _id: false }
);

const MusicTentVendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    name: {
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
    serviceType: {
      type: String,
      enum: ["Music", "TentDecor", "Both"],
      required: true,
      index: true,
    },
    categories: {
      type: [String],
      default: [],
      index: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
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
      index: true,
    },
    address: {
      type: String,
      default: "",
    },
    coordinates: {
      lat: { type: Number, default: 19.076 }, // Default Mumbai lat
      lng: { type: Number, default: 72.8777 }, // Default Mumbai lng
    },
    serviceRadiusKm: {
      type: Number,
      default: 50,
    },
    extendedServiceAreas: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      default: 5,
    },
    verificationStatus: {
      type: String,
      enum: ["Verified", "Unverified", "Pending"],
      default: "Verified",
      index: true,
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
    description: {
      type: String,
      default: "",
    },
    packages: {
      type: [PackageSchema],
      default: [],
    },
    equipmentDetails: {
      type: [EquipmentSchema],
      default: [],
    },
    themePortfolios: {
      type: [ThemePortfolioSchema],
      default: [],
    },
    musicPricingBasis: {
      type: MusicPricingBasisSchema,
      default: () => ({}),
    },
    tentPricingBasis: {
      type: TentPricingBasisSchema,
      default: () => ({}),
    },
    bookedDates: {
      type: [String],
      default: [],
    },
    cancellationPolicy: {
      type: String,
      default: "Full refund 14 days prior to event. 50% refund within 7 days.",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

MusicTentVendorSchema.index({ city: 1, serviceType: 1, verificationStatus: 1 });
MusicTentVendorSchema.index({ "coordinates.lat": 1, "coordinates.lng": 1 });

module.exports =
  mongoose.models.MusicTentVendor ||
  mongoose.model("MusicTentVendor", MusicTentVendorSchema);
