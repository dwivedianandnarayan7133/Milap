const mongoose = require("mongoose");

const quotationLineItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: [
      "Main Cooks Labour",
      "Halwai Specialist Labour",
      "Roti & Tandoor Labour",
      "Kitchen Helpers",
      "Equipment & Bhatti Rental",
      "Cooking Fuel / LPG",
      "Raw Ingredients Package",
      "Transportation",
      "Serving & Cleaning Staff",
      "Overtime / Special Charge",
      "Other",
    ],
    default: "Main Cooks Labour",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unit: {
    type: String,
    default: "Day",
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  notes: {
    type: String,
    default: "",
  },
});

const cookingTeamQuotationSchema = new mongoose.Schema(
  {
    enquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CookingTeamEnquiry",
      required: true,
      index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CookingTeamVendor",
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lineItems: [quotationLineItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    equipmentCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    transportCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 28,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    advancePercentage: {
      type: Number,
      default: 25,
      min: 0,
      max: 100,
    },
    advanceAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    validUntil: {
      type: String, // YYYY-MM-DD
      default: "",
    },
    staffingProposed: {
      cooks: { type: Number, default: 4 },
      helpers: { type: Number, default: 6 },
      halwaiSpecialists: { type: Number, default: 2 },
    },
    terms: {
      type: String,
      default: "50% advance before event date, balance upon completion of event food service. Clean drinking water and resting space to be provided for team.",
    },
    status: {
      type: String,
      enum: ["Active", "Accepted", "Declined", "Expired", "Superseded"],
      default: "Active",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "CookingTeamQuotation",
  cookingTeamQuotationSchema
);
