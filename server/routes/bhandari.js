const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const CookingTeamVendor = require("../models/CookingTeamVendor");
const CookingTeamEnquiry = require("../models/CookingTeamEnquiry");
const CookingTeamQuotation = require("../models/CookingTeamQuotation");
const CookingTeamBooking = require("../models/CookingTeamBooking");
const CookingTeamReview = require("../models/CookingTeamReview");

const router = express.Router();

// ==========================================
// AUTHENTICATION MIDDLEWARES
// ==========================================
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Login required to access cooking services" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.userId || payload.id || payload._id || payload.sub;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    req.userId = userId;
    next();
  } catch {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme === "Bearer" && token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = payload.userId || payload.id || payload._id || payload.sub;
    } catch {
      // ignore
    }
  }
  next();
}

// ==========================================
// 1. VENDOR DISCOVERY & SEARCH
// ==========================================
router.get("/vendors", optionalAuth, async (req, res) => {
  try {
    const {
      search,
      city,
      cuisine,
      serviceType,
      teamType,
      guests,
      maxBudget,
      date,
      verifiedOnly,
      sort,
    } = req.query;

    const filter = {};

    // Only active/verified vendors by default unless user is looking at all
    if (verifiedOnly === "true") {
      filter.verificationStatus = "Verified";
    } else {
      filter.verificationStatus = { $in: ["Verified", "Submitted"] };
    }

    if (city && city.trim()) {
      filter.city = new RegExp(city.trim(), "i");
    }

    if (cuisine && cuisine.trim()) {
      filter.cuisineSpecializations = cuisine.trim();
    }

    if (serviceType && serviceType.trim()) {
      filter.serviceTypes = serviceType.trim();
    }

    if (teamType && teamType.trim()) {
      filter.teamType = teamType.trim();
    }

    if (guests && Number(guests) > 0) {
      filter["guestCapacity.max"] = { $gte: Number(guests) };
    }

    if (maxBudget && Number(maxBudget) > 0) {
      filter["pricing.baseDailyRate"] = { $lte: Number(maxBudget) };
    }

    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      filter.bookedDates = { $ne: date };
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { teamName: regex },
        { ownerName: regex },
        { city: regex },
        { description: regex },
        { specialtyDishes: regex },
      ];
    }

    let sortOptions = { ratingAverage: -1, reviewCount: -1 };
    if (sort === "price_asc") sortOptions = { "pricing.baseDailyRate": 1 };
    if (sort === "price_desc") sortOptions = { "pricing.baseDailyRate": -1 };
    if (sort === "experience") sortOptions = { experienceYears: -1 };

    const vendors = await CookingTeamVendor.find(filter)
      .sort(sortOptions)
      .lean();

    res.json({
      count: vendors.length,
      vendors,
    });
  } catch (err) {
    console.error("Vendor search error:", err);
    res.status(500).json({ message: "Failed to search cooking teams" });
  }
});

// GET Single Vendor Profile + Reviews
router.get("/vendors/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    const vendor = await CookingTeamVendor.findById(req.params.id).lean();
    if (!vendor) {
      return res.status(404).json({ message: "Cooking team vendor not found" });
    }

    const reviews = await CookingTeamReview.find({ vendor: req.params.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({
      vendor,
      reviews,
    });
  } catch (err) {
    console.error("Vendor details error:", err);
    res.status(500).json({ message: "Failed to load vendor profile" });
  }
});

// Register / Onboard Vendor
router.post("/vendors", requireAuth, async (req, res) => {
  try {
    const {
      teamName,
      ownerName,
      teamType,
      publicPhone,
      publicEmail,
      city,
      serviceAreas,
      description,
      experienceYears,
      guestCapacity,
      cookCount,
      helperCount,
      cuisineSpecializations,
      serviceTypes,
      pricing,
      equipmentSupplied,
      ingredientArrangements,
      specialtyDishes,
    } = req.body;

    if (!teamName || !ownerName || !city) {
      return res.status(400).json({ message: "Team name, owner name and city are required." });
    }

    const newVendor = await CookingTeamVendor.create({
      user: req.userId,
      teamName: String(teamName).trim(),
      ownerName: String(ownerName).trim(),
      teamType: teamType || "Bhandari",
      publicPhone: publicPhone || "",
      publicEmail: publicEmail || "",
      city: String(city).trim(),
      serviceAreas: Array.isArray(serviceAreas) ? serviceAreas : [city],
      description: description || "",
      experienceYears: Number(experienceYears) || 5,
      guestCapacity: guestCapacity || { min: 50, max: 2500 },
      cookCount: Number(cookCount) || 4,
      helperCount: Number(helperCount) || 6,
      cuisineSpecializations: Array.isArray(cuisineSpecializations) && cuisineSpecializations.length > 0
        ? cuisineSpecializations
        : ["North Indian"],
      serviceTypes: Array.isArray(serviceTypes) && serviceTypes.length > 0
        ? serviceTypes
        : ["Labour-only cooking team"],
      pricing: pricing || { baseDailyRate: 15000, minBookingAmount: 10000 },
      equipmentSupplied: Array.isArray(equipmentSupplied) ? equipmentSupplied : [],
      ingredientArrangements: ingredientArrangements || "Customer supplies raw ingredients as per procurement list.",
      specialtyDishes: Array.isArray(specialtyDishes) ? specialtyDishes : [],
      verificationStatus: "Verified", // Instant active for demo/production testing
    });

    res.status(201).json({
      message: "Cooking team registered successfully!",
      vendor: newVendor,
    });
  } catch (err) {
    console.error("Vendor onboarding error:", err);
    res.status(500).json({ message: "Failed to register cooking team." });
  }
});

// Update Vendor Profile
router.patch("/vendors/:id", requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    const vendor = await CookingTeamVendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Allow owner or admin
    if (vendor.user && vendor.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized to edit this vendor." });
    }

    const allowedUpdates = [
      "teamName",
      "ownerName",
      "teamType",
      "publicPhone",
      "publicEmail",
      "city",
      "serviceAreas",
      "description",
      "experienceYears",
      "guestCapacity",
      "cookCount",
      "helperCount",
      "cuisineSpecializations",
      "serviceTypes",
      "pricing",
      "equipmentSupplied",
      "ingredientArrangements",
      "specialtyDishes",
      "cancellationPolicy",
      "advancePercentageRequired",
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        vendor[field] = req.body[field];
      }
    });

    await vendor.save();
    res.json({ message: "Vendor profile updated successfully", vendor });
  } catch (err) {
    console.error("Vendor update error:", err);
    res.status(500).json({ message: "Failed to update vendor." });
  }
});

// ==========================================
// 2. ENQUIRY CREATION & MANAGEMENT
// ==========================================
router.post("/enquiries", requireAuth, async (req, res) => {
  try {
    const {
      vendorId,
      customerName,
      customerPhone,
      customerEmail,
      eventType,
      eventDate,
      eventEndDate,
      eventLocation,
      city,
      guestCount,
      cuisines,
      serviceType,
      requestedCooks,
      requestedHelpers,
      budget,
      ingredientResponsibilities,
      equipmentResponsibilities,
      specialRequirements,
    } = req.body;

    if (!vendorId || !mongoose.isValidObjectId(vendorId)) {
      return res.status(400).json({ message: "Valid cooking team vendor is required." });
    }

    if (!eventDate || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
      return res.status(400).json({ message: "Valid event date (YYYY-MM-DD) is required." });
    }

    const vendor = await CookingTeamVendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Selected vendor not found." });
    }

    // Availability check
    if (vendor.bookedDates && vendor.bookedDates.includes(eventDate)) {
      return res.status(400).json({
        message: `Vendor is already booked on ${eventDate}. Please choose another date or vendor.`,
      });
    }

    // Capacity check
    const numGuests = Number(guestCount) || 100;
    if (vendor.guestCapacity && vendor.guestCapacity.max && numGuests > vendor.guestCapacity.max) {
      return res.status(400).json({
        message: `Guest count (${numGuests}) exceeds vendor's declared maximum capacity of ${vendor.guestCapacity.max}.`,
      });
    }

    const enquiry = await CookingTeamEnquiry.create({
      customer: req.userId,
      vendor: vendorId,
      customerName: customerName || "",
      customerPhone: customerPhone || "",
      customerEmail: customerEmail || "",
      eventType: eventType || "Wedding",
      eventDate,
      eventEndDate: eventEndDate || "",
      eventLocation: eventLocation || "",
      city: city || vendor.city,
      guestCount: numGuests,
      cuisines: Array.isArray(cuisines) ? cuisines : vendor.cuisineSpecializations.slice(0, 2),
      serviceType: serviceType || "Labour-only cooking team",
      requestedCooks: Number(requestedCooks) || vendor.cookCount,
      requestedHelpers: Number(requestedHelpers) || vendor.helperCount,
      budget: Number(budget) || 0,
      ingredientResponsibilities: ingredientResponsibilities || {},
      equipmentResponsibilities: equipmentResponsibilities || {},
      specialRequirements: specialRequirements || "",
      status: "Submitted",
    });

    res.status(201).json({
      message: "Enquiry submitted successfully to cooking team!",
      enquiry,
    });
  } catch (err) {
    console.error("Enquiry creation error:", err);
    res.status(500).json({ message: "Failed to submit enquiry." });
  }
});

// GET My Customer Enquiries
router.get("/enquiries/my", requireAuth, async (req, res) => {
  try {
    const enquiries = await CookingTeamEnquiry.find({ customer: req.userId })
      .populate("vendor")
      .sort({ createdAt: -1 })
      .lean();

    res.json(enquiries);
  } catch (err) {
    console.error("Customer enquiries fetch error:", err);
    res.status(500).json({ message: "Failed to load enquiries." });
  }
});

// GET Vendor Incoming Enquiries
router.get("/enquiries/vendor", requireAuth, async (req, res) => {
  try {
    const myVendors = await CookingTeamVendor.find({ user: req.userId }).select("_id");
    const vendorIds = myVendors.map(v => v._id);

    // If user has no vendor registered, also allow fetching by vendorId query if provided
    let query = {};
    if (vendorIds.length > 0) {
      query = { vendor: { $in: vendorIds } };
    } else if (req.query.vendorId && mongoose.isValidObjectId(req.query.vendorId)) {
      query = { vendor: req.query.vendorId };
    } else {
      // Return recent enquiries for demo/testing
      query = {};
    }

    const enquiries = await CookingTeamEnquiry.find(query)
      .populate("vendor")
      .populate("customer", "username email fullName phone")
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    res.json(enquiries);
  } catch (err) {
    console.error("Vendor enquiries fetch error:", err);
    res.status(500).json({ message: "Failed to load vendor enquiries." });
  }
});

// ==========================================
// 3. QUOTATION BUILDER & CALCULATION
// ==========================================
router.post("/enquiries/:id/quotations", requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid enquiry ID" });
    }

    const enquiry = await CookingTeamEnquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found." });
    }

    const {
      lineItems,
      equipmentCharges,
      transportCharges,
      discountAmount,
      taxPercentage,
      advancePercentage,
      validUntil,
      terms,
      staffingProposed,
    } = req.body;

    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return res.status(400).json({ message: "At least one quotation line item is required." });
    }

    // SERVER-SIDE CALCULATION TO PREVENT TAMPERING
    let subtotal = 0;
    const computedLineItems = lineItems.map(item => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const rate = Math.max(0, Number(item.rate) || 0);
      const amount = Math.round(qty * rate);
      subtotal += amount;

      return {
        description: String(item.description || "Cooking service").trim(),
        category: item.category || "Main Cooks Labour",
        quantity: qty,
        unit: item.unit || "Day",
        rate: rate,
        amount: amount,
        notes: item.notes || "",
      };
    });

    const eqCharges = Math.max(0, Number(equipmentCharges) || 0);
    const trCharges = Math.max(0, Number(transportCharges) || 0);
    const discAmount = Math.max(0, Number(discountAmount) || 0);
    const taxRate = Math.min(28, Math.max(0, Number(taxPercentage) || 0));

    const taxableBase = Math.max(0, subtotal + eqCharges + trCharges - discAmount);
    const taxAmount = Math.round(taxableBase * (taxRate / 100));
    const totalAmount = taxableBase + taxAmount;

    const advPct = Math.min(100, Math.max(10, Number(advancePercentage) || 25));
    const advanceAmount = Math.round(totalAmount * (advPct / 100));
    const balanceAmount = totalAmount - advanceAmount;

    const quotation = await CookingTeamQuotation.create({
      enquiry: enquiry._id,
      vendor: enquiry.vendor,
      customer: enquiry.customer,
      lineItems: computedLineItems,
      subtotal,
      equipmentCharges: eqCharges,
      transportCharges: trCharges,
      discountAmount: discAmount,
      taxPercentage: taxRate,
      taxAmount,
      totalAmount,
      advancePercentage: advPct,
      advanceAmount,
      balanceAmount,
      validUntil: validUntil || "",
      terms: terms || "Payment: 50% advance before event date, remaining balance on event day.",
      staffingProposed: staffingProposed || {
        cooks: enquiry.requestedCooks || 4,
        helpers: enquiry.requestedHelpers || 6,
        halwaiSpecialists: 2,
      },
      status: "Active",
    });

    // Update enquiry status
    enquiry.status = "Quotation Received";
    await enquiry.save();

    res.status(201).json({
      message: "Itemized quotation created successfully!",
      quotation,
    });
  } catch (err) {
    console.error("Quotation creation error:", err);
    res.status(500).json({ message: "Failed to create quotation." });
  }
});

// GET Quotations for an enquiry
router.get("/enquiries/:id/quotations", requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid enquiry ID" });
    }

    const quotations = await CookingTeamQuotation.find({ enquiry: req.params.id })
      .populate("vendor")
      .sort({ createdAt: -1 })
      .lean();

    res.json(quotations);
  } catch (err) {
    console.error("Fetch quotations error:", err);
    res.status(500).json({ message: "Failed to load quotations." });
  }
});

// ==========================================
// 4. QUOTATION ACCEPTANCE & BOOKING WORKFLOW
// ==========================================
router.post("/quotations/:id/accept", requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid quotation ID" });
    }

    const quotation = await CookingTeamQuotation.findById(req.params.id).populate("enquiry");
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    if (quotation.status !== "Active") {
      return res.status(400).json({ message: `Quotation is already ${quotation.status}.` });
    }

    const enquiry = quotation.enquiry;
    if (!enquiry) {
      return res.status(404).json({ message: "Associated enquiry not found." });
    }

    const vendor = await CookingTeamVendor.findById(quotation.vendor);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    // CONCURRENCY & DATE COLLISION CHECK
    if (vendor.bookedDates && vendor.bookedDates.includes(enquiry.eventDate)) {
      return res.status(409).json({
        message: `Vendor is no longer available on ${enquiry.eventDate}. The date has been reserved by another client.`,
      });
    }

    // Check if booking already exists for this enquiry
    const existingBooking = await CookingTeamBooking.findOne({ enquiry: enquiry._id });
    if (existingBooking) {
      return res.status(400).json({ message: "A booking already exists for this enquiry." });
    }

    // Create confirmed booking
    const booking = await CookingTeamBooking.create({
      enquiry: enquiry._id,
      quotation: quotation._id,
      customer: quotation.customer,
      vendor: quotation.vendor,
      eventDate: enquiry.eventDate,
      eventEndDate: enquiry.eventEndDate || "",
      guestCount: enquiry.guestCount,
      agreedAmount: quotation.totalAmount,
      advancePaid: quotation.advanceAmount,
      paymentStatus: "Advance Paid",
      bookingStatus: "Confirmed",
      quotationSnapshot: quotation.toObject(),
    });

    // Mark quotation accepted and mark date as booked
    quotation.status = "Accepted";
    await quotation.save();

    // Supersede other quotes for the same enquiry
    await CookingTeamQuotation.updateMany(
      { enquiry: enquiry._id, _id: { $ne: quotation._id } },
      { $set: { status: "Superseded" } }
    );

    enquiry.status = "Accepted";
    await enquiry.save();

    // Add date to vendor booked dates
    if (!vendor.bookedDates.includes(enquiry.eventDate)) {
      vendor.bookedDates.push(enquiry.eventDate);
      await vendor.save();
    }

    res.status(201).json({
      message: "Cooking team booking confirmed successfully!",
      booking,
    });
  } catch (err) {
    console.error("Booking acceptance error:", err);
    res.status(500).json({ message: "Failed to confirm booking." });
  }
});

// GET My Customer Bookings
router.get("/bookings/my", requireAuth, async (req, res) => {
  try {
    const bookings = await CookingTeamBooking.find({ customer: req.userId })
      .populate("vendor")
      .populate("quotation")
      .sort({ eventDate: 1, createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    console.error("Fetch customer bookings error:", err);
    res.status(500).json({ message: "Failed to load bookings." });
  }
});

// GET Vendor Bookings
router.get("/bookings/vendor", requireAuth, async (req, res) => {
  try {
    const myVendors = await CookingTeamVendor.find({ user: req.userId }).select("_id");
    const vendorIds = myVendors.map(v => v._id);

    let query = {};
    if (vendorIds.length > 0) {
      query = { vendor: { $in: vendorIds } };
    } else if (req.query.vendorId && mongoose.isValidObjectId(req.query.vendorId)) {
      query = { vendor: req.query.vendorId };
    }

    const bookings = await CookingTeamBooking.find(query)
      .populate("vendor")
      .populate("customer", "username email fullName phone")
      .populate("quotation")
      .sort({ eventDate: 1, createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    console.error("Fetch vendor bookings error:", err);
    res.status(500).json({ message: "Failed to load vendor bookings." });
  }
});

// Update Booking Status (e.g. Completed, Cancelled)
router.patch("/bookings/:id/status", requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const { status, reason } = req.body;
    const allowed = [
      "Pending confirmation",
      "Confirmed",
      "In progress",
      "Completed",
      "Cancelled",
      "Disputed",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid booking status." });
    }

    const booking = await CookingTeamBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.bookingStatus = status;

    if (status === "Cancelled") {
      booking.cancellationDetails = {
        cancelledBy: req.userId,
        reason: reason || "Cancelled by user",
        cancelledAt: new Date(),
        refundAmount: 0,
      };

      // Free up vendor booked date
      await CookingTeamVendor.findByIdAndUpdate(booking.vendor, {
        $pull: { bookedDates: booking.eventDate },
      });
    }

    await booking.save();
    res.json({ message: `Booking status updated to ${status}`, booking });
  } catch (err) {
    console.error("Booking status update error:", err);
    res.status(500).json({ message: "Failed to update booking status." });
  }
});

// ==========================================
// 5. REVIEWS & RATINGS
// ==========================================
router.post("/bookings/:id/reviews", requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await CookingTeamBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.customer.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the client who booked can submit a review." });
    }

    if (booking.bookingStatus !== "Completed" && booking.bookingStatus !== "Confirmed") {
      return res.status(400).json({ message: "Reviews can only be submitted for completed or confirmed bookings." });
    }

    const existingReview = await CookingTeamReview.findOne({ booking: booking._id });
    if (existingReview) {
      return res.status(409).json({ message: "A review has already been submitted for this booking." });
    }

    const { rating, reviewText, dishHighlights } = req.body;
    const numRating = Math.min(5, Math.max(1, Number(rating) || 5));

    const review = await CookingTeamReview.create({
      booking: booking._id,
      customer: req.userId,
      vendor: booking.vendor,
      customerName: req.body.customerName || "Milap Verified Couple",
      rating: numRating,
      reviewText: reviewText ? String(reviewText).trim() : "Excellent authentic taste and traditional discipline!",
      dishHighlights: Array.isArray(dishHighlights) ? dishHighlights : [],
    });

    // Recalculate vendor rating
    const allReviews = await CookingTeamReview.find({ vendor: booking.vendor });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await CookingTeamVendor.findByIdAndUpdate(booking.vendor, {
      ratingAverage: Math.round(avg * 10) / 10,
      reviewCount: allReviews.length,
    });

    res.status(201).json({
      message: "Review submitted successfully! Thank you for rating the cooking team.",
      review,
    });
  } catch (err) {
    console.error("Review creation error:", err);
    res.status(500).json({ message: "Failed to submit review." });
  }
});

// ==========================================
// 6. ADMIN VERIFICATION & DASHBOARD STATS
// ==========================================
router.get("/admin/stats", async (req, res) => {
  try {
    const totalVendors = await CookingTeamVendor.countDocuments();
    const verifiedVendors = await CookingTeamVendor.countDocuments({ verificationStatus: "Verified" });
    const pendingVendors = await CookingTeamVendor.countDocuments({ verificationStatus: "Submitted" });
    const activeEnquiries = await CookingTeamEnquiry.countDocuments({ status: { $in: ["Submitted", "Quotation Received"] } });
    const confirmedBookings = await CookingTeamBooking.countDocuments({ bookingStatus: { $in: ["Confirmed", "In progress"] } });
    const completedBookings = await CookingTeamBooking.countDocuments({ bookingStatus: "Completed" });

    res.json({
      totalVendors,
      verifiedVendors,
      pendingVendors,
      activeEnquiries,
      confirmedBookings,
      completedBookings,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Failed to load admin stats." });
  }
});

router.patch("/admin/vendors/:id/verify", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    const { status } = req.body;
    if (!["Verified", "Suspended", "Submitted", "Draft"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const vendor = await CookingTeamVendor.findByIdAndUpdate(
      req.params.id,
      { $set: { verificationStatus: status } },
      { new: true }
    );

    if (!vendor) return res.status(404).json({ message: "Vendor not found." });

    res.json({ message: `Vendor verification status set to ${status}`, vendor });
  } catch (err) {
    console.error("Admin verify error:", err);
    res.status(500).json({ message: "Failed to update verification status." });
  }
});

module.exports = router;
