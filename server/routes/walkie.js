const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const WalkieVendor = require("../models/WalkieVendor");
const WalkieEquipment = require("../models/WalkieEquipment");
const WalkieEnquiry = require("../models/WalkieEnquiry");
const WalkieQuotation = require("../models/WalkieQuotation");
const WalkieBooking = require("../models/WalkieBooking");
const WalkieAssignment = require("../models/WalkieAssignment");
const WalkieReview = require("../models/WalkieReview");

const router = express.Router();

// ==========================================
// AUTHENTICATION MIDDLEWARES
// ==========================================
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Login required to access radio communication services" });
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

// Generate secure unpredictable random token
function generateSecureToken(prefix) {
  return `${prefix}-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
}

// ==========================================
// 1. EQUIPMENT DISCOVERY & SEARCH
// ==========================================
router.get("/equipment", async (req, res) => {
  try {
    const {
      city,
      category,
      radioType,
      brand,
      minPower,
      search,
      verifiedOnly,
      maxRate,
    } = req.query;

    let vendorFilter = { isAvailable: true };
    if (city && city.trim()) {
      vendorFilter.city = new RegExp(city.trim(), "i");
    }
    if (verifiedOnly === "true") {
      vendorFilter.verificationStatus = "Verified";
    }

    const matchedVendors = await WalkieVendor.find(vendorFilter).select("_id");
    const vendorIds = matchedVendors.map((v) => v._id);

    let query = {
      isAvailable: true,
      vendor: { $in: vendorIds },
    };

    if (category && category !== "All") {
      query.category = category;
    }
    if (radioType && radioType !== "All") {
      query.radioType = radioType;
    }
    if (brand && brand !== "All") {
      query.brand = new RegExp(brand, "i");
    }
    if (minPower) {
      query.rfPowerWatts = { $gte: Number(minPower) };
    }
    if (maxRate) {
      query.dailyRentalRate = { $lte: Number(maxRate) };
    }
    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { name: new RegExp(s, "i") },
        { brand: new RegExp(s, "i") },
        { modelNumber: new RegExp(s, "i") },
        { description: new RegExp(s, "i") },
      ];
    }

    const equipmentList = await WalkieEquipment.find(query)
      .populate("vendor", "companyName contactPerson phone city serviceAreas verificationStatus rating reviewCount wpcLicenseStatus")
      .sort({ dailyRentalRate: 1 })
      .lean();

    res.json({
      count: equipmentList.length,
      equipment: equipmentList.map((item) => ({
        ...item,
        effectiveAvailableStock: Math.max(
          0,
          (item.totalStock || 0) - ((item.reservedStock || 0) + (item.dispatchedStock || 0) + (item.maintenanceStock || 0))
        ),
      })),
    });
  } catch (err) {
    console.error("Fetch equipment error:", err);
    res.status(500).json({ message: "Failed to search equipment." });
  }
});

// Single Equipment Details
router.get("/equipment/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid equipment ID." });
    }

    const item = await WalkieEquipment.findById(req.params.id)
      .populate("vendor")
      .lean();

    if (!item) {
      return res.status(404).json({ message: "Equipment model not found." });
    }

    const effectiveAvailableStock = Math.max(
      0,
      (item.totalStock || 0) - ((item.reservedStock || 0) + (item.dispatchedStock || 0) + (item.maintenanceStock || 0))
    );

    res.json({ ...item, effectiveAvailableStock });
  } catch (err) {
    console.error("Fetch single equipment error:", err);
    res.status(500).json({ message: "Failed to load equipment details." });
  }
});

// ==========================================
// 2. VENDORS DIRECTORY & PROFILES
// ==========================================
router.get("/vendors", async (req, res) => {
  try {
    const { city, verifiedOnly, search } = req.query;
    let query = { isAvailable: true };

    if (city && city.trim()) {
      query.city = new RegExp(city.trim(), "i");
    }
    if (verifiedOnly === "true") {
      query.verificationStatus = "Verified";
    }
    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { companyName: new RegExp(s, "i") },
        { contactPerson: new RegExp(s, "i") },
        { city: new RegExp(s, "i") },
        { description: new RegExp(s, "i") },
      ];
    }

    const vendors = await WalkieVendor.find(query)
      .sort({ rating: -1, reviewCount: -1 })
      .lean();

    res.json({ count: vendors.length, vendors });
  } catch (err) {
    console.error("Fetch vendors error:", err);
    res.status(500).json({ message: "Failed to load radio rental vendors." });
  }
});

router.get("/vendors/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid vendor ID." });
    }

    const vendor = await WalkieVendor.findById(req.params.id).lean();
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    const equipment = await WalkieEquipment.find({ vendor: vendor._id, isAvailable: true }).lean();
    const reviews = await WalkieReview.find({ vendor: vendor._id })
      .populate("customer", "fullName username")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      vendor,
      equipment,
      reviews,
    });
  } catch (err) {
    console.error("Fetch vendor details error:", err);
    res.status(500).json({ message: "Failed to load vendor details." });
  }
});

// Onboard / Register New Walkie Vendor
router.post("/vendor/onboard", requireAuth, async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      phone,
      email,
      city,
      serviceAreas,
      address,
      experienceYears,
      wpcLicenseStatus,
      pricingDefaults,
      description,
    } = req.body || {};

    if (!companyName || !contactPerson || !phone || !city) {
      return res.status(400).json({ message: "Company name, contact person, phone and city are required." });
    }

    const newVendor = await WalkieVendor.create({
      user: req.userId,
      companyName: String(companyName).trim(),
      contactPerson: String(contactPerson).trim(),
      phone: String(phone).trim(),
      email: email || "",
      city: String(city).trim(),
      serviceAreas: Array.isArray(serviceAreas) && serviceAreas.length > 0 ? serviceAreas : [city],
      address: address || "",
      experienceYears: Number(experienceYears) || 5,
      wpcLicenseStatus: wpcLicenseStatus || "WPC License-Free PMR446 Standard Certified",
      pricingDefaults: pricingDefaults || {
        baseDailyPerRadio: 250,
        headsetDailyRate: 40,
        batteryDailyRate: 50,
        chargerDailyRate: 100,
        deliveryFee: 500,
        setupFee: 1500,
      },
      description: description || "Professional Event Communication & Two-Way Radio Fleet Rentals.",
      verificationStatus: "Verified",
    });

    res.status(201).json({
      message: "Walkie-Talkie rental company registered successfully!",
      vendor: newVendor,
    });
  } catch (err) {
    console.error("Vendor onboarding error:", err);
    res.status(500).json({ message: "Failed to register rental company." });
  }
});

// Add Equipment Model
router.post("/vendor/equipment", requireAuth, async (req, res) => {
  try {
    const {
      vendorId,
      name,
      brand,
      modelNumber,
      category,
      radioType,
      frequencyBand,
      rfPowerWatts,
      channelCapacity,
      batteryType,
      operatingRangeEstimate,
      compatibleAccessories,
      totalStock,
      dailyRentalRate,
      replacementCost,
      depositPerUnit,
      description,
    } = req.body || {};

    let targetVendorId = vendorId;
    if (!targetVendorId) {
      const myVendor = await WalkieVendor.findOne({ user: req.userId });
      if (!myVendor) {
        return res.status(400).json({ message: "No registered vendor profile found for this account." });
      }
      targetVendorId = myVendor._id;
    }

    if (!name || !brand || !modelNumber || !category || !dailyRentalRate) {
      return res.status(400).json({ message: "Name, brand, model, category, and daily rental rate are required." });
    }

    const equipment = await WalkieEquipment.create({
      vendor: targetVendorId,
      name: String(name).trim(),
      brand: String(brand).trim(),
      modelNumber: String(modelNumber).trim(),
      category,
      radioType: radioType || "Digital DMR",
      frequencyBand: frequencyBand || "UHF (400-470 MHz) / PMR446",
      rfPowerWatts: Number(rfPowerWatts) || 4,
      channelCapacity: Number(channelCapacity) || 16,
      batteryType: batteryType || "Li-ion 2200mAh (Up to 18 Hours)",
      operatingRangeEstimate: operatingRangeEstimate || "1.5 - 3.5 km line-of-sight",
      compatibleAccessories: Array.isArray(compatibleAccessories) ? compatibleAccessories : ["Acoustic Tube Earpiece"],
      totalStock: Number(totalStock) || 20,
      dailyRentalRate: Number(dailyRentalRate),
      replacementCost: Number(replacementCost) || 8000,
      depositPerUnit: Number(depositPerUnit) || 500,
      description: description || "",
    });

    res.status(201).json({ message: "Equipment added to inventory successfully!", equipment });
  } catch (err) {
    console.error("Add equipment error:", err);
    res.status(500).json({ message: "Failed to add equipment to inventory." });
  }
});

// ==========================================
// 3. COST ESTIMATOR API (Server-side Math)
// ==========================================
router.post("/cost-estimate", (req, res) => {
  try {
    const {
      radioCount = 10,
      durationDays = 2,
      radioDailyRate = 250,
      headsetCount = 10,
      headsetDailyRate = 40,
      batteryCount = 5,
      batteryDailyRate = 50,
      chargerCount = 2,
      chargerDailyRate = 100,
      deliveryFee = 500,
      setupTechnicianFee = 0,
      discount = 0,
      depositPerRadio = 500,
    } = req.body || {};

    const numRadios = Math.max(1, Number(radioCount) || 1);
    const days = Math.max(1, Number(durationDays) || 1);

    const radioCost = numRadios * days * Math.max(0, Number(radioDailyRate) || 0);
    const headsetCost = Math.max(0, Number(headsetCount) || 0) * days * Math.max(0, Number(headsetDailyRate) || 0);
    const batteryCost = Math.max(0, Number(batteryCount) || 0) * days * Math.max(0, Number(batteryDailyRate) || 0);
    const chargerCost = Math.max(0, Number(chargerCount) || 0) * days * Math.max(0, Number(chargerDailyRate) || 0);

    const equipmentSubtotal = radioCost + headsetCost + batteryCost + chargerCost;
    const logistics = Math.max(0, Number(deliveryFee) || 0) + Math.max(0, Number(setupTechnicianFee) || 0);
    const disc = Math.max(0, Number(discount) || 0);

    const taxableAmount = Math.max(0, equipmentSubtotal + logistics - disc);
    const taxRate = 18; // 18% GST standard on equipment hire
    const taxAmount = Math.round(taxableAmount * (taxRate / 100));
    const grandRentalTotal = taxableAmount + taxAmount;

    // Refundable deposit
    const refundableDeposit = numRadios * Math.max(0, Number(depositPerRadio) || 500);

    // Total payable before event dispatch
    const advancePercentage = 30;
    const advanceRequired = Math.round(grandRentalTotal * (advancePercentage / 100));
    const balanceDue = grandRentalTotal - advanceRequired;
    const totalPayableWithDeposit = grandRentalTotal + refundableDeposit;

    res.json({
      breakdown: {
        radioCost,
        headsetCost,
        batteryCost,
        chargerCost,
        equipmentSubtotal,
        deliveryFee: Math.max(0, Number(deliveryFee) || 0),
        setupTechnicianFee: Math.max(0, Number(setupTechnicianFee) || 0),
        discount: disc,
        taxableAmount,
        taxRate,
        taxAmount,
        grandRentalTotal,
        refundableDeposit,
        advancePercentage,
        advanceRequired,
        balanceDue,
        totalPayableWithDeposit,
      },
    });
  } catch (err) {
    console.error("Cost estimate error:", err);
    res.status(500).json({ message: "Failed to calculate rental cost." });
  }
});

// ==========================================
// 4. RENTAL ENQUIRIES
// ==========================================
router.post("/enquiries", requireAuth, async (req, res) => {
  try {
    const {
      vendorId,
      eventName,
      eventType,
      startDate,
      endDate,
      startTime,
      endTime,
      durationDays,
      eventLocation,
      city,
      pincode,
      venueType,
      floorOrZonesCount,
      coverageRequired,
      radioCount,
      headsetCount,
      extraBatteryCount,
      chargerCount,
      categoryPreference,
      deliveryPreference,
      technicalSupportRequired,
      budget,
      specialInstructions,
      contactName,
      contactPhone,
      contactEmail,
    } = req.body || {};

    if (!eventName || !startDate || !endDate || !eventLocation || !city || !radioCount || !contactName || !contactPhone) {
      return res.status(400).json({
        message: "Event name, dates, location, city, radio count, and contact info are required.",
      });
    }

    const calculatedDays = Math.max(
      1,
      Number(durationDays) || Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1 || 1
    );

    const enquiry = await WalkieEnquiry.create({
      customer: req.userId,
      vendor: vendorId && mongoose.isValidObjectId(vendorId) ? vendorId : null,
      eventName: String(eventName).trim(),
      eventType: eventType || "Wedding",
      startDate,
      endDate,
      startTime: startTime || "08:00",
      endTime: endTime || "22:00",
      durationDays: calculatedDays,
      eventLocation: String(eventLocation).trim(),
      city: String(city).trim(),
      pincode: pincode || "",
      venueType: venueType || "Indoor Banquet / Hotel",
      floorOrZonesCount: Number(floorOrZonesCount) || 2,
      coverageRequired: coverageRequired || "1-3 km Radius / Event Grounds",
      radioCount: Number(radioCount) || 10,
      headsetCount: Number(headsetCount) || 0,
      extraBatteryCount: Number(extraBatteryCount) || 0,
      chargerCount: Number(chargerCount) || 0,
      categoryPreference: categoryPreference || "Professional Digital Radios",
      deliveryPreference: deliveryPreference || "Vendor Delivery to Venue",
      technicalSupportRequired: Boolean(technicalSupportRequired),
      budget: Number(budget) || 0,
      specialInstructions: specialInstructions || "",
      contactName: String(contactName).trim(),
      contactPhone: String(contactPhone).trim(),
      contactEmail: contactEmail || "",
      status: "Submitted",
    });

    res.status(201).json({
      message: "Two-way radio rental enquiry submitted successfully!",
      enquiry,
    });
  } catch (err) {
    console.error("Submit enquiry error:", err);
    res.status(500).json({ message: "Failed to submit rental enquiry." });
  }
});

// Customer's enquiries
router.get("/enquiries/my", requireAuth, async (req, res) => {
  try {
    const enquiries = await WalkieEnquiry.find({ customer: req.userId })
      .populate("vendor", "companyName contactPerson phone city verificationStatus rating")
      .sort({ createdAt: -1 })
      .lean();

    res.json(enquiries);
  } catch (err) {
    console.error("Fetch customer enquiries error:", err);
    res.status(500).json({ message: "Failed to load enquiries." });
  }
});

// Vendor's incoming enquiries
router.get("/enquiries/vendor", requireAuth, async (req, res) => {
  try {
    const myVendors = await WalkieVendor.find({ user: req.userId }).select("_id");
    const vendorIds = myVendors.map((v) => v._id);

    let query = {};
    if (vendorIds.length > 0) {
      query = { $or: [{ vendor: { $in: vendorIds } }, { vendor: null }] };
    } else if (req.query.vendorId && mongoose.isValidObjectId(req.query.vendorId)) {
      query = { $or: [{ vendor: req.query.vendorId }, { vendor: null }] };
    }

    const enquiries = await WalkieEnquiry.find(query)
      .populate("customer", "fullName username email phone")
      .sort({ createdAt: -1 })
      .lean();

    res.json(enquiries);
  } catch (err) {
    console.error("Fetch vendor enquiries error:", err);
    res.status(500).json({ message: "Failed to load vendor enquiries." });
  }
});

// ==========================================
// 5. ITEMIZED QUOTATIONS
// ==========================================
router.post("/quotations", requireAuth, async (req, res) => {
  try {
    const {
      enquiryId,
      vendorId,
      lineItems,
      deliveryFee,
      setupTechnicianFee,
      discountAmount,
      taxPercentage,
      refundableDeposit,
      advancePercentage,
      terms,
      cancellationPolicy,
      deliveryScheduleNote,
    } = req.body || {};

    if (!enquiryId || !mongoose.isValidObjectId(enquiryId)) {
      return res.status(400).json({ message: "Valid enquiry ID is required." });
    }

    const enquiry = await WalkieEnquiry.findById(enquiryId);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found." });
    }

    let targetVendorId = vendorId;
    if (!targetVendorId) {
      const myVendor = await WalkieVendor.findOne({ user: req.userId });
      if (!myVendor) {
        return res.status(400).json({ message: "Vendor profile required to issue a quotation." });
      }
      targetVendorId = myVendor._id;
    }

    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return res.status(400).json({ message: "At least one line item is required in the quotation." });
    }

    // Server-side arithmetic verification
    let computedSubtotal = 0;
    const validatedLineItems = lineItems.map((li) => {
      const qty = Math.max(1, Number(li.quantity) || 1);
      const days = Math.max(1, Number(li.durationDays) || 1);
      const rate = Math.max(0, Number(li.rate) || 0);
      const itemAmount = qty * days * rate;
      computedSubtotal += itemAmount;
      return {
        description: String(li.description || "Equipment Hire"),
        category: li.category || "Radios",
        quantity: qty,
        durationDays: days,
        rate,
        amount: itemAmount,
      };
    });

    const delFee = Math.max(0, Number(deliveryFee) || 0);
    const techFee = Math.max(0, Number(setupTechnicianFee) || 0);
    const disc = Math.max(0, Number(discountAmount) || 0);
    const taxPct = Number(taxPercentage) >= 0 ? Number(taxPercentage) : 18;

    const taxableAmount = Math.max(0, computedSubtotal + delFee + techFee - disc);
    const taxAmt = Math.round(taxableAmount * (taxPct / 100));
    const grandTotal = taxableAmount + taxAmt;

    const deposit = Math.max(0, Number(refundableDeposit) || 5000);
    const advPct = Number(advancePercentage) >= 0 ? Number(advancePercentage) : 30;
    const advanceRequired = Math.round(grandTotal * (advPct / 100));
    const balanceDue = grandTotal - advanceRequired;

    const quotation = await WalkieQuotation.create({
      enquiry: enquiry._id,
      vendor: targetVendorId,
      lineItems: validatedLineItems,
      subtotal: computedSubtotal,
      deliveryFee: delFee,
      setupTechnicianFee: techFee,
      discountAmount: disc,
      taxPercentage: taxPct,
      taxAmount: taxAmt,
      grandTotal,
      refundableDeposit: deposit,
      advancePercentage: advPct,
      advanceRequired,
      balanceDue,
      terms: terms || "Security deposit refunded within 24h post return inspection.",
      cancellationPolicy: cancellationPolicy || "Full advance refund on cancellation 48h prior.",
      deliveryScheduleNote: deliveryScheduleNote || "Dispatch scheduled 3h prior to event.",
      status: "Sent",
    });

    enquiry.status = "Quoted";
    if (!enquiry.vendor) enquiry.vendor = targetVendorId;
    await enquiry.save();

    res.status(201).json({
      message: "Quotation created and sent to customer successfully!",
      quotation,
    });
  } catch (err) {
    console.error("Create quotation error:", err);
    res.status(500).json({ message: "Failed to generate quotation." });
  }
});

// Get Quotations for Enquiry
router.get("/quotations/enquiry/:enquiryId", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.enquiryId)) {
      return res.status(400).json({ message: "Invalid enquiry ID." });
    }

    const quotations = await WalkieQuotation.find({ enquiry: req.params.enquiryId })
      .populate("vendor", "companyName contactPerson phone city verificationStatus rating wpcLicenseStatus")
      .sort({ createdAt: -1 })
      .lean();

    res.json(quotations);
  } catch (err) {
    console.error("Fetch quotations error:", err);
    res.status(500).json({ message: "Failed to load quotations." });
  }
});

// ==========================================
// 6. ACCEPT QUOTATION & CONFIRM BOOKING
// ==========================================
router.post("/quotations/:id/accept", requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid quotation ID." });
    }

    const quotation = await WalkieQuotation.findById(req.params.id).populate("enquiry");
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found." });
    }

    if (quotation.status === "Accepted") {
      return res.status(400).json({ message: "This quotation has already been accepted and confirmed." });
    }

    const enquiry = quotation.enquiry;
    if (!enquiry) {
      return res.status(404).json({ message: "Associated enquiry not found." });
    }

    // Concurrency & Overlapping Availability Check
    const overlappingBookings = await WalkieBooking.find({
      vendor: quotation.vendor,
      bookingStatus: { $nin: ["Cancelled", "Completed"] },
      $or: [
        { startDate: { $lte: enquiry.endDate }, endDate: { $gte: enquiry.startDate } },
      ],
    }).select("radioCount");

    const reservedRadioCount = overlappingBookings.reduce((sum, b) => sum + (b.radioCount || 0), 0);

    // Sum vendor total stock of radios
    const vendorEquipment = await WalkieEquipment.find({
      vendor: quotation.vendor,
      category: { $in: ["Standard Two-Way Radios", "Professional Digital Radios"] },
    });
    const totalRadioCapacity = vendorEquipment.reduce((sum, eq) => sum + (eq.totalStock || 0), 0);

    // Ensure capacity exists
    if (totalRadioCapacity > 0 && reservedRadioCount + enquiry.radioCount > totalRadioCapacity) {
      return res.status(409).json({
        message: `Inventory constraint: Vendor currently has ${totalRadioCapacity - reservedRadioCount} units available for these dates, but ${enquiry.radioCount} were requested. Please adjust quantity or select another vendor.`,
      });
    }

    // Generate unique booking code and QR tokens
    const bookingCode = `MILAP-RAD-${Math.floor(100000 + Math.random() * 900000)}`;
    const handoverToken = generateSecureToken("HO");
    const returnToken = generateSecureToken("RET");

    const booking = await WalkieBooking.create({
      customer: req.userId,
      vendor: quotation.vendor,
      enquiry: enquiry._id,
      quotation: quotation._id,
      bookingCode,
      eventName: enquiry.eventName,
      eventLocation: enquiry.eventLocation,
      city: enquiry.city,
      startDate: enquiry.startDate,
      endDate: enquiry.endDate,
      durationDays: enquiry.durationDays,
      radioCount: enquiry.radioCount,
      headsetCount: enquiry.headsetCount || 0,
      extraBatteryCount: enquiry.extraBatteryCount || 0,
      chargerCount: enquiry.chargerCount || 0,
      equipmentSnapshot: quotation.lineItems,
      agreedRentalTotal: quotation.grandTotal,
      refundableDeposit: quotation.refundableDeposit,
      advancePaid: quotation.advanceRequired,
      balanceRemaining: quotation.balanceDue,
      bookingStatus: "Confirmed",
      paymentStatus: "AdvancePaid",
      handoverToken,
      returnToken,
      auditLogs: [
        {
          action: "Booking Confirmed",
          performedBy: "Customer",
          notes: `Quotation ${quotation._id} accepted. Advance of ₹${quotation.advanceRequired} recorded.`,
        },
      ],
    });

    // Mark quotation and enquiry accepted
    quotation.status = "Accepted";
    await quotation.save();

    enquiry.status = "Accepted";
    await enquiry.save();

    // Update equipment reserved stock
    for (const eq of vendorEquipment) {
      eq.reservedStock = (eq.reservedStock || 0) + enquiry.radioCount;
      await eq.save();
      break;
    }

    // Create default channel allocations for smooth event coordination
    const defaultGroups = [
      { groupName: "Stage & Program Management", channelNumber: 1, assignedRadioCount: Math.max(1, Math.floor(enquiry.radioCount * 0.3)) },
      { groupName: "Security & Crowd Control", channelNumber: 2, assignedRadioCount: Math.max(1, Math.floor(enquiry.radioCount * 0.3)) },
      { groupName: "Hospitality & VIP Coordination", channelNumber: 3, assignedRadioCount: Math.max(1, Math.floor(enquiry.radioCount * 0.2)) },
      { groupName: "Parking & Valet Logistics", channelNumber: 4, assignedRadioCount: Math.max(1, Math.floor(enquiry.radioCount * 0.2)) },
    ];

    for (const grp of defaultGroups) {
      await WalkieAssignment.create({
        booking: booking._id,
        groupName: grp.groupName,
        channelNumber: grp.channelNumber,
        assignedRadioCount: grp.assignedRadioCount,
      });
    }

    res.status(201).json({
      message: "Quotation accepted! Booking confirmed and equipment reserved.",
      booking,
    });
  } catch (err) {
    console.error("Accept quotation error:", err);
    res.status(500).json({ message: "Failed to confirm booking." });
  }
});

// ==========================================
// 7. BOOKINGS DASHBOARD & AUDIT
// ==========================================
router.get("/bookings/my", requireAuth, async (req, res) => {
  try {
    const bookings = await WalkieBooking.find({ customer: req.userId })
      .populate("vendor", "companyName contactPerson phone city address rating verificationStatus")
      .populate("quotation")
      .sort({ startDate: 1, createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    console.error("Fetch customer bookings error:", err);
    res.status(500).json({ message: "Failed to load bookings." });
  }
});

router.get("/bookings/vendor", requireAuth, async (req, res) => {
  try {
    const myVendors = await WalkieVendor.find({ user: req.userId }).select("_id");
    const vendorIds = myVendors.map((v) => v._id);

    let query = {};
    if (vendorIds.length > 0) {
      query = { vendor: { $in: vendorIds } };
    } else if (req.query.vendorId && mongoose.isValidObjectId(req.query.vendorId)) {
      query = { vendor: req.query.vendorId };
    }

    const bookings = await WalkieBooking.find(query)
      .populate("customer", "fullName username phone email")
      .populate("quotation")
      .sort({ startDate: 1, createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    console.error("Fetch vendor bookings error:", err);
    res.status(500).json({ message: "Failed to load vendor bookings." });
  }
});

router.get("/bookings/:id", requireAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid booking ID." });
    }

    const booking = await WalkieBooking.findById(req.params.id)
      .populate("vendor")
      .populate("customer", "fullName username phone email")
      .populate("quotation")
      .lean();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const assignments = await WalkieAssignment.find({ booking: booking._id }).lean();
    res.json({ ...booking, assignments });
  } catch (err) {
    console.error("Fetch single booking error:", err);
    res.status(500).json({ message: "Failed to load booking details." });
  }
});

// ==========================================
// 8. QR HANDOVER & RETURN WORKFLOW
// ==========================================

// Token verification scanner
router.get("/bookings/verify-token/:token", async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ message: "Token is required." });

    const booking = await WalkieBooking.findOne({
      $or: [{ handoverToken: token }, { returnToken: token }],
    })
      .populate("vendor", "companyName phone city")
      .populate("customer", "fullName username phone")
      .lean();

    if (!booking) {
      return res.status(404).json({ message: "Invalid or unrecognized QR scan token." });
    }

    const isHandover = booking.handoverToken === token;
    res.json({
      type: isHandover ? "Handover" : "Return",
      bookingCode: booking.bookingCode,
      eventName: booking.eventName,
      startDate: booking.startDate,
      endDate: booking.endDate,
      radioCount: booking.radioCount,
      headsetCount: booking.headsetCount,
      extraBatteryCount: booking.extraBatteryCount,
      chargerCount: booking.chargerCount,
      bookingStatus: booking.bookingStatus,
      customer: booking.customer,
      vendor: booking.vendor,
      bookingId: booking._id,
    });
  } catch (err) {
    console.error("Verify token error:", err);
    res.status(500).json({ message: "Token verification failed." });
  }
});

// Dispatch Handover Confirmation
router.post("/bookings/:id/handover", requireAuth, async (req, res) => {
  try {
    const { token, notes, dispatchedBy } = req.body || {};
    const booking = await WalkieBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (token && booking.handoverToken !== token) {
      return res.status(400).json({ message: "Invalid handover security token." });
    }

    if (["HandoverCompleted", "RentalInProgress", "Completed"].includes(booking.bookingStatus)) {
      return res.status(400).json({ message: "Handover has already been completed for this booking." });
    }

    booking.bookingStatus = "RentalInProgress";
    booking.dispatchDetails = {
      dispatchedAt: new Date(),
      dispatchedBy: dispatchedBy || "Vendor Field Technician",
      notes: notes || "Equipment inspected, frequencies verified, batteries charged 100%.",
      clientAcknowledged: true,
    };

    booking.auditLogs.push({
      action: "Equipment Handover Completed",
      performedBy: dispatchedBy || "Vendor",
      notes: `${booking.radioCount} radios handed over to event organizer.`,
    });

    await booking.save();

    res.json({
      message: "Equipment handover acknowledged successfully! Radios are now live in use.",
      booking,
    });
  } catch (err) {
    console.error("Handover error:", err);
    res.status(500).json({ message: "Failed to record equipment handover." });
  }
});

// Return & Inspection Confirmation
router.post("/bookings/:id/return", requireAuth, async (req, res) => {
  try {
    const { token, missingCount = 0, damagedCount = 0, damageCharges = 0, inspectedBy, notes } = req.body || {};
    const booking = await WalkieBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (token && booking.returnToken !== token) {
      return res.status(400).json({ message: "Invalid return verification token." });
    }

    if (booking.bookingStatus === "Completed") {
      return res.status(400).json({ message: "This booking has already been returned and finalized." });
    }

    const missing = Math.max(0, Number(missingCount) || 0);
    const damaged = Math.max(0, Number(damagedCount) || 0);
    const deductions = Math.max(0, Number(damageCharges) || 0);
    const initialDeposit = booking.refundableDeposit || 0;
    const finalRefund = Math.max(0, initialDeposit - deductions);

    booking.bookingStatus = "Completed";
    booking.paymentStatus = "DepositRefunded";
    booking.returnDetails = {
      returnedAt: new Date(),
      inspectedBy: inspectedBy || "Vendor Quality Manager",
      missingItemsCount: missing,
      damagedItemsCount: damaged,
      damageCharges: deductions,
      refundedDepositAmount: finalRefund,
      reconciliationNotes: notes || (missing === 0 && damaged === 0 ? "All items returned in pristine order." : `Reconciliation deduction applied: ₹${deductions}`),
      clientAcknowledged: true,
    };

    booking.auditLogs.push({
      action: "Return & Deposit Reconciled",
      performedBy: inspectedBy || "Vendor",
      notes: `Returned: ${booking.radioCount - missing}/${booking.radioCount} radios. Deposit refund: ₹${finalRefund}.`,
    });

    await booking.save();

    // Release vendor reserved stock
    const vendorEquipment = await WalkieEquipment.find({
      vendor: booking.vendor,
      category: { $in: ["Standard Two-Way Radios", "Professional Digital Radios"] },
    });
    for (const eq of vendorEquipment) {
      eq.reservedStock = Math.max(0, (eq.reservedStock || 0) - booking.radioCount);
      await eq.save();
      break;
    }

    res.json({
      message: "Equipment return inspection complete. Deposit reconciliation recorded successfully!",
      booking,
    });
  } catch (err) {
    console.error("Return inspection error:", err);
    res.status(500).json({ message: "Failed to process return." });
  }
});

// ==========================================
// 9. EVENT CREW CHANNEL ASSIGNMENTS
// ==========================================
router.get("/bookings/:id/assignments", async (req, res) => {
  try {
    const assignments = await WalkieAssignment.find({ booking: req.params.id }).sort({ channelNumber: 1 });
    res.json(assignments);
  } catch (err) {
    console.error("Fetch assignments error:", err);
    res.status(500).json({ message: "Failed to load team assignments." });
  }
});

router.post("/bookings/:id/assignments", requireAuth, async (req, res) => {
  try {
    const { groupName, channelNumber, assignedRadioCount, leadPersonName, contactPhone, notes } = req.body || {};

    if (!groupName || !channelNumber || !assignedRadioCount) {
      return res.status(400).json({ message: "Group name, channel number, and assigned count are required." });
    }

    const assignment = await WalkieAssignment.create({
      booking: req.params.id,
      groupName,
      channelNumber: Number(channelNumber),
      assignedRadioCount: Number(assignedRadioCount),
      leadPersonName: leadPersonName || "",
      contactPhone: contactPhone || "",
      notes: notes || "",
    });

    res.status(201).json({ message: "Team channel allocated successfully!", assignment });
  } catch (err) {
    console.error("Create assignment error:", err);
    res.status(500).json({ message: "Failed to allocate channel assignment." });
  }
});

// ==========================================
// 10. REVIEWS & RATINGS
// ==========================================
router.post("/reviews", requireAuth, async (req, res) => {
  try {
    const { bookingId, rating, review, soundClarityRating, batteryPerformanceRating, customerSupportRating } = req.body || {};

    if (!bookingId || !rating || !review) {
      return res.status(400).json({ message: "Booking ID, rating (1-5), and review text are required." });
    }

    const booking = await WalkieBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const existingReview = await WalkieReview.findOne({ booking: booking._id });
    if (existingReview) {
      return res.status(400).json({ message: "You have already submitted a review for this booking." });
    }

    const numRating = Math.min(5, Math.max(1, Number(rating)));

    const newReview = await WalkieReview.create({
      booking: booking._id,
      vendor: booking.vendor,
      customer: req.userId,
      rating: numRating,
      review: String(review).trim(),
      soundClarityRating: Number(soundClarityRating) || 5,
      batteryPerformanceRating: Number(batteryPerformanceRating) || 5,
      customerSupportRating: Number(customerSupportRating) || 5,
    });

    // Recalculate vendor average rating
    const allReviews = await WalkieReview.find({ vendor: booking.vendor });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await WalkieVendor.findByIdAndUpdate(booking.vendor, {
      rating: Number(avg.toFixed(1)),
      reviewCount: allReviews.length,
    });

    res.status(201).json({ message: "Thank you! Your verified review has been published.", review: newReview });
  } catch (err) {
    console.error("Review creation error:", err);
    res.status(500).json({ message: "Failed to submit review." });
  }
});

// ==========================================
// 11. ADMIN PORTAL & METRICS
// ==========================================
router.get("/admin/stats", async (req, res) => {
  try {
    const totalVendors = await WalkieVendor.countDocuments();
    const verifiedVendors = await WalkieVendor.countDocuments({ verificationStatus: "Verified" });
    const totalEquipmentModels = await WalkieEquipment.countDocuments();
    const activeEnquiries = await WalkieEnquiry.countDocuments({ status: { $in: ["Submitted", "Quoted"] } });
    const confirmedBookings = await WalkieBooking.countDocuments({ bookingStatus: { $in: ["Confirmed", "Preparing", "Dispatched", "RentalInProgress"] } });
    const completedBookings = await WalkieBooking.countDocuments({ bookingStatus: "Completed" });

    res.json({
      totalVendors,
      verifiedVendors,
      totalEquipmentModels,
      activeEnquiries,
      confirmedBookings,
      completedBookings,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Failed to fetch admin stats." });
  }
});

router.patch("/admin/vendors/:id/verify", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid vendor ID." });
    }

    const vendor = await WalkieVendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    vendor.verificationStatus = vendor.verificationStatus === "Verified" ? "Suspended" : "Verified";
    await vendor.save();

    res.json({
      message: `Vendor status updated to ${vendor.verificationStatus}.`,
      vendor,
    });
  } catch (err) {
    console.error("Admin verify toggle error:", err);
    res.status(500).json({ message: "Failed to update vendor verification." });
  }
});

module.exports = router;
