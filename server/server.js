
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

const FoodPlan = require("./models/FoodPlan");

app.use(cors());
app.use(express.json({ limit: "20kb" }));

const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");

app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
console.log(
  "Registered routes:",
  app.router?.stack?.map((layer) => layer.route?.path || layer.name)
);




app.get("/", (req, res) => {
  res.json({ message: "Milap API is running!" });
});

app.get("/api/health", (req, res) => {
  res.json({
    server: "running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected"
  });
});

// Food Plan load
app.get("/api/food-plan", async (req, res) => {
  try {
    const plan = await FoodPlan.findOne({ planId: "default" });

    return res.json(
      plan || {
        guests: 500,
        foodType: "Veg",
        wastage: 10,
        selected: [
          "rice", "atta", "paneer", "potato",
          "tomato", "dal", "oil", "spices", "sweets"
        ],
        rates: {}
      }
    );
  } catch (error) {
    console.error("Food plan load error:", error.message);
    return res.status(500).json({
      message: "Food plan load nahi hua"
    });
  }
});

// Food Plan validation and save
app.put("/api/food-plan", async (req, res) => {
  try {
    const { guests, foodType, wastage, selected, rates } = req.body;

    const allowedItems = [
      "rice", "atta", "paneer", "potato", "tomato",
      "dal", "oil", "spices", "sweets", "chicken"
    ];

    const allowedFields = [
      "guests", "foodType", "wastage", "selected", "rates"
    ];

    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body) ||
      Object.keys(req.body).length !== allowedFields.length ||
      Object.keys(req.body).some(key => !allowedFields.includes(key))
    ) {
      return res.status(400).json({
        message: "Invalid request fields"
      });
    }

    if (
      !Number.isInteger(guests) ||
      guests < 1 ||
      guests > 100000
    ) {
      return res.status(400).json({
        message: "Guests must be an integer from 1 to 100000"
      });
    }

    if (!["Veg", "Non-Veg"].includes(foodType)) {
      return res.status(400).json({
        message: "Invalid food type"
      });
    }

    if (
      !Number.isFinite(wastage) ||
      wastage < 0 ||
      wastage > 25
    ) {
      return res.status(400).json({
        message: "Wastage must be between 0 and 25"
      });
    }

    if (
      !Array.isArray(selected) ||
      !selected.every(id => allowedItems.includes(id)) ||
      new Set(selected).size !== selected.length
    ) {
      return res.status(400).json({
        message: "Invalid or duplicate food items"
      });
    }

    if (
      !rates ||
      typeof rates !== "object" ||
      Array.isArray(rates) ||
      Object.keys(rates).some(key => !allowedItems.includes(key)) ||
      Object.values(rates).some(
        rate =>
          typeof rate !== "number" ||
          !Number.isFinite(rate) ||
          rate < 0 ||
          rate > 1000000
      )
    ) {
      return res.status(400).json({
        message: "Invalid ingredient rates"
      });
    }

    const plan = await FoodPlan.findOneAndUpdate(
      { planId: "default" },
      { $set: { guests, foodType, wastage, selected, rates } },
      { new: true, upsert: true, runValidators: true }
    );

    return res.json({
      message: "Food plan saved successfully",
      plan
    });
  } catch (error) {
    console.error("Food plan save error:", error.message);
    return res.status(500).json({
      message: "Food plan save nahi hua"
    });
  }
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI .env file mein missing hai");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Atlas connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
    console.log(
  "Auth route mounted:",
  app._router?.stack?.some(
    (layer) => layer.regexp?.toString().includes("api/auth")
  )
);
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
}

startServer();
