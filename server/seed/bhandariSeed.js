const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const CookingTeamVendor = require("../models/CookingTeamVendor");
const CookingTeamReview = require("../models/CookingTeamReview");

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://Vishal_95:radhe123@cluster0.ldzbanu.mongodb.net/shaadimanager?retryWrites=true&w=majority";

const SAMPLE_VENDORS = [
  {
    teamName: "Pandit Ramprasad Maharaj & Traditional Halwai Team",
    ownerName: "Pandit Ramprasad Sharma",
    teamType: "Maharaj",
    publicPhone: "+91 98201 45678",
    publicEmail: "ramprasad.maharaj@milap.events",
    city: "Mumbai",
    serviceAreas: ["Mumbai", "Thane", "Navi Mumbai", "Pune", "Nashik"],
    description: "Renowned 3rd-generation Marwadi & Awadhi royal cooking masters. Specialized in authentic pure vegetarian feast preparations for weddings, jaimala banquets, and sacred ceremonies with impeccable hygiene and traditional mantras.",
    experienceYears: 24,
    guestCapacity: { min: 100, max: 3500 },
    cookCount: 6,
    helperCount: 10,
    cuisineSpecializations: ["Rajasthani", "Awadhi", "North Indian"],
    serviceTypes: ["Labour-only cooking team", "Cooking team with basic equipment"],
    pricing: {
      baseDailyRate: 22000,
      perGuestRate: 35,
      minBookingAmount: 18000,
    },
    equipmentSupplied: [
      "Heavy Bhatti & Commercial High-Flame Burners",
      "Pure Copper & Stainless Steel Large Handis",
      "Traditional Kadhais and Jharas",
      "Sweet-making Kadhais & Trays",
    ],
    ingredientArrangements: "Host provides raw groceries according to our computerized APMC procurement list 24h prior. Team arrives with full traditional tools.",
    specialtyDishes: [
      "Royal Dal Baati Churma",
      "Shahi Awadhi Paneer",
      "Gatta Curry (Jodhpur Style)",
      "Pulao Navratan",
      "Mawa Kachori & Rabdi",
      "Kaju Katli (Fresh Batch)",
    ],
    ratingAverage: 4.9,
    reviewCount: 38,
    verificationStatus: "Verified",
    bookedDates: ["2026-11-20", "2026-12-05"],
    advancePercentageRequired: 25,
    cancellationPolicy: "100% advance refund if cancelled 15 days before event. 50% refund if cancelled 7 days before event.",
  },
  {
    teamName: "Kashi Vishwanath Bhandari & Bhoj Cooking Mandal",
    ownerName: "Bhandari Jagannath Rai",
    teamType: "Bhandari",
    publicPhone: "+91 94150 78912",
    publicEmail: "kashi.bhandari@milap.events",
    city: "Varanasi",
    serviceAreas: ["Varanasi", "Prayagraj", "Patna", "Lucknow", "Delhi NCR"],
    description: "Famous Purvanchal & Bihari traditional cooking team. Renowned for authentic rustic feasts, wedding pital handi preparations, authentic halwai sweets and mass-scale religious bhandara catering.",
    experienceYears: 19,
    guestCapacity: { min: 50, max: 5000 },
    cookCount: 5,
    helperCount: 9,
    cuisineSpecializations: ["Bhojpuri", "Bihari", "Awadhi"],
    serviceTypes: ["Labour-only cooking team", "Cooking team with basic equipment", "Cooking team with ingredients"],
    pricing: {
      baseDailyRate: 16000,
      perGuestRate: 25,
      minBookingAmount: 14000,
    },
    equipmentSupplied: [
      "Traditional Iron Kadhais",
      "Double Burner Bhattis",
      "Deep Fry Laddles & Strainers",
      "Dough Kneaders & Wooden Rolling Benches",
    ],
    ingredientArrangements: "Flexible. We can procure wholesale mandi spices & grains or work on host-supplied groceries.",
    specialtyDishes: [
      "Litti Chokha & Sattu Paratha",
      "Banarasi Aloo Dum & Bedmi Puri",
      "Bihari Ahuna Handi Preparation",
      "Chana Ghugni & Nimki",
      "Balushahi & Gur Ka Rasgulla",
    ],
    ratingAverage: 4.8,
    reviewCount: 29,
    verificationStatus: "Verified",
    bookedDates: ["2026-11-25"],
    advancePercentageRequired: 20,
    cancellationPolicy: "Full refund 10 days prior to event date.",
  },
  {
    teamName: "Sardar Gurpreet Singh Royal Tandoor & Halwai Masters",
    ownerName: "Sardar Gurpreet Singh",
    teamType: "Tandoor & Roti",
    publicPhone: "+91 98140 22334",
    publicEmail: "royal.tandoor@milap.events",
    city: "Delhi",
    serviceAreas: ["Delhi", "Noida", "Gurugram", "Chandigarh", "Amritsar", "Ludhiana"],
    description: "Grand Punjabi wedding specialists. Live copper clay tandoors, butter naan, lachha parathas, and rich slow-cooked Dal Makhani with expert Halwai masters for jalebi-rabdi and hot gulab jamun counters.",
    experienceYears: 16,
    guestCapacity: { min: 100, max: 2800 },
    cookCount: 5,
    helperCount: 8,
    cuisineSpecializations: ["Punjabi", "North Indian"],
    serviceTypes: ["Cooking team with basic equipment", "Labour-only cooking team", "Complete catering package"],
    pricing: {
      baseDailyRate: 20000,
      perGuestRate: 30,
      minBookingAmount: 16000,
    },
    equipmentSupplied: [
      "Mobile Copper Clay Tandoors (2 Units)",
      "Heavy Flat Tawa for Roti & Roomali",
      "Gas Regulators & Commercial Bhattis",
      "Serving Brass Degchis",
    ],
    ingredientArrangements: "Customer supplies flour, ghee and dairy, or we provide full raw material package on demand.",
    specialtyDishes: [
      "Dal Makhani (18-Hour Simmered)",
      "Paneer Tikka & Butter Naan",
      "Pindi Chole & Amritsari Bhature",
      "Live Jalebi & Rabdi Station",
      "Butter Chicken & Chicken Tikka (Non-Veg Option)",
      "Matka Kulfi Falooda",
    ],
    ratingAverage: 4.9,
    reviewCount: 42,
    verificationStatus: "Verified",
    bookedDates: ["2026-12-12"],
    advancePercentageRequired: 30,
    cancellationPolicy: "75% refund if cancelled 14 days before event.",
  },
  {
    teamName: "Shree Vallabh Gujarati & Rajasthani Maharaj Mandal",
    ownerName: "Mukeshbhai Maharaj",
    teamType: "Maharaj",
    publicPhone: "+91 98250 99881",
    publicEmail: "vallabh.maharaj@milap.events",
    city: "Ahmedabad",
    serviceAreas: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Mumbai"],
    description: "Supreme Gujarati Thali & Marwadi wedding specialists. Jain food expertise (Kandmool free), satvik temple preparation standards, and exquisite farsan and traditional Gujarati sweets.",
    experienceYears: 27,
    guestCapacity: { min: 100, max: 5000 },
    cookCount: 8,
    helperCount: 14,
    cuisineSpecializations: ["Gujarati", "Rajasthani"],
    serviceTypes: ["Labour-only cooking team", "Cooking team with basic equipment"],
    pricing: {
      baseDailyRate: 25000,
      perGuestRate: 40,
      minBookingAmount: 20000,
    },
    equipmentSupplied: [
      "Bhattis & Clean Gas Manifolds",
      "Farsan Deep Fryers & Kadhais",
      "Pure Silver & Brass Service Handis",
      "Steam Cooking Equipment for Dhokla/Patra",
    ],
    ingredientArrangements: "We provide complete Gujarati wedding grocery list including pure Gir cow ghee and dry fruit requirements.",
    specialtyDishes: [
      "Surti Undhiyu (Clay Pot Special)",
      "Gujarati Kadhi & Khichdi",
      "Live Fafda, Jalebi & Khaman",
      "Mohanthal & Kesar Shrikhand",
      "Kaju Katli & Pista Roll",
      "Ringna No Oro & Rotla",
    ],
    ratingAverage: 5.0,
    reviewCount: 51,
    verificationStatus: "Verified",
    bookedDates: [],
    advancePercentageRequired: 25,
    cancellationPolicy: "Full refund 20 days prior to event date.",
  },
];

async function seedBhandariVendors() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for Bhandari seeding...");

    for (const data of SAMPLE_VENDORS) {
      const existing = await CookingTeamVendor.findOne({ teamName: data.teamName });
      if (!existing) {
        await CookingTeamVendor.create(data);
        console.log(`✓ Seeded vendor: ${data.teamName}`);
      } else {
        console.log(`- Vendor already exists: ${data.teamName}`);
      }
    }

    console.log("✓ Bhandari vendors seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedBhandariVendors();
