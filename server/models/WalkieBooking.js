const mongoose = require("mongoose");

const WalkieBookingSchema = new mongoose.Schema(
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
      required: true,
      index: true,
    },
    enquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalkieEnquiry",
      required: true,
    },
    quotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalkieQuotation",
      required: true,
    },
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    eventLocation: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
      index: true,
    },
    endDate: {
      type: String,
      required: true,
      index: true,
    },
    durationDays: {
      type: Number,
      default: 1,
    },
    radioCount: {
      type: Number,
      required: true,
    },
    headsetCount: {
      type: Number,
      default: 0,
    },
    extraBatteryCount: {
      type: Number,
      default: 0,
    },
    chargerCount: {
      type: Number,
      default: 0,
    },
    equipmentSnapshot: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    agreedRentalTotal: {
      type: Number,
      required: true,
    },
    refundableDeposit: {
      type: Number,
      required: true,
    },
    advancePaid: {
      type: Number,
      default: 0,
    },
    balanceRemaining: {
      type: Number,
      default: 0,
    },
    bookingStatus: {
      type: String,
      enum: [
        "Confirmed",
        "Preparing",
        "Dispatched",
        "HandoverCompleted",
        "RentalInProgress",
        "ReturnPending",
        "InspectionPending",
        "DepositReconciliationPending",
        "Completed",
        "Cancelled",
        "Disputed",
      ],
      default: "Confirmed",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "AdvancePaid", "FullyPaid", "DepositRefunded"],
      default: "AdvancePaid",
    },
    handoverToken: {
      type: String,
      required: true,
      unique: true,
    },
    returnToken: {
      type: String,
      required: true,
      unique: true,
    },
    dispatchDetails: {
      dispatchedAt: { type: Date, default: null },
      dispatchedBy: { type: String, default: "" },
      notes: { type: String, default: "" },
      clientAcknowledged: { type: Boolean, default: false },
    },
    returnDetails: {
      returnedAt: { type: Date, default: null },
      inspectedBy: { type: String, default: "" },
      missingItemsCount: { type: Number, default: 0 },
      damagedItemsCount: { type: Number, default: 0 },
      damageCharges: { type: Number, default: 0 },
      refundedDepositAmount: { type: Number, default: 0 },
      reconciliationNotes: { type: String, default: "" },
      clientAcknowledged: { type: Boolean, default: false },
    },
    auditLogs: [
      {
        action: { type: String, required: true },
        performedBy: { type: String, default: "System" },
        timestamp: { type: Date, default: Date.now },
        notes: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

WalkieBookingSchema.index({ vendor: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model("WalkieBooking", WalkieBookingSchema);
