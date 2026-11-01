const mongoose = require("mongoose");

const WalkieAssignmentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalkieBooking",
      required: true,
      index: true,
    },
    groupName: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Stage & Program Management",
        "Security & Crowd Control",
        "Hospitality & VIP Coordination",
        "Parking & Valet Logistics",
        "Food & Catering Coordination",
        "Technical & AV Production",
        "Emergency & Medical Response",
        "General Event Crew",
      ],
      default: "Stage & Program Management",
    },
    channelNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 16,
      default: 1,
    },
    assignedRadioCount: {
      type: Number,
      required: true,
      min: 1,
      default: 2,
    },
    leadPersonName: {
      type: String,
      trim: true,
      default: "",
    },
    contactPhone: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Allocated", "Handed Over", "Returned"],
      default: "Allocated",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalkieAssignment", WalkieAssignmentSchema);
