const mongoose = require("mongoose");

const WalkieQuotationSchema = new mongoose.Schema(
  {
    enquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalkieEnquiry",
      required: true,
      index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalkieVendor",
      required: true,
      index: true,
    },
    lineItems: [
      {
        description: { type: String, required: true },
        category: {
          type: String,
          enum: ["Radios", "Headsets", "Batteries", "Chargers", "Delivery", "Technician", "Infrastructure", "Other"],
          default: "Radios",
        },
        quantity: { type: Number, required: true, min: 1 },
        durationDays: { type: Number, required: true, min: 1 },
        rate: { type: Number, required: true, min: 0 },
        amount: { type: Number, required: true, min: 0 },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    setupTechnicianFee: {
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
      default: 18,
      min: 0,
      max: 100,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    refundableDeposit: {
      type: Number,
      required: true,
      default: 5000,
      min: 0,
    },
    advancePercentage: {
      type: Number,
      default: 30,
      min: 0,
      max: 100,
    },
    advanceRequired: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceDue: {
      type: Number,
      required: true,
      min: 0,
    },
    validityDays: {
      type: Number,
      default: 3,
    },
    terms: {
      type: String,
      default: "Security deposit is fully refunded within 24 hours after post-event equipment inspection. Radios must not be operated on unauthorized emergency frequencies.",
    },
    cancellationPolicy: {
      type: String,
      default: "Full advance refund on cancellation up to 48 hours prior to delivery dispatch.",
    },
    deliveryScheduleNote: {
      type: String,
      default: "Handover scheduled 3 hours before event start time at venue.",
    },
    status: {
      type: String,
      enum: ["Sent", "Accepted", "Declined", "Expired"],
      default: "Sent",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalkieQuotation", WalkieQuotationSchema);
