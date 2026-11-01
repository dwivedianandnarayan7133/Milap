const mongoose = require("mongoose");

const cookingTeamBookingSchema = new mongoose.Schema(
  {
    enquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CookingTeamEnquiry",
      required: true,
      index: true,
    },
    quotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CookingTeamQuotation",
      required: true,
      index: true,
    },
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
    eventDate: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },
    eventEndDate: {
      type: String,
      default: "",
    },
    guestCount: {
      type: Number,
      required: true,
    },
    agreedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    advancePaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Advance Paid", "Fully Paid", "Refunded"],
      default: "Advance Paid",
    },
    bookingStatus: {
      type: String,
      enum: [
        "Pending confirmation",
        "Confirmed",
        "In progress",
        "Completed",
        "Cancelled",
        "Disputed",
      ],
      default: "Confirmed",
      index: true,
    },
    quotationSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    cancellationDetails: {
      cancelledBy: { type: String, default: "" },
      reason: { type: String, default: "" },
      refundAmount: { type: Number, default: 0 },
      cancelledAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "CookingTeamBooking",
  cookingTeamBookingSchema
);
