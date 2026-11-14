const assert = require("assert");
const musicTentRoutes = require("../routes/musicTent");

// Mock Express req and res helper
function createMockReqRes({ method = "GET", url = "/", query = {}, body = {}, headers = {}, params = {} }) {
  const req = {
    method,
    url,
    originalUrl: url,
    query,
    body,
    headers,
    params,
  };

  let resolvePromise;
  const promise = new Promise((resolve) => {
    resolvePromise = resolve;
  });

  const res = {
    statusCode: 200,
    headers: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      resolvePromise({ status: this.statusCode, body: data });
      return this;
    },
    send(data) {
      resolvePromise({ status: this.statusCode, body: data });
      return this;
    },
  };

  return { req, res, promise };
}

// Find route handler in express Router stack
function findHandler(router, method, exactPath) {
  for (const layer of router.stack) {
    if (layer.route) {
      const routePath = layer.route.path;
      const routeMethod = Object.keys(layer.route.methods)[0]?.toUpperCase();
      if (routeMethod === method.toUpperCase() && routePath === exactPath) {
        const handlers = layer.route.stack.map((s) => s.handle);
        return async (req, res) => {
          let idx = 0;
          function next() {
            idx++;
            if (idx < handlers.length) {
              handlers[idx](req, res, next);
            }
          }
          handlers[0](req, res, next);
        };
      }
    }
  }
  return null;
}

async function runTests() {
  console.log("=== STARTING MUSIC & TENT MODULE TESTS (DIRECT ROUTER TEST) ===");

  // TEST 1: GET Vendors Discovery
  console.log("Test 1: Vendor discovery endpoint...");
  const h1 = findHandler(musicTentRoutes, "GET", "/vendors");
  assert.ok(h1, "Handler for GET /vendors must exist");
  const { req: req1, res: res1, promise: p1 } = createMockReqRes({ method: "GET", url: "/vendors" });
  h1(req1, res1);
  const result1 = await p1;
  assert.strictEqual(result1.status, 200, "Should return status 200");
  assert.ok(result1.body.success, "Should have success flag");
  assert.ok(result1.body.vendors.length > 0, "Should return seeded vendors");
  console.log(`✓ Fetched ${result1.body.vendors.length} vendors`);

  // TEST 2: Filter by DJ category
  console.log("Test 2: Filter by DJ category...");
  const { req: req2, res: res2, promise: p2 } = createMockReqRes({
    method: "GET",
    url: "/vendors",
    query: { serviceType: "Music", category: "DJ" },
  });
  h1(req2, res2);
  const result2 = await p2;
  assert.strictEqual(result2.status, 200);
  assert.ok(result2.body.vendors.every((v) => v.categories.includes("DJ")));
  console.log(`✓ Filtered ${result2.body.vendors.length} DJ vendors`);

  // TEST 3: Location search with coordinates
  console.log("Test 3: Location search with Mumbai coordinates...");
  const { req: req3, res: res3, promise: p3 } = createMockReqRes({
    method: "GET",
    url: "/vendors",
    query: { city: "Mumbai", lat: "19.076", lng: "72.8777" },
  });
  h1(req3, res3);
  const result3 = await p3;
  assert.strictEqual(result3.status, 200);
  assert.ok(result3.body.vendors.length > 0);
  assert.ok(result3.body.vendors[0].distanceKm !== undefined);
  console.log(`✓ Distance calculated: ${result3.body.vendors[0].distanceKm} km`);

  // TEST 4: Calculate Pricing Engine for Music
  console.log("Test 4: Pricing calculator for Music (DJ, 6 hours, 800 guests)...");
  const hCalc = findHandler(musicTentRoutes, "POST", "/calculate");
  assert.ok(hCalc, "Handler for POST /calculate must exist");
  const { req: req4, res: res4, promise: p4 } = createMockReqRes({
    method: "POST",
    url: "/calculate",
    body: {
      serviceType: "Music",
      category: "DJ",
      durationHours: 6,
      soundCoverageGuests: 800,
      includeLighting: true,
      includeStageTrussing: true,
    },
  });
  hCalc(req4, res4);
  const result4 = await p4;
  assert.strictEqual(result4.status, 200);
  assert.ok(result4.body.breakdown.baseCost > 0);
  assert.ok(result4.body.breakdown.durationOrAreaCost > 0, "Should calculate overtime");
  assert.ok(result4.body.breakdown.tax > 0, "Should calculate 18% GST");
  assert.ok(result4.body.breakdown.total > result4.body.breakdown.subtotal);
  console.log(`✓ Music Quote Total: ₹${result4.body.breakdown.total}`);

  // TEST 5: Calculate Pricing Engine for Tent & Decor
  console.log("Test 5: Pricing calculator for Tent (3,500 sq ft, Royal Rajwada Mandap)...");
  const { req: req5, res: res5, promise: p5 } = createMockReqRes({
    method: "POST",
    url: "/calculate",
    body: {
      serviceType: "TentDecor",
      category: "Mandap",
      mandapTier: "Royal Rajwada",
      eventAreaSqFt: 3500,
      flowerType: "Fresh Exotic",
      furnitureCount: 300,
    },
  });
  hCalc(req5, res5);
  const result5 = await p5;
  assert.strictEqual(result5.status, 200);
  assert.ok(result5.body.breakdown.flowerCost > 0);
  assert.ok(result5.body.breakdown.durationOrAreaCost > 0, "Extra sqft calculated");
  console.log(`✓ Tent Decor Quote Total: ₹${result5.body.breakdown.total}`);

  // TEST 6: Enquiry Creation with Reference Image
  console.log("Test 6: Submit quotation request with reference image...");
  const sampleVendor = result1.body.vendors[0];
  const sampleImgBase64 = "data:image/jpeg;base64," + Buffer.from("fake_test_image_bytes").toString("base64");
  const hEnq = findHandler(musicTentRoutes, "POST", "/enquiries");
  assert.ok(hEnq, "Handler for POST /enquiries must exist");
  const { req: req6, res: res6, promise: p6 } = createMockReqRes({
    method: "POST",
    url: "/enquiries",
    body: {
      vendorId: sampleVendor._id,
      customerName: "Satyam Kumar Test",
      customerPhone: "+91 98765 43210",
      customerEmail: "satyam.test@milap.com",
      serviceType: sampleVendor.serviceType,
      category: sampleVendor.categories[0],
      eventDate: "2026-12-15",
      eventLocation: "Taj Lands End, Bandra, Mumbai",
      guestCount: 500,
      customRequirements: "Grand royal entrance with synchronized pyrotechnics",
      referenceImages: [
        {
          name: "mandap_inspiration.jpg",
          dataUrl: sampleImgBase64,
        },
      ],
    },
  });
  hEnq(req6, res6);
  const result6 = await p6;
  assert.strictEqual(result6.status, 201);
  assert.ok(result6.body.enquiry.enquiryNumber.startsWith("MTE-"));
  assert.strictEqual(result6.body.enquiry.status, "Pending");
  const enquiryId = result6.body.enquiry._id;
  console.log(`✓ Created enquiry: ${result6.body.enquiry.enquiryNumber}`);

  // TEST 7: Vendor submits quotation
  console.log("Test 7: Vendor submits detailed quotation against enquiry...");
  const hQuote = findHandler(musicTentRoutes, "POST", "/enquiries/:id/quote");
  assert.ok(hQuote, "Handler for POST /enquiries/:id/quote must exist");
  const { req: req7, res: res7, promise: p7 } = createMockReqRes({
    method: "POST",
    url: `/enquiries/${enquiryId}/quote`,
    params: { id: enquiryId },
    body: {
      vendorId: sampleVendor._id,
      pricingType: "CustomQuotation",
      breakdown: {
        baseCost: 55000,
        durationOrAreaCost: 6000,
        equipmentCost: 15000,
        flowerCost: 0,
        lightingCost: 10000,
        labourCost: 4000,
        transportCost: 2000,
        setupDismantleCost: 3000,
        optionalExtrasCost: 5000,
        refundableDeposit: 8000,
        subtotal: 100000,
        tax: 18000,
        total: 118000,
      },
      inclusions: ["Full DJ Rig", "Dual Line Array", "4 Wireless Mics"],
      exclusions: ["Generator"],
      confirmedAvailability: true,
      vendorNotes: "Date confirmed available on our schedule. 25% advance to hold.",
    },
  });
  hQuote(req7, res7);
  const result7 = await p7;
  assert.strictEqual(result7.status, 201);
  assert.ok(result7.body.quotation.quotationNumber.startsWith("MTQ-"));
  const quotationId = result7.body.quotation._id;
  console.log(`✓ Quotation generated: ${result7.body.quotation.quotationNumber}`);

  // TEST 8: Customer confirms quotation into booking
  console.log("Test 8: Confirm quotation into booking...");
  const hConfirm = findHandler(musicTentRoutes, "POST", "/enquiries/:id/confirm");
  assert.ok(hConfirm, "Handler for POST /enquiries/:id/confirm must exist");
  const { req: req8, res: res8, promise: p8 } = createMockReqRes({
    method: "POST",
    url: `/enquiries/${enquiryId}/confirm`,
    params: { id: enquiryId },
    body: {
      quotationId,
      paymentStatus: "Advance Paid",
    },
  });
  hConfirm(req8, res8);
  const result8 = await p8;
  assert.strictEqual(result8.status, 201);
  assert.ok(result8.body.booking.bookingNumber.startsWith("MTB-"));
  assert.strictEqual(result8.body.booking.status, "Confirmed");
  console.log(`✓ Booking confirmed: ${result8.body.booking.bookingNumber}`);

  // TEST 9: Verification distinction check
  console.log("Test 9: Verified vs Unverified listing check...");
  const verifiedVendors = result1.body.vendors.filter((v) => v.verificationStatus === "Verified");
  const unverifiedVendors = result1.body.vendors.filter((v) => v.verificationStatus === "Unverified");
  assert.ok(verifiedVendors.length > 0, "Should have verified vendors");
  assert.ok(unverifiedVendors.length > 0, "Should have unverified sample vendors");
  console.log(`✓ Found ${verifiedVendors.length} Verified and ${unverifiedVendors.length} Unverified listings`);

  console.log("\nALL MUSIC & TENT TESTS PASSED SUCCESSFULLY! ✓✓✓");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
