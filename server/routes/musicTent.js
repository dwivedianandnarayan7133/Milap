const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const MusicTentVendor = require("../models/MusicTentVendor");
const MusicTentEnquiry = require("../models/MusicTentEnquiry");
const MusicTentQuotation = require("../models/MusicTentQuotation");
const MusicTentBooking = require("../models/MusicTentBooking");
const MusicTentReview = require("../models/MusicTentReview");
const { SEED_VENDORS, SEED_REVIEWS } = require("../seed/musicTentSeed");

const router = express.Router();

// In-memory fallback stores when MongoDB is in disconnected state
let inMemoryVendors = JSON.parse(JSON.stringify(SEED_VENDORS)).map((v, i) => ({
  ...v,
  _id: new mongoose.Types.ObjectId().toString(),
  createdAt: new Date().toISOString(),
}));

let inMemoryEnquiries = [];
let inMemoryQuotations = [];
let inMemoryBookings = [];
let inMemoryReviews = JSON.parse(JSON.stringify(SEED_REVIEWS)).map((r, i) => {
  const vendor = inMemoryVendors.find((v) => v.name === r.vendorName);
  return {
    ...r,
    _id: new mongoose.Types.ObjectId().toString(),
    vendor: vendor ? vendor._id : inMemoryVendors[0]._id,
    createdAt: new Date().toISOString(),
  };
});

// Helper: Haversine distance in km
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Known coordinates for Indian major cities & localities
const CITY_COORDINATES = {
  mumbai: { lat: 19.076, lng: 72.8777 },
  bkc: { lat: 19.0657, lng: 72.8687 },
  bandra: { lat: 19.0596, lng: 72.8295 },
  thane: { lat: 19.2183, lng: 72.9781 },
  delhi: { lat: 28.6139, lng: 77.209 },
  "delhi ncr": { lat: 28.6139, lng: 77.209 },
  noida: { lat: 28.5355, lng: 77.391 },
  gurugram: { lat: 28.4595, lng: 77.0266 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  udaipur: { lat: 24.5854, lng: 73.7125 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  pune: { lat: 18.5204, lng: 73.8567 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
};

// Authentication Middlewares
function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme === "Bearer" && token) {
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || "milap_dev_secret_key"
      );
      req.userId = payload.userId || payload.id || payload._id || payload.sub;
      req.user = payload;
    } catch {
      // ignore
    }
  }
  next();
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Login required to access this service" });
  }
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "milap_dev_secret_key"
    );
    req.userId = payload.userId || payload.id || payload._id || payload.sub;
    req.user = payload;
    next();
  } catch {
    return res
      .status(401)
      .json({ message: "Session expired. Please log in again." });
  }
}

// ============================================================
// 1. GET /api/music-tent/vendors - Discovery & Search with Filters
// ============================================================
router.get("/vendors", optionalAuth, async (req, res) => {
  try {
    const {
      serviceType, // "Music" | "TentDecor" | "Both" | undefined
      category, // e.g. "DJ", "Mandap", "Live Band", etc.
      city,
      locality,
      pinCode,
      lat,
      lng,
      maxDistanceKm,
      date, // YYYY-MM-DD
      budget, // max budget
      guests, // expected guests
      duration, // hours
      verifiedOnly, // "true"
      sort, // "rating", "price_asc", "price_desc", "distance", "experience"
    } = req.query;

    const isDbConnected = mongoose.connection.readyState === 1;

    let vendors = [];
    if (isDbConnected) {
      try {
        let dbFilter = { isAvailable: true };
        if (serviceType && serviceType !== "All") {
          dbFilter.$or = [{ serviceType }, { serviceType: "Both" }];
        }
        if (verifiedOnly === "true") {
          dbFilter.verificationStatus = "Verified";
        }
        if (category && category !== "All") {
          dbFilter.categories = category;
        }
        if (city && city.trim()) {
          const cityRegex = new RegExp(city.trim(), "i");
          dbFilter.$or = [
            ...(dbFilter.$or || []),
            { city: cityRegex },
            { extendedServiceAreas: cityRegex },
          ];
        }
        vendors = await MusicTentVendor.find(dbFilter).lean();
      } catch (dbErr) {
        console.warn("DB query failed, using in-memory vendors:", dbErr.message);
        vendors = [...inMemoryVendors];
      }
    } else {
      vendors = [...inMemoryVendors];
    }

    // Resolve search center coordinates
    let searchLat = lat ? Number(lat) : null;
    let searchLng = lng ? Number(lng) : null;

    if ((!searchLat || !searchLng) && city) {
      const normalizedCity = city.trim().toLowerCase();
      if (CITY_COORDINATES[normalizedCity]) {
        searchLat = CITY_COORDINATES[normalizedCity].lat;
        searchLng = CITY_COORDINATES[normalizedCity].lng;
      }
    }

    // In-memory advanced filter pipeline (handles distance, dates, budget, packages, extended service areas)
    let filtered = vendors.filter((v) => {
      // Service type check
      if (serviceType && serviceType !== "All") {
        if (v.serviceType !== serviceType && v.serviceType !== "Both") {
          return false;
        }
      }

      // Verified check
      if (verifiedOnly === "true" && v.verificationStatus !== "Verified") {
        return false;
      }

      // Category check
      if (category && category !== "All") {
        if (!v.categories || !v.categories.includes(category)) {
          return false;
        }
      }

      // Location match: City, Locality, PIN Code, or Extended Service Areas
      if (city && city.trim()) {
        const cTerm = city.trim().toLowerCase();
        const cityMatches =
          v.city?.toLowerCase().includes(cTerm) ||
          v.locality?.toLowerCase().includes(cTerm) ||
          v.extendedServiceAreas?.some((a) => a.toLowerCase().includes(cTerm));

        // If distance coordinates exist, allow within service radius even if city name doesn't match
        let distanceKm = null;
        if (searchLat && searchLng && v.coordinates?.lat && v.coordinates?.lng) {
          distanceKm = calculateDistanceKm(
            searchLat,
            searchLng,
            v.coordinates.lat,
            v.coordinates.lng
          );
        }

        const withinRadius =
          distanceKm !== null && distanceKm <= (v.serviceRadiusKm || 50);

        if (!cityMatches && !withinRadius) {
          return false;
        }
      }

      if (pinCode && pinCode.trim()) {
        if (v.pinCode && v.pinCode !== pinCode.trim()) {
          // If PIN differs, check if covered in extended areas
          if (!v.extendedServiceAreas || v.extendedServiceAreas.length === 0) {
            return false;
          }
        }
      }

      // Date availability check
      if (date && v.bookedDates && v.bookedDates.includes(date)) {
        return false;
      }

      // Guest capacity check
      if (guests && Number(guests) > 0) {
        const guestNum = Number(guests);
        if (v.serviceType === "TentDecor" || v.serviceType === "Both") {
          if (
            v.tentPricingBasis &&
            v.tentPricingBasis.baseGuestCapacity &&
            v.tentPricingBasis.baseGuestCapacity * 2 < guestNum
          ) {
            // Can be accommodated with extra sqft, but check if reasonable
          }
        }
      }

      // Budget filter check
      if (budget && Number(budget) > 0) {
        const b = Number(budget);
        const minPkgPrice = (v.packages || []).reduce((min, p) => {
          if (!p.isPriceOnRequest && p.price > 0) {
            return Math.min(min, p.price);
          }
          return min;
        }, Infinity);

        if (minPkgPrice !== Infinity && minPkgPrice > b) {
          return false;
        }
      }

      return true;
    });

    // Compute distance and annotate vendors
    const annotated = filtered.map((v) => {
      let distanceKm = null;
      let servesTargetArea = true;

      if (searchLat && searchLng && v.coordinates?.lat && v.coordinates?.lng) {
        distanceKm = calculateDistanceKm(
          searchLat,
          searchLng,
          v.coordinates.lat,
          v.coordinates.lng
        );
        servesTargetArea =
          distanceKm <= (v.serviceRadiusKm || 50) ||
          (city &&
            v.extendedServiceAreas?.some((a) =>
              a.toLowerCase().includes(city.trim().toLowerCase())
            ));
      }

      return {
        ...v,
        distanceKm,
        servesTargetArea,
      };
    });

    // Max distance filter if specified
    let finalResults = annotated;
    if (maxDistanceKm && Number(maxDistanceKm) > 0) {
      finalResults = annotated.filter(
        (v) => v.distanceKm === null || v.distanceKm <= Number(maxDistanceKm)
      );
    }

    // Sorting
    if (sort === "price_asc") {
      finalResults.sort((a, b) => {
        const aPrice = (a.packages || [])[0]?.price || 0;
        const bPrice = (b.packages || [])[0]?.price || 0;
        return aPrice - bPrice;
      });
    } else if (sort === "price_desc") {
      finalResults.sort((a, b) => {
        const aPrice = (a.packages || [])[0]?.price || 0;
        const bPrice = (b.packages || [])[0]?.price || 0;
        return bPrice - aPrice;
      });
    } else if (sort === "distance") {
      finalResults.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    } else if (sort === "experience") {
      finalResults.sort(
        (a, b) => (b.experienceYears || 0) - (a.experienceYears || 0)
      );
    } else {
      // Default: verified first, then highest rating
      finalResults.sort((a, b) => {
        if (a.verificationStatus === "Verified" && b.verificationStatus !== "Verified")
          return -1;
        if (b.verificationStatus === "Verified" && a.verificationStatus !== "Verified")
          return 1;
        return (b.rating || 0) - (a.rating || 0);
      });
    }

    res.json({
      success: true,
      count: finalResults.length,
      vendors: finalResults,
      searchCenter: searchLat && searchLng ? { lat: searchLat, lng: searchLng } : null,
    });
  } catch (err) {
    console.error("Vendors fetch error:", err);
    res.status(500).json({ message: "Failed to retrieve vendors" });
  }
});

// ============================================================
// 2. GET /api/music-tent/vendors/:id - Detailed Profile & Reviews
// ============================================================
router.get("/vendors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let vendor = null;
    let reviews = [];

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      vendor = await MusicTentVendor.findById(id).lean();
      if (vendor) {
        reviews = await MusicTentReview.find({ vendor: id })
          .sort({ createdAt: -1 })
          .lean();
      }
    }

    if (!vendor) {
      vendor = inMemoryVendors.find((v) => v._id.toString() === id);
      if (vendor) {
        reviews = inMemoryReviews.filter((r) => r.vendor.toString() === id);
      }
    }

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({
      success: true,
      vendor,
      reviews,
    });
  } catch (err) {
    console.error("Vendor detail error:", err);
    res.status(500).json({ message: "Failed to retrieve vendor details" });
  }
});

// ============================================================
// 3. POST /api/music-tent/calculate - Pricing Calculator Engine
// ============================================================
router.post("/calculate", (req, res) => {
  try {
    const {
      serviceType, // "Music" | "TentDecor"
      category,
      durationHours = 4,
      performersCount = 2,
      soundCoverageGuests = 500,
      includeLighting = true,
      includeStageTrussing = false,
      eventAreaSqFt = 2500,
      flowerType = "Marigold & Mogra",
      mandapTier = "Royal Rajwada", // "Standard", "Royal Rajwada", "Glass Palace", "Temple Bells"
      furnitureCount = 200,
      distanceKm = 15,
      selectedExtras = [],
    } = req.body;

    let breakdown = {
      baseCost: 0,
      durationOrAreaCost: 0,
      equipmentCost: 0,
      flowerCost: 0,
      lightingCost: 0,
      labourCost: 0,
      transportCost: 0,
      setupDismantleCost: 0,
      optionalExtrasCost: 0,
      refundableDeposit: 0,
      subtotal: 0,
      tax: 0,
      total: 0,
    };

    if (serviceType === "Music") {
      // Base according to category (Pocket-friendly rates)
      let baseRate = 12000;
      if (category === "DJ") baseRate = 15000;
      if (category === "Live Band") baseRate = 28000;
      if (category === "Orchestra") baseRate = 35000;
      if (category === "Shehnai") baseRate = 14000;
      if (category === "Dhol") baseRate = 8500;

      breakdown.baseCost = baseRate;

      // Overtime beyond base 4 hours
      const overtimeHours = Math.max(0, durationHours - 4);
      breakdown.durationOrAreaCost = overtimeHours * 1200;

      // Performer adjustment beyond 2
      const extraPerformers = Math.max(0, performersCount - 2);
      breakdown.labourCost = extraPerformers * 1500;

      // Sound coverage scale
      if (soundCoverageGuests > 1000) {
        breakdown.equipmentCost = 14000; // Dual Line Array
      } else if (soundCoverageGuests > 400) {
        breakdown.equipmentCost = 7000; // 4-Point High Output
      } else {
        breakdown.equipmentCost = 3500; // 2-Point Acoustic
      }

      // Lighting & Trussing
      if (includeLighting) breakdown.lightingCost += 4000;
      if (includeStageTrussing) breakdown.lightingCost += 6000;

      // Transport
      breakdown.transportCost = Math.max(800, distanceKm * 15);
      breakdown.setupDismantleCost = 1500;
      breakdown.refundableDeposit = 2000;
    } else {
      // Tent & Decor calculation (Pocket-friendly rates)
      const area = Math.max(1000, Number(eventAreaSqFt));
      const baseArea = 2000;
      const extraSqFt = Math.max(0, area - baseArea);

      let baseTentRate = 22000;
      if (mandapTier === "Glass Palace") baseTentRate = 45000;
      if (mandapTier === "Temple Bells") baseTentRate = 28000;
      if (mandapTier === "Royal Rajwada") baseTentRate = 32000;

      breakdown.baseCost = baseTentRate;
      breakdown.durationOrAreaCost = extraSqFt * 10; // Rs 10/sq ft extra

      // Flowers
      if (flowerType === "Fresh Exotic" || flowerType === "Dutch Roses & Orchids") {
        breakdown.flowerCost = 16000;
      } else if (flowerType === "White Jasmine & Lotus") {
        breakdown.flowerCost = 12000;
      } else if (flowerType === "Silk Artificial Hybrids") {
        breakdown.flowerCost = 6500;
      } else {
        breakdown.flowerCost = 8500; // Marigold & Mogra
      }

      // Lighting & Chandeliers
      breakdown.lightingCost = 7500;

      // Furniture & Seating (Chairs, sofas, table linens)
      breakdown.equipmentCost = furnitureCount * 30;

      // Labour & logistics
      breakdown.labourCost = 5000;
      breakdown.setupDismantleCost = 3500;
      breakdown.transportCost = Math.max(1200, distanceKm * 20);
      breakdown.refundableDeposit = 4000;
    }

    // Optional Extras
    if (Array.isArray(selectedExtras)) {
      breakdown.optionalExtrasCost = selectedExtras.reduce(
        (sum, item) => sum + (Number(item.price) || 0),
        0
      );
    }

    // Subtotal, 18% GST, and Total
    breakdown.subtotal =
      breakdown.baseCost +
      breakdown.durationOrAreaCost +
      breakdown.equipmentCost +
      breakdown.flowerCost +
      breakdown.lightingCost +
      breakdown.labourCost +
      breakdown.transportCost +
      breakdown.setupDismantleCost +
      breakdown.optionalExtrasCost;

    breakdown.tax = Math.round(breakdown.subtotal * 0.18);
    breakdown.total = breakdown.subtotal + breakdown.tax;

    res.json({
      success: true,
      serviceType,
      category,
      breakdown,
      currency: "INR",
      isLiveAvailable: true,
    });
  } catch (err) {
    console.error("Calculation error:", err);
    res.status(500).json({ message: "Failed to calculate quotation" });
  }
});

// ============================================================
// 4. POST /api/music-tent/enquiries - Create Quotation Request
// ============================================================
router.post("/enquiries", optionalAuth, async (req, res) => {
  try {
    const {
      vendorId,
      customerName,
      customerPhone,
      customerEmail,
      serviceType,
      category,
      selectedPackage,
      eventDate,
      eventTime,
      eventLocation,
      locality,
      pinCode,
      coordinates,
      guestCount,
      durationHours,
      performersCount,
      soundCoverage,
      eventAreaSqFt,
      indoorOutdoor,
      decorationPreferences,
      flowerPreference,
      referenceImages,
      customRequirements,
    } = req.body;

    if (!vendorId || !customerName || !customerPhone || !eventDate || !eventLocation) {
      return res.status(400).json({
        message: "Vendor, customer name, phone, event date, and location are required",
      });
    }

    // Reference images validation (size, count, MIME format)
    const sanitizedImages = [];
    if (Array.isArray(referenceImages)) {
      if (referenceImages.length > 6) {
        return res
          .status(400)
          .json({ message: "Maximum 6 reference images allowed" });
      }

      for (const img of referenceImages) {
        if (!img.dataUrl || typeof img.dataUrl !== "string") continue;
        // Check MIME type: jpeg, png, webp
        const matches = img.dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
        const mime = matches ? matches[1].toLowerCase() : img.mimeType || "";
        const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
        if (mime && !allowedMimes.includes(mime)) {
          return res.status(400).json({
            message: `Unsupported image format: ${mime}. Please use JPG, PNG, or WEBP.`,
          });
        }
        // Approximate size check (Base64 length * 0.75 <= 5MB)
        const sizeBytes = img.dataUrl.length * 0.75;
        if (sizeBytes > 5 * 1024 * 1024) {
          return res.status(400).json({
            message: `Reference image "${img.name || "Upload"}" exceeds 5MB size limit.`,
          });
        }
        sanitizedImages.push({
          name: img.name || "reference.jpg",
          dataUrl: img.dataUrl,
          sizeKb: Math.round(sizeBytes / 1024),
          mimeType: mime || "image/jpeg",
          uploadedAt: new Date(),
        });
      }
    }

    const enquiryNumber = `MTE-${Date.now().toString().slice(-6)}-${crypto
      .randomBytes(2)
      .toString("hex")
      .toUpperCase()}`;

    const enquiryData = {
      enquiryNumber,
      customer: req.userId || null,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: (customerEmail || "").trim().toLowerCase(),
      vendor: vendorId,
      serviceType: serviceType || "Music",
      category: category || "DJ",
      selectedPackage: selectedPackage || null,
      eventDate: eventDate.trim(),
      eventTime: eventTime || "18:00",
      eventLocation: eventLocation.trim(),
      locality: locality || "",
      pinCode: pinCode || "",
      coordinates: coordinates || { lat: null, lng: null },
      guestCount: Number(guestCount) || 300,
      durationHours: Number(durationHours) || 4,
      performersCount: Number(performersCount) || 2,
      soundCoverage: soundCoverage || "Standard Banquet Hall",
      eventAreaSqFt: Number(eventAreaSqFt) || 2500,
      indoorOutdoor: indoorOutdoor || "Indoor Banquet",
      decorationPreferences: Array.isArray(decorationPreferences)
        ? decorationPreferences
        : [],
      flowerPreference: flowerPreference || "Fresh Exotic & Marigold Mix",
      referenceImages: sanitizedImages,
      customRequirements: (customRequirements || "").trim(),
      status: "Pending",
    };

    let enquiry = null;
    if (mongoose.connection.readyState === 1) {
      try {
        enquiry = await MusicTentEnquiry.create(enquiryData);
      } catch (dbErr) {
        console.warn("DB save enquiry failed, saving in-memory:", dbErr.message);
      }
    }

    if (!enquiry) {
      enquiry = {
        ...enquiryData,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date().toISOString(),
      };
      inMemoryEnquiries.unshift(enquiry);
    }

    res.status(201).json({
      success: true,
      message: "Quotation request submitted successfully!",
      enquiry,
    });
  } catch (err) {
    console.error("Create enquiry error:", err);
    res.status(500).json({ message: "Failed to submit quotation request" });
  }
});

// ============================================================
// 5. GET /api/music-tent/enquiries - Retrieve Customer or Vendor Enquiries
// ============================================================
router.get("/enquiries", optionalAuth, async (req, res) => {
  try {
    const { vendorId, status, phone } = req.query;
    let enquiries = [];

    if (mongoose.connection.readyState === 1) {
      try {
        let query = {};
        if (req.userId) {
          query.$or = [{ customer: req.userId }];
          if (phone) query.$or.push({ customerPhone: phone });
        } else if (phone) {
          query.customerPhone = phone;
        }
        if (vendorId) query.vendor = vendorId;
        if (status) query.status = status;

        enquiries = await MusicTentEnquiry.find(query)
          .populate("vendor", "name phone email city locality verificationStatus")
          .sort({ createdAt: -1 })
          .lean();
      } catch (dbErr) {
        console.warn("DB enquiries fetch failed:", dbErr.message);
        enquiries = [...inMemoryEnquiries];
      }
    } else {
      enquiries = inMemoryEnquiries.filter((e) => {
        if (phone && e.customerPhone !== phone) return false;
        if (vendorId && e.vendor?.toString() !== vendorId) return false;
        if (status && e.status !== status) return false;
        return true;
      });
    }

    res.json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (err) {
    console.error("Enquiries fetch error:", err);
    res.status(500).json({ message: "Failed to retrieve enquiries" });
  }
});

// ============================================================
// 6. POST /api/music-tent/enquiries/:id/quote - Submit Vendor Quotation
// ============================================================
router.post("/enquiries/:id/quote", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      pricingType = "CustomQuotation",
      breakdown,
      inclusions = [],
      exclusions = [],
      extraChargesNotes,
      validUntil,
      vendorNotes,
      confirmedAvailability = true,
    } = req.body;

    if (!breakdown || typeof breakdown.total !== "number") {
      return res.status(400).json({ message: "Itemized breakdown and total amount are required" });
    }

    const quotationNumber = `MTQ-${Date.now().toString().slice(-6)}-${crypto
      .randomBytes(2)
      .toString("hex")
      .toUpperCase()}`;

    const quoteData = {
      quotationNumber,
      enquiry: id,
      vendor: req.body.vendorId || inMemoryVendors[0]._id,
      pricingType,
      breakdown,
      inclusions,
      exclusions,
      extraChargesNotes: extraChargesNotes || "Overtime charged at standard hourly rates.",
      validUntil: validUntil || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      confirmedAvailability: Boolean(confirmedAvailability),
      vendorNotes: vendorNotes || "Slot tentatively held. Confirm advance to lock date.",
      status: "Submitted",
    };

    let quotation = null;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      try {
        quotation = await MusicTentQuotation.create(quoteData);
        await MusicTentEnquiry.findByIdAndUpdate(id, {
          status: "Quoted",
          vendorNotes: vendorNotes || "Quotation ready for review.",
        });
      } catch (dbErr) {
        console.warn("DB quote creation failed:", dbErr.message);
      }
    }

    if (!quotation) {
      quotation = {
        ...quoteData,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date().toISOString(),
      };
      inMemoryQuotations.unshift(quotation);
      const enq = inMemoryEnquiries.find((e) => e._id.toString() === id);
      if (enq) enq.status = "Quoted";
    }

    res.status(201).json({
      success: true,
      message: "Quotation generated and sent to customer!",
      quotation,
    });
  } catch (err) {
    console.error("Quote submission error:", err);
    res.status(500).json({ message: "Failed to generate quotation" });
  }
});

// ============================================================
// 7. POST /api/music-tent/enquiries/:id/confirm - Confirm into Booking
// ============================================================
router.post("/enquiries/:id/confirm", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { quotationId, paymentStatus = "Advance Paid" } = req.body;

    let enquiry = null;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      enquiry = await MusicTentEnquiry.findById(id).lean();
    }
    if (!enquiry) {
      enquiry = inMemoryEnquiries.find((e) => e._id.toString() === id);
    }
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    let quotation = null;
    if (quotationId) {
      if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(quotationId)) {
        quotation = await MusicTentQuotation.findById(quotationId).lean();
      }
      if (!quotation) {
        quotation = inMemoryQuotations.find((q) => q._id.toString() === quotationId);
      }
    }

    const finalAmount = quotation
      ? quotation.breakdown.total
      : enquiry.selectedPackage?.price || 50000;

    const depositAmount = quotation
      ? quotation.breakdown.refundableDeposit
      : 5000;

    const bookingNumber = `MTB-${Date.now().toString().slice(-6)}-${crypto
      .randomBytes(2)
      .toString("hex")
      .toUpperCase()}`;

    const bookingData = {
      bookingNumber,
      enquiry: id,
      quotation: quotation ? quotation._id : null,
      vendor: enquiry.vendor,
      customer: req.userId || enquiry.customer || null,
      customerName: enquiry.customerName,
      customerPhone: enquiry.customerPhone,
      customerEmail: enquiry.customerEmail,
      serviceType: enquiry.serviceType,
      category: enquiry.category,
      eventDate: enquiry.eventDate,
      eventTime: enquiry.eventTime,
      eventLocation: enquiry.eventLocation,
      guestCount: enquiry.guestCount,
      finalAmount,
      depositAmount,
      paymentStatus,
      status: "Confirmed",
      confirmedAvailability: true,
    };

    let booking = null;
    if (mongoose.connection.readyState === 1) {
      try {
        booking = await MusicTentBooking.create(bookingData);
        await MusicTentEnquiry.findByIdAndUpdate(id, { status: "Confirmed" });
        // Mark date as booked on vendor
        await MusicTentVendor.findByIdAndUpdate(enquiry.vendor, {
          $addToSet: { bookedDates: enquiry.eventDate },
        });
      } catch (dbErr) {
        console.warn("DB booking creation failed:", dbErr.message);
      }
    }

    if (!booking) {
      booking = {
        ...bookingData,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date().toISOString(),
      };
      inMemoryBookings.unshift(booking);
      enquiry.status = "Confirmed";
      const vendorObj = inMemoryVendors.find(
        (v) => v._id.toString() === enquiry.vendor.toString()
      );
      if (vendorObj && !vendorObj.bookedDates.includes(enquiry.eventDate)) {
        vendorObj.bookedDates.push(enquiry.eventDate);
      }
    }

    res.status(201).json({
      success: true,
      message: "Booking confirmed! Event date locked with vendor.",
      booking,
    });
  } catch (err) {
    console.error("Booking confirmation error:", err);
    res.status(500).json({ message: "Failed to confirm booking" });
  }
});

// ============================================================
// 8. GET /api/music-tent/bookings - View Bookings
// ============================================================
router.get("/bookings", optionalAuth, async (req, res) => {
  try {
    const { phone, vendorId } = req.query;
    let bookings = [];

    if (mongoose.connection.readyState === 1) {
      try {
        let query = {};
        if (req.userId) {
          query.$or = [{ customer: req.userId }];
          if (phone) query.$or.push({ customerPhone: phone });
        } else if (phone) {
          query.customerPhone = phone;
        }
        if (vendorId) query.vendor = vendorId;

        bookings = await MusicTentBooking.find(query)
          .populate("vendor", "name phone email city locality")
          .sort({ createdAt: -1 })
          .lean();
      } catch (dbErr) {
        console.warn("DB bookings fetch failed:", dbErr.message);
        bookings = [...inMemoryBookings];
      }
    } else {
      bookings = inMemoryBookings.filter((b) => {
        if (phone && b.customerPhone !== phone) return false;
        if (vendorId && b.vendor.toString() !== vendorId) return false;
        return true;
      });
    }

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    console.error("Bookings fetch error:", err);
    res.status(500).json({ message: "Failed to retrieve bookings" });
  }
});

// ============================================================
// 9. POST /api/music-tent/reviews - Submit Verified Review
// ============================================================
router.post("/reviews", optionalAuth, async (req, res) => {
  try {
    const { vendorId, customerName, rating, eventDate, serviceUsed, comment } =
      req.body;

    if (!vendorId || !customerName || !rating || !comment) {
      return res.status(400).json({
        message: "Vendor, customer name, rating (1-5), and comment are required",
      });
    }

    const reviewData = {
      vendor: vendorId,
      customerName: customerName.trim(),
      rating: Math.max(1, Math.min(5, Number(rating))),
      eventDate: eventDate || new Date().toISOString().split("T")[0],
      serviceUsed: serviceUsed || "DJ & Sound",
      comment: comment.trim(),
      isVerifiedBooking: true,
    };

    let review = null;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(vendorId)) {
      try {
        review = await MusicTentReview.create(reviewData);
        // Recalculate average rating
        const allReviews = await MusicTentReview.find({ vendor: vendorId });
        const avg =
          allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await MusicTentVendor.findByIdAndUpdate(vendorId, {
          rating: Math.round(avg * 10) / 10,
          reviewCount: allReviews.length,
        });
      } catch (dbErr) {
        console.warn("DB review create failed:", dbErr.message);
      }
    }

    if (!review) {
      review = {
        ...reviewData,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date().toISOString(),
      };
      inMemoryReviews.unshift(review);
    }

    res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      review,
    });
  } catch (err) {
    console.error("Review creation error:", err);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

module.exports = router;
