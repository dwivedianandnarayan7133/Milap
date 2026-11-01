
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Budget = require("../models/Budget");

const router = express.Router();

const categories = [
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
];

function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : "";

  if (!token) {
    return res.status(401).json({ message: "Please log in first." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId =
      payload.userId || payload.id || payload._id || payload.sub;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ message: "Invalid login token." });
    }

    req.userId = userId;
    next();
  } catch {
    return res.status(401).json({
      message: "Login token is invalid or expired. Please log in again.",
    });
  }
}

router.use(authenticate);

function validAmount(value) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100000000
  );
}

function summary(budget) {
  const expenses = budget.expenses || [];
  const estimatedTotal = expenses.reduce(
    (sum, item) => sum + item.estimatedCost,
    0
  );
  const actualTotal = expenses.reduce(
    (sum, item) => sum + item.actualCost,
    0
  );
  const advanceTotal = expenses.reduce(
    (sum, item) => sum + item.advancePaid,
    0
  );
  const pendingPayments = expenses.reduce(
    (sum, item) => sum + Math.max(item.actualCost - item.advancePaid, 0),
    0
  );

  return {
    totalBudget: budget.totalBudget,
    estimatedTotal,
    actualTotal,
    advanceTotal,
    remainingBudget: budget.totalBudget - actualTotal,
    pendingPayments,
    expenses,
  };
}

async function getOrCreateBudget(userId) {
  let budget = await Budget.findOne({ user: userId });

  if (!budget) {
    budget = await Budget.create({ user: userId, totalBudget: 0 });
  }

  return budget;
}

function validateExpense(data, isPartial = false) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "Invalid expense payload.";
  }

  if (!isPartial || data.title !== undefined) {
    if (
      typeof data.title !== "string" ||
      !data.title.trim() ||
      data.title.trim().length > 100
    ) {
      return "Enter an expense title (maximum 100 characters).";
    }
  }

  if (!isPartial || data.category !== undefined) {
    if (!categories.includes(data.category)) {
      return "Choose a valid expense category.";
    }
  }

  for (const field of ["estimatedCost", "actualCost", "advancePaid"]) {
    if (data[field] !== undefined && !validAmount(data[field])) {
      return `${field} must be a valid non-negative amount.`;
    }
  }

  if (
    data.notes !== undefined &&
    (typeof data.notes !== "string" || data.notes.length > 1000)
  ) {
    return "Notes must be text up to 1000 characters.";
  }

  if (data.dueDate !== undefined && typeof data.dueDate !== "string") {
    return "Due date must be text.";
  }

  return null;
}

router.get("/", async (req, res) => {
  try {
    const budget = await getOrCreateBudget(req.userId);
    res.json(summary(budget));
  } catch (error) {
    console.error("Budget GET error:", error);
    res.status(500).json({ message: "Could not load budget." });
  }
});

router.put("/total", async (req, res) => {
  try {
    const { totalBudget } = req.body;

    if (!validAmount(totalBudget)) {
      return res.status(400).json({
        message: "Total budget must be a valid non-negative number.",
      });
    }

    const budget = await getOrCreateBudget(req.userId);
    budget.totalBudget = totalBudget;
    await budget.save();

    res.json(summary(budget));
  } catch (error) {
    console.error("Budget total update error:", error);
    res.status(500).json({ message: "Could not update total budget." });
  }
});

router.post("/expenses", async (req, res) => {
  try {
    const errorMessage = validateExpense(req.body);
    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const budget = await getOrCreateBudget(req.userId);

    budget.expenses.push({
      title: req.body.title.trim(),
      category: req.body.category,
      estimatedCost: req.body.estimatedCost,
      actualCost: req.body.actualCost ?? 0,
      advancePaid: req.body.advancePaid ?? 0,
      dueDate: req.body.dueDate ?? "",
      notes: req.body.notes ?? "",
    });

    await budget.save();
    res.status(201).json(summary(budget));
  } catch (error) {
    console.error("Budget expense create error:", error);
    res.status(500).json({ message: "Could not add expense." });
  }
});

router.put("/expenses/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid expense ID." });
    }

    const errorMessage = validateExpense(req.body, true);
    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const budget = await Budget.findOne({
      user: req.userId,
      "expenses._id": req.params.id,
    });

    if (!budget) {
      return res.status(404).json({ message: "Expense not found." });
    }

    const expense = budget.expenses.id(req.params.id);

    for (const field of [
      "title",
      "category",
      "estimatedCost",
      "actualCost",
      "advancePaid",
      "dueDate",
      "notes",
    ]) {
      if (req.body[field] !== undefined) {
        expense[field] =
          field === "title" ? req.body[field].trim() : req.body[field];
      }
    }

    await budget.save();
    res.json(summary(budget));
  } catch (error) {
    console.error("Budget expense update error:", error);
    res.status(500).json({ message: "Could not update expense." });
  }
});

router.delete("/expenses/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid expense ID." });
    }

    const budget = await Budget.findOne({
      user: req.userId,
      "expenses._id": req.params.id,
    });

    if (!budget) {
      return res.status(404).json({ message: "Expense not found." });
    }

    budget.expenses.pull({ _id: req.params.id });
    await budget.save();

    res.json(summary(budget));
  } catch (error) {
    console.error("Budget expense delete error:", error);
    res.status(500).json({ message: "Could not delete expense." });
  }
});

module.exports = router;
