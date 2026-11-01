const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Venue",
        "Food",
        "Tent & Decor",
        "DJ",
        "Jaimala",
        "Clothing",
        "Photography",
        "Transport",
        "Gifts",
        "Other",
      ],
    },
    estimatedCost: {
      type: Number,
      required: true,
      min: 0,
      max: 100000000,
      default: 0,
    },
    actualCost: {
      type: Number,
      min: 0,
      max: 100000000,
      default: 0,
    },
    advancePaid: {
      type: Number,
      min: 0,
      max: 100000000,
      default: 0,
    },
    dueDate: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      maxlength: 1000,
      default: "",
    },
  },
  { timestamps: true }
);

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    totalBudget: {
      type: Number,
      min: 0,
      max: 100000000,
      default: 0,
    },
    expenses: [expenseSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
