const mongoose = require("mongoose");

const BreakdownSchema = new mongoose.Schema(
  {
    baseCost: { type: Number, default: 0 },
    durationOrAreaCost: { type: Number, default: 0 },
    equipmentCost: { type: Number, default: 0 },
    flowerCost: { type: Number, default: 0 },
    lightingCost: { type: Number, default: 0 },
    labourCost: { type: Number, default: 0 },
    transportCost: { type: Number, default: 0 },
    setupDismantleCost: { type: Number, default: 0 },
    optionalExtrasCost: { type: Number, default: 0 },
    refundableDeposit: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

const MusicTentQuotationSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    enquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MusicTentEnquiry",
      required: true,
      index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MusicTentVendor",
      required: true,
      index: true,
    },
    pricingType: {
      type: String,
      enum: ["StandardPackage", "CustomQuotation"],
      default: "CustomQuotation",
    },
    breakdown: {
      type: BreakdownSchema,
      required: true,
    },
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
    extraChargesNotes: {
      type: String,
      default: "Overtime beyond scheduled hours charged at standard hourly vendor rates.",
    },
    validUntil: {
      type: String,
      required: true,
    },
    confirmedAvailability: {
      type: Boolean,
      default: true, // Distinguishes confirmed vendor slot from sample estimates
    },
    vendorNotes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Submitted", "Accepted", "Declined", "Expired"],
      default: "Submitted",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

MusicTentQuotationSchema.index({ enquiry: 1, createdAt: -1 });

module.exports =
  mongoose.models.MusicTentQuotation ||
  mongoose.model("MusicTentQuotation", MusicTentQuotationSchema);
