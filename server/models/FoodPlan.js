
const mongoose = require("mongoose");

const foodPlanSchema = new mongoose.Schema(
  {
    planId: {
      type: String,
      required: true,
      unique: true,
      default: "default",
    },
    guests: {
      type: Number,
      default: 500,
      min: 1,
      max: 100000,
    },
    foodType: {
      type: String,
      enum: ["Veg", "Non-Veg"],
      default: "Veg",
    },
    wastage: {
      type: Number,
      default: 10,
      min: 0,
      max: 25,
    },
    selected: {
      type: [String],
      default: [],
    },
    rates: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodPlan", foodPlanSchema);


