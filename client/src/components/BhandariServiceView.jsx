import { useState, useEffect, useMemo } from "react";
import {
  ChefHat,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  ShieldCheck,
  FileText,
  IndianRupee,
  Star,
  Search,
  Send,
  Check,
  X,
  ArrowRight,
  AlertCircle,
  Plus,
  Trash2,
  UtensilsCrossed,
  RotateCcw
} from "lucide-react";
import { API_BASE } from "../apiConfig";
import "./BhandariServiceView.css";

const CUISINE_OPTIONS = [
  "All",
  "Rajasthani",
  "Awadhi",
  "Bhojpuri",
  "Bihari",
  "Punjabi",
  "Gujarati",
  "Bengali",
  "Maharashtrian",
  "South Indian",
  "North Indian",
];

const TEAM_TYPES = [
  "All",
  "Maharaj",
  "Bhandari",
  "Halwai",
  "Tandoor & Roti",
  "Complete Catering",
];

const SERVICE_TYPES = [
  "All",
  "Labour-only cooking team",
  "Cooking team with basic equipment",
  "Cooking team with ingredients",
  "Complete catering package",
];

const INGREDIENT_ITEMS = [
  { id: "vegetables", label: "Fresh Vegetables (सब्ज़ियाँ)" },
  { id: "rice", label: "Basmati Rice & Grains (चावल व अनाज)" },
  { id: "flour", label: "Atta, Maida & Flours (आटा व मैदा)" },
  { id: "pulses", label: "Dal & Pulses (दालें व राजमा-छोले)" },
  { id: "spices", label: "Shahi Spices & Masale (मसाले)" },
  { id: "ghee", label: "Pure Desi Ghee & Cooking Oil (घी व तेल)" },
  { id: "dairy", label: "Milk, Dahi & Paneer (पनीर व दूध)" },
  { id: "sweets_raw", label: "Sweets Raw Material / Mawa (मावा व मीठा)" },
  { id: "drinking_water", label: "Safe Cooking & Drinking Water (पानी)" },
];

const EQUIPMENT_ITEMS = [
  { id: "burners", label: "Commercial High-Flame Bhattis (भट्टी)" },
  { id: "cylinders", label: "Commercial LPG Fuel Cylinders (गैस सिलेंडर)" },
  { id: "kadhais", label: "Large Cooking Degchis & Kadhais (कड़ाही)" },
  { id: "knives_tools", label: "Chef Ladles, Jharas & Knives (चाकू व औजार)" },
  { id: "serving_vessels", label: "Serving Brass Handis & Trays (परोसने के बर्तन)" },
  { id: "work_tables", label: "Kitchen Preparation Tables (तैयारी मेज)" },
  { id: "waste_bins", label: "Waste Disposal Bins (कचरा पात्र)" },
];

const RESPONSIBILITY_OPTIONS = [
  "Supplied by customer",
  "Supplied by vendor",
  "Included in package",
  "Not required",
];

export default function BhandariServiceView({
  authData,
  adminData,
  onOpenAuth,
  onBackHome,
}) {
  const [activeTab, setActiveTab] = useState("discovery"); // discovery | enquiries | bookings | vendor_portal | admin
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search & Filter State
  const [searchCity, setSearchCity] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedTeamType, setSelectedTeamType] = useState("All");
  const [selectedServiceType, setSelectedServiceType] = useState("All");
  const [searchDate, setSearchDate] = useState("");
  const [guestCountFilter, setGuestCountFilter] = useState("");
  const [maxBudgetFilter, setMaxBudgetFilter] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Selected Vendor Detail Modal
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Enquiry Modal
  const [enquiryModalVendor, setEnquiryModalVendor] = useState(null);
  const [enquiryForm, setEnquiryForm] = useState({
    eventType: "Wedding",
    eventDate: "",
    eventLocation: "",
    city: "",
    guestCount: 500,
    requestedCooks: 4,
    requestedHelpers: 6,
    budget: 35000,
    cuisines: ["North Indian"],
    serviceType: "Labour-only cooking team",
    ingredientResponsibilities: Object.fromEntries(
      INGREDIENT_ITEMS.map((item) => [item.id, "Supplied by customer"])
    ),
    equipmentResponsibilities: Object.fromEntries(
      EQUIPMENT_ITEMS.map((item) => [
        item.id,
        item.id === "burners" || item.id === "kadhais" || item.id === "knives_tools"
          ? "Supplied by vendor"
          : "Supplied by customer",
      ])
    ),
    specialRequirements: "",
  });

  // Client Enquiries and Bookings State
  const [myEnquiries, setMyEnquiries] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  // Quotation Viewer Modal
  const [viewingQuotationsEnquiry, setViewingQuotationsEnquiry] = useState(null);
  const [availableQuotations, setAvailableQuotations] = useState([]);

  // Review Modal
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // Vendor Dashboard State
  const [vendorEnquiries, setVendorEnquiries] = useState([]);
  const [quotingEnquiry, setQuotingEnquiry] = useState(null);
  const [quoteLineItems, setQuoteLineItems] = useState([
    {
      description: "Head Maharaj & Senior Cooks (4 Cooks × 1 Day)",
      category: "Main Cooks Labour",
      quantity: 4,
      unit: "Cook-Day",
      rate: 3500,
      amount: 14000,
    },
    {
      description: "Halwai Sweets Specialist (2 Halwai × 1 Day)",
      category: "Halwai Specialist Labour",
      quantity: 2,
      unit: "Halwai-Day",
      rate: 3000,
      amount: 6000,
    },
    {
      description: "Kitchen Prep Helpers (6 Helpers × 1 Day)",
      category: "Kitchen Helpers",
      quantity: 6,
      unit: "Helper-Day",
      rate: 1200,
      amount: 7200,
    },
    {
      description: "High-Flame Bhattis & Heavy Kadhai Set Rental",
      category: "Equipment & Bhatti Rental",
      quantity: 1,
      unit: "Set",
      rate: 4000,
      amount: 4000,
    },
  ]);
  const [quoteTransport, setQuoteTransport] = useState(1500);
  const [quoteDiscount, setQuoteDiscount] = useState(700);
  const [quoteTaxPct, setQuoteTaxPct] = useState(5);
  const [quoteAdvPct, setQuoteAdvPct] = useState(25);
  const [quoteTerms, setQuoteTerms] = useState(
    "25% advance to confirm booking. Rest 75% payment on event day upon completion."
  );

  // Admin Dashboard State
  const [adminStats, setAdminStats] = useState(null);

  // Helper: Money Format
  const money = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  // Load Vendors
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchCity) params.append("city", searchCity);
      if (selectedCuisine !== "All") params.append("cuisine", selectedCuisine);
      if (selectedTeamType !== "All") params.append("teamType", selectedTeamType);
      if (selectedServiceType !== "All") params.append("serviceType", selectedServiceType);
      if (searchDate) params.append("date", searchDate);
      if (guestCountFilter) params.append("guests", guestCountFilter);
      if (maxBudgetFilter) params.append("maxBudget", maxBudgetFilter);
      if (searchKeyword) params.append("search", searchKeyword);
      if (verifiedOnly) params.append("verifiedOnly", "true");

      const res = await fetch(`${API_BASE}/api/bhandari/vendors?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setVendors(data.vendors || []);
      }
    } catch (err) {
      console.error("Failed to load vendors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [
    searchCity,
    selectedCuisine,
    selectedTeamType,
    selectedServiceType,
    searchDate,
    guestCountFilter,
    maxBudgetFilter,
    searchKeyword,
    verifiedOnly,
  ]);

  // Load Customer Enquiries
  const fetchMyEnquiries = async () => {
    if (!authData?.token) return;
    try {
      const res = await fetch(`${API_BASE}/api/bhandari/enquiries/my`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const data = await res.json();
      if (res.ok) setMyEnquiries(data);
    } catch (err) {
      console.error("Failed to load my enquiries:", err);
    }
  };

  // Load Customer Bookings
  const fetchMyBookings = async () => {
    if (!authData?.token) return;
    try {
      const res = await fetch(`${API_BASE}/api/bhandari/bookings/my`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const data = await res.json();
      if (res.ok) setMyBookings(data);
    } catch (err) {
      console.error("Failed to load my bookings:", err);
    }
  };

  // Load Vendor Enquiries
  const fetchVendorEnquiries = async () => {
    if (!authData?.token) return;
    try {
      const res = await fetch(`${API_BASE}/api/bhandari/enquiries/vendor`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const data = await res.json();
      if (res.ok) setVendorEnquiries(data);
    } catch (err) {
      console.error("Failed to load vendor enquiries:", err);
    }
  };

  // Load Admin Stats
  const fetchAdminStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/bhandari/admin/stats`);
      const data = await res.json();
      if (res.ok) setAdminStats(data);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "enquiries") fetchMyEnquiries();
    if (activeTab === "bookings") fetchMyBookings();
    if (activeTab === "vendor_portal") fetchVendorEnquiries();
    if (activeTab === "admin") {
      fetchAdminStats();
      fetchVendors();
    }
  }, [activeTab, authData]);

  // Handle Enquiry Submission
  const handleCreateEnquiry = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!authData?.token) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (!enquiryForm.eventDate) {
      setErrorMsg("Please select an event date.");
      return;
    }

    try {
      const payload = {
        ...enquiryForm,
        vendorId: enquiryModalVendor._id,
        customerName: authData.user?.fullName || authData.user?.username,
        customerPhone: authData.user?.phone || "",
        customerEmail: authData.user?.email || "",
        guestCount: Number(enquiryForm.guestCount) || 500,
        requestedCooks: Number(enquiryForm.requestedCooks) || 4,
        requestedHelpers: Number(enquiryForm.requestedHelpers) || 6,
        budget: Number(enquiryForm.budget) || 0,
      };

      const res = await fetch(`${API_BASE}/api/bhandari/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit enquiry.");
      }

      setSuccessMsg("Enquiry sent to the cooking team! They will review and issue an itemized quotation.");
      setEnquiryModalVendor(null);
      setActiveTab("enquiries");
      fetchMyEnquiries();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // Load Quotations for an enquiry
  const handleViewQuotations = async (enquiry) => {
    setViewingQuotationsEnquiry(enquiry);
    setAvailableQuotations([]);
    try {
      const res = await fetch(
        `${API_BASE}/api/bhandari/enquiries/${enquiry._id}/quotations`,
        { headers: { Authorization: `Bearer ${authData?.token}` } }
      );
      const data = await res.json();
      if (res.ok) {
        setAvailableQuotations(data);
      }
    } catch (err) {
      console.error("Failed to load quotation:", err);
    }
  };

  // Accept Quotation -> Confirm Booking
  const handleAcceptQuotation = async (quotationId) => {
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(
        `${API_BASE}/api/bhandari/quotations/${quotationId}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to accept quotation.");
      }

      setSuccessMsg("Quotation accepted! Cooking team booking is now confirmed!");
      setViewingQuotationsEnquiry(null);
      setActiveTab("bookings");
      fetchMyBookings();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewBooking) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/bhandari/bookings/${reviewBooking._id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
          body: JSON.stringify({
            rating: reviewRating,
            reviewText: reviewText,
            customerName: authData.user?.fullName || "Verified Client",
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review");
      setSuccessMsg("Thank you! Review and rating submitted successfully.");
      setReviewBooking(null);
      setReviewText("");
      fetchMyBookings();
      fetchVendors();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // Vendor Quotation Calculation
  const quoteSubtotal = useMemo(() => {
    return quoteLineItems.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.rate) || 0), 0);
  }, [quoteLineItems]);

  const quoteTaxable = Math.max(0, quoteSubtotal + Number(quoteTransport) - Number(quoteDiscount));
  const quoteTaxAmount = Math.round(quoteTaxable * (Number(quoteTaxPct) / 100));
  const quoteGrandTotal = quoteTaxable + quoteTaxAmount;
  const quoteAdvance = Math.round(quoteGrandTotal * (Number(quoteAdvPct) / 100));
  const quoteBalance = quoteGrandTotal - quoteAdvance;

  const handleCreateQuotation = async (e) => {
    e.preventDefault();
    if (!quotingEnquiry) return;
    try {
      const payload = {
        lineItems: quoteLineItems.map((item) => ({
          ...item,
          amount: Number(item.quantity) * Number(item.rate),
        })),
        transportCharges: Number(quoteTransport),
        discountAmount: Number(quoteDiscount),
        taxPercentage: Number(quoteTaxPct),
        advancePercentage: Number(quoteAdvPct),
        terms: quoteTerms,
      };

      const res = await fetch(
        `${API_BASE}/api/bhandari/enquiries/${quotingEnquiry._id}/quotations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to issue quotation.");

      setSuccessMsg("Official itemized quotation sent to customer!");
      setQuotingEnquiry(null);
      fetchVendorEnquiries();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // Admin Verification Toggle
  const handleToggleVerification = async (vendorId, currentStatus) => {
    const nextStatus = currentStatus === "Verified" ? "Suspended" : "Verified";
    try {
      const res = await fetch(
        `${API_BASE}/api/bhandari/admin/vendors/${vendorId}/verify`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        }
      );
      if (res.ok) {
        fetchVendors();
        fetchAdminStats();
      }
    } catch (err) {
      console.error("Admin verify toggle failed:", err);
    }
  };

  return (
    <div className="bhandari-container">
      {/* Top Hero Banner */}
      <div className="bhandari-hero">
        <div className="hero-content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div className="hero-badge">
              <Flame size={14} color="#f59e0b" />
              <span>TRADITIONAL INDIAN COOKING & BHANDARI TEAMS</span>
            </div>
            {onBackHome && (
              <button
                type="button"
                className="outline-sm-btn"
                onClick={onBackHome}
                style={{ background: "rgba(255,255,255,0.15)", color: "#ffffff", borderColor: "rgba(255,255,255,0.3)", marginBottom: 12 }}
              >
                ← Back to Services
              </button>
            )}
          </div>
          <h1>Bhandari, Maharaj & Halwai Discovery & Booking</h1>
          <p>
            Book authentic master chefs for royal Marwadi feasts, Banarasi bhandaras, Awadhi royal kormas,
            live tandoori stations, and traditional wedding halwai sweets.
          </p>

          <div className="hero-metrics">
            <div className="metric-item">
              <ShieldCheck size={18} color="#22c55e" />
              <span>100% Background Verified Maharaj</span>
            </div>
            <div className="metric-item">
              <UtensilsCrossed size={18} color="#f59e0b" />
              <span>Authentic Regional Cuisines</span>
            </div>
            <div className="metric-item">
              <FileText size={18} color="#3b82f6" />
              <span>Itemized Quotations & Clear Checklists</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="alert-box success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg("")}>✕</button>
        </div>
      )}

      {errorMsg && (
        <div className="alert-box error">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg("")}>✕</button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="bhandari-nav-tabs">
        <button
          className={activeTab === "discovery" ? "nav-tab active" : "nav-tab"}
          onClick={() => setActiveTab("discovery")}
        >
          <Search size={16} /> Discover Cooking Teams ({vendors.length})
        </button>
        <button
          className={activeTab === "enquiries" ? "nav-tab active" : "nav-tab"}
          onClick={() => setActiveTab("enquiries")}
        >
          <FileText size={16} /> My Enquiries & Quotes ({myEnquiries.length})
        </button>
        <button
          className={activeTab === "bookings" ? "nav-tab active" : "nav-tab"}
          onClick={() => setActiveTab("bookings")}
        >
          <Calendar size={16} /> Confirmed Bookings ({myBookings.length})
        </button>
        <button
          className={activeTab === "vendor_portal" ? "nav-tab active" : "nav-tab"}
          onClick={() => setActiveTab("vendor_portal")}
        >
          <ChefHat size={16} /> Maharaj / Vendor Portal
        </button>
        {adminData && (
          <button
            className={activeTab === "admin" ? "nav-tab active admin-tab" : "nav-tab admin-tab"}
            onClick={() => setActiveTab("admin")}
          >
            <ShieldCheck size={16} /> Admin Portal
          </button>
        )}
      </div>

      {/* ==================================================== */}
      {/* TAB 1: DISCOVERY & SEARCH                            */}
      {/* ==================================================== */}
      {activeTab === "discovery" && (
        <div className="discovery-section">
          {/* Search Filter Bar */}
          <div className="search-filter-card">
            <div className="filter-row-top">
              <div className="search-input-wrap">
                <Search size={18} color="#842d43" />
                <input
                  type="text"
                  placeholder="Search by team name, master chef, specialty dish, or location..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              <div className="filter-item">
                <MapPin size={16} color="#777" />
                <input
                  type="text"
                  placeholder="City (e.g. Mumbai, Varanasi, Delhi, Ahmedabad)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
              </div>

              <div className="filter-item">
                <Calendar size={16} color="#777" />
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  title="Check date availability"
                />
              </div>
            </div>

            <div className="filter-row-bottom">
              <div className="filter-select-group">
                <label>Cuisine:</label>
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                >
                  {CUISINE_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-select-group">
                <label>Team Type:</label>
                <select
                  value={selectedTeamType}
                  onChange={(e) => setSelectedTeamType(e.target.value)}
                >
                  {TEAM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-select-group">
                <label>Service:</label>
                <select
                  value={selectedServiceType}
                  onChange={(e) => setSelectedServiceType(e.target.value)}
                >
                  {SERVICE_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-select-group">
                <label>Guests:</label>
                <input
                  type="number"
                  placeholder="Min Guests"
                  value={guestCountFilter}
                  onChange={(e) => setGuestCountFilter(e.target.value)}
                  style={{ width: 95 }}
                />
              </div>

              <div className="filter-select-group">
                <label>Max Budget:</label>
                <input
                  type="number"
                  placeholder="₹ Max Rate/day"
                  value={maxBudgetFilter}
                  onChange={(e) => setMaxBudgetFilter(e.target.value)}
                  style={{ width: 110 }}
                />
              </div>

              <label className="checkbox-filter">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                />
                <span>Verified Only</span>
              </label>

              {(searchCity ||
                selectedCuisine !== "All" ||
                selectedTeamType !== "All" ||
                searchDate ||
                searchKeyword ||
                guestCountFilter ||
                maxBudgetFilter ||
                verifiedOnly) && (
                <button
                  className="reset-filter-btn"
                  onClick={() => {
                    setSearchCity("");
                    setSelectedCuisine("All");
                    setSelectedTeamType("All");
                    setSelectedServiceType("All");
                    setSearchDate("");
                    setSearchKeyword("");
                    setGuestCountFilter("");
                    setMaxBudgetFilter("");
                    setVerifiedOnly(false);
                  }}
                >
                  <RotateCcw size={13} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Vendors Grid */}
          {loading ? (
            <div className="loading-state">
              <ChefHat size={36} className="spin-anim" />
              <p>Finding traditional cooking teams and Maharaj masters...</p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="empty-state-card">
              <ChefHat size={48} color="#941b45" style={{ opacity: 0.6 }} />
              <h3>No Cooking Teams Found</h3>
              <p>Try broadening your search city, cuisine preference, or date filters.</p>
              <button
                className="primary-sm-btn"
                onClick={() => {
                  setSearchCity("");
                  setSelectedCuisine("All");
                  setSelectedTeamType("All");
                  setSearchDate("");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="vendors-grid">
              {vendors.map((vendor) => (
                <div className="vendor-card" key={vendor._id}>
                  <div className="vendor-card-header">
                    <div>
                      <span className="vendor-type-pill">{vendor.teamType}</span>
                      {vendor.verificationStatus === "Verified" && (
                        <span className="verified-pill">
                          <ShieldCheck size={12} /> Verified Team
                        </span>
                      )}
                    </div>
                    <div className="rating-pill">
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                      <strong>{vendor.ratingAverage.toFixed(1)}</strong>
                      <span>({vendor.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="vendor-title">{vendor.teamName}</h3>
                  <div className="vendor-owner-line">
                    Lead Master: <strong>{vendor.ownerName}</strong> · {vendor.experienceYears} Years Exp
                  </div>

                  <p className="vendor-desc">{vendor.description}</p>

                  <div className="vendor-info-tags">
                    <span className="info-tag">
                      <MapPin size={12} /> {vendor.city} ({vendor.serviceAreas?.slice(0, 2).join(", ")})
                    </span>
                    <span className="info-tag">
                      <Users size={12} /> Capacity: {vendor.guestCapacity?.min} - {vendor.guestCapacity?.max} Guests
                    </span>
                    <span className="info-tag">
                      <ChefHat size={12} /> Staff: {vendor.cookCount} Cooks + {vendor.helperCount} Helpers
                    </span>
                  </div>

                  {/* Speciality Cuisines */}
                  <div className="cuisines-row">
                    {vendor.cuisineSpecializations?.map((c) => (
                      <span key={c} className="cuisine-badge">
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Signature Dishes */}
                  {vendor.specialtyDishes?.length > 0 && (
                    <div className="dishes-preview">
                      <small>Signature Dishes:</small>
                      <p>{vendor.specialtyDishes.slice(0, 3).join(" • ")}</p>
                    </div>
                  )}

                  <div className="vendor-card-footer">
                    <div className="pricing-box">
                      <span className="price-label">Starting From</span>
                      <strong className="price-value">{money(vendor.pricing?.baseDailyRate)}</strong>
                      <span className="price-unit">/ event day</span>
                    </div>

                    <div className="vendor-actions">
                      <button
                        className="outline-sm-btn"
                        onClick={() => setSelectedVendor(vendor)}
                      >
                        View Profile
                      </button>
                      <button
                        className="primary-sm-btn"
                        onClick={() => {
                          setEnquiryModalVendor(vendor);
                          setEnquiryForm((prev) => ({
                            ...prev,
                            city: vendor.city,
                            cuisines: vendor.cuisineSpecializations.slice(0, 2),
                            requestedCooks: vendor.cookCount,
                            requestedHelpers: vendor.helperCount,
                            budget: vendor.pricing?.baseDailyRate || 35000,
                          }));
                        }}
                      >
                        Request Quote <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: MY ENQUIRIES & QUOTATIONS                     */}
      {/* ==================================================== */}
      {activeTab === "enquiries" && (
        <div className="my-enquiries-section">
          <div className="section-title-row">
            <h2>Your Cooking Team Enquiries</h2>
            <p>Track responses from Maharaj teams and review itemized quotations.</p>
          </div>

          {myEnquiries.length === 0 ? (
            <div className="empty-state-card">
              <FileText size={44} color="#842d43" style={{ opacity: 0.5 }} />
              <h3>No Enquiries Yet</h3>
              <p>Browse cooking teams in the Discovery tab and click "Request Quote".</p>
              <button className="primary-sm-btn" onClick={() => setActiveTab("discovery")}>
                Browse Cooking Teams
              </button>
            </div>
          ) : (
            <div className="enquiries-list">
              {myEnquiries.map((enq) => (
                <div className="enquiry-card" key={enq._id}>
                  <div className="enquiry-header">
                    <div>
                      <span className={`status-pill ${enq.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                        {enq.status}
                      </span>
                      <h3>{enq.vendor?.teamName || "Cooking Team"}</h3>
                    </div>
                    <div className="enquiry-date">
                      <Calendar size={14} /> Event: <strong>{enq.eventDate}</strong>
                    </div>
                  </div>

                  <div className="enquiry-details-grid">
                    <div>
                      <strong>Event Type:</strong> {enq.eventType}
                    </div>
                    <div>
                      <strong>Location:</strong> {enq.eventLocation || enq.city}
                    </div>
                    <div>
                      <strong>Guest Count:</strong> {enq.guestCount} Guests
                    </div>
                    <div>
                      <strong>Staff Requested:</strong> {enq.requestedCooks} Cooks, {enq.requestedHelpers} Helpers
                    </div>
                    <div>
                      <strong>Cuisines:</strong> {enq.cuisines?.join(", ")}
                    </div>
                    <div>
                      <strong>Service Type:</strong> {enq.serviceType}
                    </div>
                  </div>

                  {enq.specialRequirements && (
                    <div className="special-req-note">
                      <strong>Notes:</strong> {enq.specialRequirements}
                    </div>
                  )}

                  <div className="enquiry-footer">
                    <span className="enquiry-id">ID: {enq._id}</span>
                    <button
                      className="primary-sm-btn"
                      onClick={() => handleViewQuotations(enq)}
                    >
                      <FileText size={14} /> View Quotations & Breakdown
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: CONFIRMED BOOKINGS                            */}
      {/* ==================================================== */}
      {activeTab === "bookings" && (
        <div className="my-bookings-section">
          <div className="section-title-row">
            <h2>Your Confirmed Cooking Bookings</h2>
            <p>Direct schedule and coordination details for your event cooking teams.</p>
          </div>

          {myBookings.length === 0 ? (
            <div className="empty-state-card">
              <Calendar size={44} color="#842d43" style={{ opacity: 0.5 }} />
              <h3>No Confirmed Bookings</h3>
              <p>Once you accept a quotation, your confirmed booking will appear here.</p>
              <button className="primary-sm-btn" onClick={() => setActiveTab("enquiries")}>
                Check Enquiries & Quotes
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              {myBookings.map((b) => (
                <div className="booking-card" key={b._id}>
                  <div className="booking-card-top">
                    <div>
                      <span className={`booking-status-pill ${b.bookingStatus?.toLowerCase().replace(/\s+/g, "-")}`}>
                        <CheckCircle2 size={13} /> {b.bookingStatus}
                      </span>
                      <h3>{b.vendor?.teamName}</h3>
                      <p className="booking-sub">
                        Master: <strong>{b.vendor?.ownerName}</strong> · Phone: {b.vendor?.publicPhone || "+91 98201 45678"}
                      </p>
                    </div>

                    <div className="booking-amount-box">
                      <span className="label">Agreed Booking Total</span>
                      <strong className="amt">{money(b.agreedAmount)}</strong>
                      <span className="advance-tag">Advance Paid: {money(b.advancePaid)}</span>
                    </div>
                  </div>

                  <div className="booking-meta-row">
                    <div>
                      <Calendar size={14} /> Date: <strong>{b.eventDate}</strong>
                    </div>
                    <div>
                      <Users size={14} /> Guests: <strong>{b.guestCount}</strong>
                    </div>
                    <div>
                      <ShieldCheck size={14} color="#22c55e" /> Payment: <strong>{b.paymentStatus}</strong>
                    </div>
                  </div>

                  {b.bookingStatus === "Confirmed" && (
                    <div className="booking-actions-row">
                      <span className="booking-ready-msg">
                        ✓ Booking locked on vendor schedule. The head chef will coordinate 48h prior.
                      </span>
                      <button
                        className="outline-sm-btn"
                        onClick={() => {
                          setReviewBooking(b);
                          setReviewRating(5);
                        }}
                      >
                        <Star size={13} /> Write Review / Rating
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: VENDOR / MAHARAJ PORTAL                       */}
      {/* ==================================================== */}
      {activeTab === "vendor_portal" && (
        <div className="vendor-portal-section">
          <div className="section-title-row">
            <h2>Maharaj & Cooking Team Vendor Portal</h2>
            <p>Review customer event requests and issue itemized quotations with equipment and labour breakdown.</p>
          </div>

          <div className="vendor-portal-grid">
            {/* Incoming Enquiries */}
            <div className="portal-column">
              <h3><FileText size={18} /> Incoming Customer Enquiries ({vendorEnquiries.length})</h3>
              {vendorEnquiries.length === 0 ? (
                <div className="empty-panel">
                  <p>No new customer enquiries pending response.</p>
                </div>
              ) : (
                <div className="portal-enquiry-list">
                  {vendorEnquiries.map((enq) => (
                    <div
                      key={enq._id}
                      className={quotingEnquiry?._id === enq._id ? "portal-enq-card active" : "portal-enq-card"}
                    >
                      <div className="portal-enq-header">
                        <strong>{enq.eventType} · {enq.guestCount} Guests</strong>
                        <span className="enq-date">{enq.eventDate}</span>
                      </div>
                      <p>
                        Client: {enq.customerName} ({enq.customerPhone || "Host"}) · Location: {enq.city}
                      </p>
                      <small>Cuisines: {enq.cuisines?.join(", ")}</small>
                      <div className="portal-enq-actions">
                        <button
                          className="primary-sm-btn"
                          onClick={() => setQuotingEnquiry(enq)}
                        >
                          Build Quotation <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quotation Builder Column */}
            <div className="portal-column">
              <h3><IndianRupee size={18} /> Itemized Quotation Builder</h3>
              {quotingEnquiry ? (
                <form className="quotation-builder-form" onSubmit={handleCreateQuotation}>
                  <div className="quoting-banner">
                    Creating Quote for: <strong>{quotingEnquiry.customerName}</strong> ({quotingEnquiry.eventDate} · {quotingEnquiry.guestCount} Guests)
                  </div>

                  <div className="line-items-table">
                    <div className="line-item-head">
                      <span>Description</span>
                      <span>Qty</span>
                      <span>Rate (₹)</span>
                      <span>Amount</span>
                      <span></span>
                    </div>

                    {quoteLineItems.map((item, idx) => (
                      <div className="line-item-row" key={idx}>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setQuoteLineItems((prev) =>
                              prev.map((li, i) => (i === idx ? { ...li, description: val } : li))
                            );
                          }}
                        />
                        <input
                          type="number"
                          min="1"
                          style={{ width: 60 }}
                          value={item.quantity}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 1;
                            setQuoteLineItems((prev) =>
                              prev.map((li, i) => (i === idx ? { ...li, quantity: val } : li))
                            );
                          }}
                        />
                        <input
                          type="number"
                          min="0"
                          style={{ width: 80 }}
                          value={item.rate}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setQuoteLineItems((prev) =>
                              prev.map((li, i) => (i === idx ? { ...li, rate: val } : li))
                            );
                          }}
                        />
                        <span className="line-amt">
                          {money(Number(item.quantity) * Number(item.rate))}
                        </span>
                        <button
                          type="button"
                          className="del-row-btn"
                          onClick={() =>
                            setQuoteLineItems((prev) => prev.filter((_, i) => i !== idx))
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="outline-sm-btn"
                    style={{ margin: "10px 0" }}
                    onClick={() =>
                      setQuoteLineItems((prev) => [
                        ...prev,
                        {
                          description: "Custom Kitchen Service",
                          category: "Other",
                          quantity: 1,
                          unit: "Day",
                          rate: 2000,
                          amount: 2000,
                        },
                      ])
                    }
                  >
                    <Plus size={14} /> Add Line Item
                  </button>

                  <div className="quotation-financials-card">
                    <div className="fin-row">
                      <span>Labour & Services Subtotal:</span>
                      <strong>{money(quoteSubtotal)}</strong>
                    </div>
                    <div className="fin-row">
                      <span>Transportation / Logistics (₹):</span>
                      <input
                        type="number"
                        min="0"
                        value={quoteTransport}
                        onChange={(e) => setQuoteTransport(e.target.value)}
                      />
                    </div>
                    <div className="fin-row">
                      <span>Discount (₹):</span>
                      <input
                        type="number"
                        min="0"
                        value={quoteDiscount}
                        onChange={(e) => setQuoteDiscount(e.target.value)}
                      />
                    </div>
                    <div className="fin-row">
                      <span>Taxes / GST (%):</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          style={{ width: 55 }}
                          value={quoteTaxPct}
                          onChange={(e) => setQuoteTaxPct(Number(e.target.value) || 0)}
                        />
                        <strong>{money(quoteTaxAmount)}</strong>
                      </div>
                    </div>
                    <div className="fin-total-row">
                      <span>Final Quoted Total:</span>
                      <strong className="grand-val">{money(quoteGrandTotal)}</strong>
                    </div>
                    <div className="fin-row">
                      <span>Advance Required (%):</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          style={{ width: 55 }}
                          value={quoteAdvPct}
                          onChange={(e) => setQuoteAdvPct(Number(e.target.value) || 0)}
                        />
                        <strong style={{ color: "#22c55e" }}>{money(quoteAdvance)}</strong>
                      </div>
                    </div>
                    <div className="fin-row">
                      <span>Remaining Balance:</span>
                      <strong>{money(quoteBalance)}</strong>
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 700 }}>Terms & Payment Schedule:</label>
                    <textarea
                      rows={2}
                      value={quoteTerms}
                      onChange={(e) => setQuoteTerms(e.target.value)}
                      style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                    />
                  </div>

                  <button type="submit" className="primary-btn" style={{ width: "100%", marginTop: 14 }}>
                    <Send size={15} /> Send Quotation to Customer
                  </button>
                </form>
              ) : (
                <div className="empty-panel">
                  <p>Select an enquiry from the left column to build a detailed quotation.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: ADMIN PORTAL                                  */}
      {/* ==================================================== */}
      {activeTab === "admin" && (
        <div className="admin-portal-section">
          <div className="section-title-row">
            <h2>Milap Admin — Cooking Team Moderation & Verifications</h2>
            <p>Oversee registered traditional Maharaj, Halwai teams, and manage platform safety.</p>
          </div>

          {adminStats && (
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <span>Total Registered Teams</span>
                <strong>{adminStats.totalVendors}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Verified Active Teams</span>
                <strong style={{ color: "#22c55e" }}>{adminStats.verifiedVendors}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Active Enquiries</span>
                <strong style={{ color: "#3b82f6" }}>{adminStats.activeEnquiries}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Confirmed Bookings</span>
                <strong style={{ color: "#842d43" }}>{adminStats.confirmedBookings}</strong>
              </div>
            </div>
          )}

          <div className="admin-vendor-table-card">
            <h3>Registered Cooking Teams Management</h3>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Team Name</th>
                    <th>Head Master</th>
                    <th>City</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v) => (
                    <tr key={v._id}>
                      <td>
                        <strong>{v.teamName}</strong>
                      </td>
                      <td>{v.ownerName}</td>
                      <td>{v.city}</td>
                      <td>
                        {v.guestCapacity?.min} - {v.guestCapacity?.max}
                      </td>
                      <td>
                        <span className={`status-pill ${v.verificationStatus?.toLowerCase()}`}>
                          {v.verificationStatus}
                        </span>
                      </td>
                      <td>
                        <button
                          className={v.verificationStatus === "Verified" ? "outline-sm-btn" : "primary-sm-btn"}
                          onClick={() => handleToggleVerification(v._id, v.verificationStatus)}
                        >
                          {v.verificationStatus === "Verified" ? "Suspend" : "Verify & Approve"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 1: VENDOR DETAIL & PORTFOLIO                   */}
      {/* ==================================================== */}
      {selectedVendor && (
        <div className="modal-backdrop" onClick={() => setSelectedVendor(null)}>
          <div className="vendor-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="vendor-type-pill">{selectedVendor.teamType}</span>
                <h2>{selectedVendor.teamName}</h2>
                <p>Lead Master: {selectedVendor.ownerName} · {selectedVendor.experienceYears} Years Traditional Experience</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedVendor(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body-scroll">
              <div className="modal-info-box">
                <h4>About Cooking Team:</h4>
                <p>{selectedVendor.description}</p>
              </div>

              <div className="modal-meta-grid">
                <div>
                  <strong>Primary Location:</strong> {selectedVendor.city}
                </div>
                <div>
                  <strong>Service Areas:</strong> {selectedVendor.serviceAreas?.join(", ")}
                </div>
                <div>
                  <strong>Guest Capacity:</strong> {selectedVendor.guestCapacity?.min} to {selectedVendor.guestCapacity?.max} Guests
                </div>
                <div>
                  <strong>Standard Crew:</strong> {selectedVendor.cookCount} Master Cooks + {selectedVendor.helperCount} Helpers
                </div>
                <div>
                  <strong>Starting Daily Rate:</strong> {money(selectedVendor.pricing?.baseDailyRate)}
                </div>
                <div>
                  <strong>Rating:</strong> ★ {selectedVendor.ratingAverage} ({selectedVendor.reviewCount} Reviews)
                </div>
              </div>

              <div className="modal-section">
                <h4>Signature Wedding Specialities:</h4>
                <div className="dishes-chips">
                  {selectedVendor.specialtyDishes?.map((d) => (
                    <span key={d} className="dish-chip">
                      <Sparkles size={12} color="#f59e0b" /> {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <h4>Equipment Provided by Team:</h4>
                <ul className="equipment-list">
                  {selectedVendor.equipmentSupplied?.map((eq) => (
                    <li key={eq}>
                      <Check size={14} color="#22c55e" /> {eq}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h4>Raw Material & Grocery Arrangement:</h4>
                <p className="arr-note">{selectedVendor.ingredientArrangements}</p>
              </div>

              <div className="modal-section">
                <h4>Cancellation & Refund Policy:</h4>
                <p className="arr-note">{selectedVendor.cancellationPolicy}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="outline-btn" onClick={() => setSelectedVendor(null)}>
                Close
              </button>
              <button
                className="primary-btn"
                onClick={() => {
                  setEnquiryModalVendor(selectedVendor);
                  setEnquiryForm((prev) => ({
                    ...prev,
                    city: selectedVendor.city,
                    cuisines: selectedVendor.cuisineSpecializations.slice(0, 2),
                    requestedCooks: selectedVendor.cookCount,
                    requestedHelpers: selectedVendor.helperCount,
                    budget: selectedVendor.pricing?.baseDailyRate || 35000,
                  }));
                  setSelectedVendor(null);
                }}
              >
                Send Service Enquiry <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: SERVICE ENQUIRY & RESPONSIBILITY CHECKLIST  */}
      {/* ==================================================== */}
      {enquiryModalVendor && (
        <div className="modal-backdrop" onClick={() => setEnquiryModalVendor(null)}>
          <div className="enquiry-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Request Quotation & Event Availability</h2>
                <p>Team: <strong>{enquiryModalVendor.teamName}</strong> ({enquiryModalVendor.city})</p>
              </div>
              <button className="close-btn" onClick={() => setEnquiryModalVendor(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateEnquiry} className="enquiry-form-scroll">
              {/* Event Basic Details */}
              <div className="form-section-title">
                <Calendar size={16} /> 1. Event Schedule & Location
              </div>

              <div className="form-grid-2">
                <div>
                  <label>Event Type:</label>
                  <select
                    value={enquiryForm.eventType}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, eventType: e.target.value })}
                  >
                    <option value="Wedding">Wedding (विवाह)</option>
                    <option value="Engagement / Ring Ceremony">Engagement / Ring Ceremony (सगाई)</option>
                    <option value="Sangeet / Mehendi">Sangeet / Mehendi (संगीत व मेहंदी)</option>
                    <option value="Reception">Reception (प्रीतिभोज)</option>
                    <option value="Religious Function / Katha">Religious Function / Katha (कथा व भंडारा)</option>
                    <option value="Birthday / Anniversary">Birthday / Anniversary</option>
                    <option value="Other">Other Celebration</option>
                  </select>
                </div>

                <div>
                  <label>Event Date (तारीख): *</label>
                  <input
                    type="date"
                    required
                    value={enquiryForm.eventDate}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, eventDate: e.target.value })}
                  />
                </div>

                <div>
                  <label>City & Service Area:</label>
                  <input
                    type="text"
                    required
                    value={enquiryForm.city}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, city: e.target.value })}
                  />
                </div>

                <div>
                  <label>Venue / Event Location Address:</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Marwar Palace Banquet Hall, Borivali"
                    value={enquiryForm.eventLocation}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, eventLocation: e.target.value })}
                  />
                </div>
              </div>

              {/* Scale & Staffing */}
              <div className="form-section-title">
                <Users size={16} /> 2. Guest Count & Staffing Requirement
              </div>

              <div className="form-grid-3">
                <div>
                  <label>Total Guests (मेहमान):</label>
                  <input
                    type="number"
                    min="1"
                    max={enquiryModalVendor.guestCapacity?.max || 5000}
                    value={enquiryForm.guestCount}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, guestCount: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label>Cooks Required (कारीगर):</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={enquiryForm.requestedCooks}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, requestedCooks: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label>Helpers Required (हेल्पर):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={enquiryForm.requestedHelpers}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, requestedHelpers: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Service Type */}
              <div className="form-grid-2" style={{ marginTop: 12 }}>
                <div>
                  <label>Service Type:</label>
                  <select
                    value={enquiryForm.serviceType}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, serviceType: e.target.value })}
                  >
                    {SERVICE_TYPES.filter((s) => s !== "All").map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Target Budget (₹):</label>
                  <input
                    type="number"
                    min="0"
                    value={enquiryForm.budget}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, budget: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Responsibility Checklist: Ingredients */}
              <div className="form-section-title">
                <UtensilsCrossed size={16} /> 3. Raw Material & Ingredients Responsibility Checklist
              </div>
              <p className="checklist-sub">Specify who will procure and supply each raw ingredient item:</p>

              <div className="checklist-grid">
                {INGREDIENT_ITEMS.map((item) => (
                  <div className="checklist-row" key={item.id}>
                    <span className="chk-label">{item.label}</span>
                    <select
                      value={enquiryForm.ingredientResponsibilities[item.id] || "Supplied by customer"}
                      onChange={(e) =>
                        setEnquiryForm({
                          ...enquiryForm,
                          ingredientResponsibilities: {
                            ...enquiryForm.ingredientResponsibilities,
                            [item.id]: e.target.value,
                          },
                        })
                      }
                    >
                      {RESPONSIBILITY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Responsibility Checklist: Equipment */}
              <div className="form-section-title" style={{ marginTop: 18 }}>
                <Flame size={16} /> 4. Cooking Equipment, Fuel & Bhatti Checklist
              </div>
              <p className="checklist-sub">Clarify who brings cooking bhattis, LPG cylinders, and utensils:</p>

              <div className="checklist-grid">
                {EQUIPMENT_ITEMS.map((item) => (
                  <div className="checklist-row" key={item.id}>
                    <span className="chk-label">{item.label}</span>
                    <select
                      value={enquiryForm.equipmentResponsibilities[item.id] || "Supplied by vendor"}
                      onChange={(e) =>
                        setEnquiryForm({
                          ...enquiryForm,
                          equipmentResponsibilities: {
                            ...enquiryForm.equipmentResponsibilities,
                            [item.id]: e.target.value,
                          },
                        })
                      }
                    >
                      {RESPONSIBILITY_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div style={{ marginTop: 16 }}>
                <label>Special Instructions & Menu Preferences:</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Satvik Jain food required for 50 people, live Jalebi station timing from 7:00 PM to 10:00 PM..."
                  value={enquiryForm.specialRequirements}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, specialRequirements: e.target.value })}
                />
              </div>

              <div className="modal-footer" style={{ marginTop: 20 }}>
                <button type="button" className="outline-btn" onClick={() => setEnquiryModalVendor(null)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  <Send size={15} /> Submit Enquiry & Get Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 3: VIEW QUOTATIONS & ACCEPT                    */}
      {/* ==================================================== */}
      {viewingQuotationsEnquiry && (
        <div className="modal-backdrop" onClick={() => setViewingQuotationsEnquiry(null)}>
          <div className="quotation-viewer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Quotations for Event on {viewingQuotationsEnquiry.eventDate}</h2>
                <p>
                  Team: <strong>{viewingQuotationsEnquiry.vendor?.teamName}</strong> ({viewingQuotationsEnquiry.guestCount} Guests)
                </p>
              </div>
              <button className="close-btn" onClick={() => setViewingQuotationsEnquiry(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body-scroll">
              {availableQuotations.length === 0 ? (
                <div className="empty-panel">
                  <Clock size={36} color="#f59e0b" style={{ margin: "0 auto 10px" }} />
                  <h4>Quotation Pending</h4>
                  <p>
                    The cooking team has received your enquiry and is calculating ingredient and labour line items.
                    You will see their official breakdown here shortly.
                  </p>
                </div>
              ) : (
                <div className="quotations-list">
                  {availableQuotations.map((quote) => (
                    <div className="quote-display-card" key={quote._id}>
                      <div className="quote-top">
                        <div>
                          <span className={`status-pill ${quote.status?.toLowerCase()}`}>{quote.status}</span>
                          <h4>Official Itemized Quotation</h4>
                          <small>Quotation ID: {quote._id}</small>
                        </div>
                        <div className="quote-grand">
                          <span className="lbl">Total Quoted Amount</span>
                          <strong className="amt">{money(quote.totalAmount)}</strong>
                          <span className="advance-pill">Advance: {money(quote.advanceAmount)} ({quote.advancePercentage}%)</span>
                        </div>
                      </div>

                      {/* Line Items Table */}
                      <table className="quote-items-table">
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Qty</th>
                            <th>Rate (₹)</th>
                            <th style={{ textAlign: "right" }}>Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quote.lineItems?.map((li, i) => (
                            <tr key={i}>
                              <td>
                                <strong>{li.description}</strong>
                              </td>
                              <td>{li.category}</td>
                              <td>
                                {li.quantity} {li.unit}
                              </td>
                              <td>₹{li.rate}</td>
                              <td style={{ textAlign: "right", fontWeight: 700 }}>{money(li.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Financial Breakdown */}
                      <div className="quote-fin-summary">
                        <div className="fin-line">
                          <span>Subtotal:</span>
                          <strong>{money(quote.subtotal)}</strong>
                        </div>
                        {quote.transportCharges > 0 && (
                          <div className="fin-line">
                            <span>Transportation / Logistics:</span>
                            <strong>+{money(quote.transportCharges)}</strong>
                          </div>
                        )}
                        {quote.discountAmount > 0 && (
                          <div className="fin-line">
                            <span>Special Event Discount:</span>
                            <strong style={{ color: "#22c55e" }}>-{money(quote.discountAmount)}</strong>
                          </div>
                        )}
                        {quote.taxAmount > 0 && (
                          <div className="fin-line">
                            <span>Taxes ({quote.taxPercentage}%):</span>
                            <strong>+{money(quote.taxAmount)}</strong>
                          </div>
                        )}
                        <div className="fin-line-total">
                          <span>Total Payable Amount:</span>
                          <strong>{money(quote.totalAmount)}</strong>
                        </div>
                        <div className="fin-line">
                          <span>Remaining Balance on Event Day:</span>
                          <strong>{money(quote.balanceAmount)}</strong>
                        </div>
                      </div>

                      <div className="quote-terms-box">
                        <strong>Terms & Conditions:</strong>
                        <p>{quote.terms}</p>
                      </div>

                      {quote.status === "Active" && (
                        <div className="quote-action-bar">
                          <button
                            className="primary-btn"
                            onClick={() => handleAcceptQuotation(quote._id)}
                          >
                            <CheckCircle2 size={16} /> Accept Quotation & Confirm Booking
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 4: SUBMIT REVIEW                               */}
      {/* ==================================================== */}
      {reviewBooking && (
        <div className="modal-backdrop" onClick={() => setReviewBooking(null)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Rate & Review Cooking Team</h2>
                <p>Team: <strong>{reviewBooking.vendor?.teamName}</strong></p>
              </div>
              <button className="close-btn" onClick={() => setReviewBooking(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} style={{ padding: 20 }}>
              <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>
                Rating (1 to 5 Stars):
              </label>
              <div className="star-rating-select">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className="star-btn"
                    onClick={() => setReviewRating(star)}
                  >
                    <Star
                      size={24}
                      fill={star <= reviewRating ? "#f59e0b" : "none"}
                      color="#f59e0b"
                    />
                  </button>
                ))}
              </div>

              <label style={{ display: "block", fontWeight: 700, margin: "14px 0 6px" }}>
                Your Experience & Food Taste Review:
              </label>
              <textarea
                rows={4}
                required
                placeholder="How was the food taste, halwai discipline, cleanliness, and guest satisfaction?..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
              />

              <div className="modal-footer" style={{ marginTop: 20 }}>
                <button type="button" className="outline-btn" onClick={() => setReviewBooking(null)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Submit Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
