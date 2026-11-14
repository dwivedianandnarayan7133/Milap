const mongoose = require("mongoose");

const MusicTentBookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    enquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MusicTentEnquiry",
      required: true,
    },
    quotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MusicTentQuotation",
      default: null,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MusicTentVendor",
      required: true,
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
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      default: "",
    },
    serviceType: {
      type: String,
      enum: ["Music", "TentDecor", "Both"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    eventDate: {
      type: String,
      required: true,
      index: true,
    },
    eventTime: {
      type: String,
      default: "18:00",
    },
    eventLocation: {
      type: String,
      required: true,
    },
    guestCount: {
      type: Number,
      default: 300,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    depositAmount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["Advance Paid", "Pending", "Fully Paid"],
      default: "Advance Paid",
    },
    status: {
      type: String,
      enum: ["Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Confirmed",
      index: true,
    },
    confirmedAvailability: {
      type: Boolean,
      default: true,
    },
    cancellationReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

MusicTentBookingSchema.index({ customer: 1, createdAt: -1 });

module.exports =
  mongoose.models.MusicTentBooking ||
  mongoose.model("MusicTentBooking", MusicTentBookingSchema);
