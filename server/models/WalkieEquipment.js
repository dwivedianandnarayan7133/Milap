const mongoose = require("mongoose");

const WalkieEquipmentSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WalkieVendor",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    modelNumber: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Standard Two-Way Radios",
        "Professional Digital Radios",
        "Headset & Earpiece Kits",
        "Speaker Microphones",
        "Chargers & Stations",
        "Spare Batteries",
        "Repeaters & Infrastructure",
        "Carrying Accessories",
      ],
      required: true,
      index: true,
    },
    radioType: {
      type: String,
      enum: ["Analog", "Digital DMR", "Hybrid (Analog/Digital)", "Accessory / Infrastructure"],
      default: "Digital DMR",
    },
    frequencyBand: {
      type: String,
      default: "UHF (400-470 MHz) / PMR446",
    },
    rfPowerWatts: {
      type: Number,
      default: 4,
    },
    channelCapacity: {
      type: Number,
      default: 16,
    },
    batteryType: {
      type: String,
      default: "Li-ion 2200mAh (Up to 18 Hours battery life)",
    },
    operatingRangeEstimate: {
      type: String,
      default: "1.5 - 3.5 km line-of-sight / Up to 15 floors indoor coverage",
    },
    complianceClass: {
      type: String,
      default: "WPC Compliant / Commercial Frequency Standard",
    },
    compatibleAccessories: {
      type: [String],
      default: ["Acoustic Tube Earpiece", "Shoulder Mic", "6-Way Gang Charger", "Belt Clip"],
    },
    totalStock: {
      type: Number,
      required: true,
      min: 0,
      default: 20,
    },
    reservedStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    dispatchedStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    maintenanceStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
    },
    replacementCost: {
      type: Number,
      default: 8000,
      min: 0,
    },
    depositPerUnit: {
      type: Number,
      default: 500,
      min: 0,
    },
    minRentalDays: {
      type: Number,
      default: 1,
      min: 1,
    },
    condition: {
      type: String,
      enum: ["Brand New", "Excellent", "Good"],
      default: "Excellent",
    },
    photos: {
      type: [String],
      default: [],
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

// Virtual property for real available stock
WalkieEquipmentSchema.virtual("effectiveAvailableStock").get(function () {
  const locked = (this.reservedStock || 0) + (this.dispatchedStock || 0) + (this.maintenanceStock || 0);
  return Math.max(0, (this.totalStock || 0) - locked);
});

WalkieEquipmentSchema.set("toJSON", { virtuals: true });
WalkieEquipmentSchema.set("toObject", { virtuals: true });

WalkieEquipmentSchema.index({ vendor: 1, category: 1, isAvailable: 1 });

module.exports = mongoose.model("WalkieEquipment", WalkieEquipmentSchema);
