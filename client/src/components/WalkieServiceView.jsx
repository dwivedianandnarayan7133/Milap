import { useState, useEffect, useMemo } from "react";
import {
  Radio,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Battery,
  Zap,
  Users,
  MapPin,
  Calendar,
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
  QrCode,
  RotateCcw,
  FileText,
  Activity,
} from "lucide-react";
import { API_BASE } from "../apiConfig";
import "./WalkieServiceView.css";

const CATEGORIES = [
  "All",
  "Professional Digital Radios",
  "Standard Two-Way Radios",
  "Headset & Earpiece Kits",
  "Speaker Microphones",
  "Chargers & Stations",
  "Spare Batteries",
];

const RADIO_TYPES = [
  "All",
  "Digital DMR",
  "Analog",
  "Hybrid (Analog/Digital)",
  "Accessory / Infrastructure",
];

const EVENT_TYPES = [
  "Wedding",
  "Reception",
  "Sangeet & Mehendi",
  "Corporate Event / Conference",
  "Concert & Music Festival",
  "Exhibition & Trade Show",
  "Security & Crowd Management",
  "Other Celebration",
];

const VENUE_TYPES = [
  "Indoor Banquet / Hotel",
  "Outdoor Lawn / Ground",
  "Multi-Floor Complex",
  "Hybrid Indoor & Outdoor",
];

const CREW_GROUPS = [
  "Stage & Program Management",
  "Security & Crowd Control",
  "Hospitality & VIP Coordination",
  "Parking & Valet Logistics",
  "Food & Catering Coordination",
  "Technical & AV Production",
  "Emergency & Medical Response",
  "General Event Crew",
];

export default function WalkieServiceView({
  authData,
  adminData,
  onOpenAuth,
  onBackHome,
}) {
  const [activeTab, setActiveTab] = useState("discovery"); // discovery | calculator | enquiries | bookings | vendor_portal | admin
  const [equipmentList, setEquipmentList] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Discovery Filters
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [maxRateFilter, setMaxRateFilter] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Modals
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [enquiryModalItem, setEnquiryModalItem] = useState(null);
  const [viewingQuotationsEnquiry, setViewingQuotationsEnquiry] = useState(null);
  const [availableQuotations, setAvailableQuotations] = useState([]);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // Customer Data
  const [myEnquiries, setMyEnquiries] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  // Vendor Portal State
  const [vendorEnquiries, setVendorEnquiries] = useState([]);
  const [quotingEnquiry, setQuotingEnquiry] = useState(null);
  const [quoteLineItems, setQuoteLineItems] = useState([
    { description: "Motorola Professional DMR Digital Two-Way Radios", category: "Radios", quantity: 10, durationDays: 2, rate: 300, amount: 6000 },
    { description: "Covert Acoustic Coil Earpiece Kits with Lapel Mic", category: "Headsets", quantity: 10, durationDays: 2, rate: 40, amount: 800 },
    { description: "Spare Li-ion 2400mAh Batteries (Charged)", category: "Batteries", quantity: 4, durationDays: 2, rate: 50, amount: 400 },
  ]);
  const [quoteDelivery, setQuoteDelivery] = useState(500);
  const [quoteTech, setQuoteTech] = useState(1500);
  const [quoteDiscount, setQuoteDiscount] = useState(500);
  const [quoteTaxPct, setQuoteTaxPct] = useState(18);
  const [quoteDeposit, setQuoteDeposit] = useState(5000);
  const [quoteAdvPct, setQuoteAdvPct] = useState(30);

  // Scanner State (in Vendor Portal)
  const [scanTokenInput, setScanTokenInput] = useState("");
  const [scannedResult, setScannedResult] = useState(null);
  const [scanActionNotes, setScanActionNotes] = useState("");

  // Team Channel Assignment in Booking
  const [selectedBookingForChannel, setSelectedBookingForChannel] = useState(null);
  const [bookingAssignments, setBookingAssignments] = useState([]);
  const [newAssignmentGroup, setNewAssignmentGroup] = useState(CREW_GROUPS[0]);
  const [newAssignmentChannel, setNewAssignmentChannel] = useState(1);
  const [newAssignmentCount, setNewAssignmentCount] = useState(2);
  const [newAssignmentLead, setNewAssignmentLead] = useState("");
  const [newAssignmentPhone, setNewAssignmentPhone] = useState("");

  // Admin State
  const [adminStats, setAdminStats] = useState(null);

  // Interactive Rental Cost Calculator State
  const [calcRadios, setCalcRadios] = useState(12);
  const [calcDays, setCalcDays] = useState(2);
  const [calcRate, setCalcRate] = useState(280);
  const [calcHeadsets, setCalcHeadsets] = useState(12);
  const [calcHeadsetRate, setCalcHeadsetRate] = useState(40);
  const [calcBatteries, setCalcBatteries] = useState(6);
  const [calcBatteryRate, setCalcBatteryRate] = useState(50);
  const [calcChargers, setCalcChargers] = useState(2);
  const [calcChargerRate, setCalcChargerRate] = useState(120);
  const [calcDelivery, setCalcDelivery] = useState(500);
  const [calcTechnician, setCalcTechnician] = useState(1500);
  const [calcDiscount, setCalcDiscount] = useState(400);

  // Dynamic Calculator Result
  const calcResults = useMemo(() => {
    const radioTotal = calcRadios * calcDays * calcRate;
    const headsetTotal = calcHeadsets * calcDays * calcHeadsetRate;
    const batteryTotal = calcBatteries * calcDays * calcBatteryRate;
    const chargerTotal = calcChargers * calcDays * calcChargerRate;
    const equipSubtotal = radioTotal + headsetTotal + batteryTotal + chargerTotal;
    const logistics = Number(calcDelivery) + Number(calcTechnician);
    const taxable = Math.max(0, equipSubtotal + logistics - Number(calcDiscount));
    const gst = Math.round(taxable * 0.18);
    const rentalTotal = taxable + gst;
    const deposit = calcRadios * 500;
    const advance = Math.round(rentalTotal * 0.3);
    const balance = rentalTotal - advance;
    return {
      radioTotal,
      headsetTotal,
      batteryTotal,
      chargerTotal,
      equipSubtotal,
      taxable,
      gst,
      rentalTotal,
      deposit,
      advance,
      balance,
      totalWithDeposit: rentalTotal + deposit,
    };
  }, [
    calcRadios,
    calcDays,
    calcRate,
    calcHeadsets,
    calcHeadsetRate,
    calcBatteries,
    calcBatteryRate,
    calcChargers,
    calcChargerRate,
    calcDelivery,
    calcTechnician,
    calcDiscount,
  ]);

  // Enquiry Form State
  const [enquiryForm, setEnquiryForm] = useState({
    eventName: "",
    eventType: "Wedding",
    startDate: "",
    endDate: "",
    eventLocation: "",
    city: "Mumbai",
    venueType: "Indoor Banquet / Hotel",
    floorOrZonesCount: 2,
    coverageRequired: "1 - 3 km Radius / Banquet Grounds",
    radioCount: 10,
    headsetCount: 10,
    extraBatteryCount: 4,
    chargerCount: 2,
    categoryPreference: "Professional Digital Radios",
    deliveryPreference: "Vendor Delivery to Venue",
    technicalSupportRequired: true,
    budget: 12000,
    specialInstructions: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });

  const money = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  // Load Equipment
  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchCity) params.append("city", searchCity);
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (selectedType !== "All") params.append("radioType", selectedType);
      if (maxRateFilter) params.append("maxRate", maxRateFilter);
      if (searchKeyword) params.append("search", searchKeyword);
      if (verifiedOnly) params.append("verifiedOnly", "true");

      const res = await fetch(`${API_BASE}/api/walkie/equipment?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setEquipmentList(data.equipment || []);
      }
    } catch (err) {
      console.error("Failed to load equipment:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load Vendors
  const fetchVendors = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/walkie/vendors`);
      const data = await res.json();
      if (res.ok) setVendors(data.vendors || []);
    } catch (err) {
      console.error("Failed to load vendors:", err);
    }
  };

  // Customer Enquiries
  const fetchMyEnquiries = async () => {
    if (!authData?.token) return;
    try {
      const res = await fetch(`${API_BASE}/api/walkie/enquiries/my`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const data = await res.json();
      if (res.ok) setMyEnquiries(data);
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    }
  };

  // Customer Bookings
  const fetchMyBookings = async () => {
    if (!authData?.token) return;
    try {
      const res = await fetch(`${API_BASE}/api/walkie/bookings/my`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const data = await res.json();
      if (res.ok) setMyBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  // Vendor Enquiries
  const fetchVendorEnquiries = async () => {
    if (!authData?.token) return;
    try {
      const res = await fetch(`${API_BASE}/api/walkie/enquiries/vendor`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const data = await res.json();
      if (res.ok) setVendorEnquiries(data);
    } catch (err) {
      console.error("Failed to fetch vendor enquiries:", err);
    }
  };

  // Admin Stats
  const fetchAdminStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/walkie/admin/stats`);
      const data = await res.json();
      if (res.ok) setAdminStats(data);
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    }
  };

  useEffect(() => {
    fetchEquipment();
    fetchVendors();
  }, [searchCity, selectedCategory, selectedType, maxRateFilter, searchKeyword, verifiedOnly]);

  useEffect(() => {
    if (activeTab === "enquiries") fetchMyEnquiries();
    if (activeTab === "bookings") fetchMyBookings();
    if (activeTab === "vendor_portal") fetchVendorEnquiries();
    if (activeTab === "admin") {
      fetchAdminStats();
      fetchVendors();
    }
  }, [activeTab, authData]);

  // Enquiry submission
  const handleCreateEnquiry = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!authData?.token) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (!enquiryForm.startDate || !enquiryForm.endDate) {
      setErrorMsg("Please specify both event start date and end date.");
      return;
    }

    try {
      const payload = {
        ...enquiryForm,
        vendorId: enquiryModalItem?.vendor?._id || enquiryModalItem?.vendor || null,
      };

      const res = await fetch(`${API_BASE}/api/walkie/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Two-way radio rental enquiry submitted successfully! Vendors will issue formal itemized quotes.");
        setEnquiryModalItem(null);
        setActiveTab("enquiries");
        fetchMyEnquiries();
      } else {
        setErrorMsg(data.message || "Failed to submit enquiry.");
      }
    } catch {
      setErrorMsg("Network error occurred while submitting enquiry.");
    }
  };

  // View quotations for an enquiry
  const handleViewQuotations = async (enquiry) => {
    setViewingQuotationsEnquiry(enquiry);
    try {
      const res = await fetch(`${API_BASE}/api/walkie/quotations/enquiry/${enquiry._id}`);
      const data = await res.json();
      if (res.ok) setAvailableQuotations(data);
    } catch (err) {
      console.error("Failed to load quotations:", err);
    }
  };

  // Accept Quotation
  const handleAcceptQuotation = async (quotationId) => {
    if (!authData?.token) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_BASE}/api/walkie/quotations/${quotationId}/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`Quotation accepted! Booking confirmed under code ${data.booking?.bookingCode}. QR handover tokens generated.`);
        setViewingQuotationsEnquiry(null);
        setActiveTab("bookings");
        fetchMyBookings();
      } else {
        setErrorMsg(data.message || "Failed to accept quotation.");
      }
    } catch {
      setErrorMsg("Network error while accepting quotation.");
    }
  };

  // Quotation Builder Calculations
  const quoteSubtotal = useMemo(() => {
    return quoteLineItems.reduce(
      (sum, item) => sum + (Number(item.quantity) * Number(item.durationDays) * Number(item.rate) || 0),
      0
    );
  }, [quoteLineItems]);

  const quoteTaxable = Math.max(0, quoteSubtotal + Number(quoteDelivery) + Number(quoteTech) - Number(quoteDiscount));
  const quoteTaxAmount = Math.round(quoteTaxable * (Number(quoteTaxPct) / 100));
  const quoteGrandTotal = quoteTaxable + quoteTaxAmount;
  const quoteAdvance = Math.round(quoteGrandTotal * (Number(quoteAdvPct) / 100));
  const quoteBalance = quoteGrandTotal - quoteAdvance;

  // Vendor create quotation
  const handleCreateQuotation = async (e) => {
    e.preventDefault();
    if (!quotingEnquiry) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = {
        enquiryId: quotingEnquiry._id,
        lineItems: quoteLineItems.map((li) => ({
          ...li,
          amount: Number(li.quantity) * Number(li.durationDays) * Number(li.rate),
        })),
        deliveryFee: Number(quoteDelivery),
        setupTechnicianFee: Number(quoteTech),
        discountAmount: Number(quoteDiscount),
        taxPercentage: Number(quoteTaxPct),
        refundableDeposit: Number(quoteDeposit),
        advancePercentage: Number(quoteAdvPct),
        terms: "Deposit refunded within 24h of return inspection. Radios pre-programmed on license-free PMR channels.",
      };

      const res = await fetch(`${API_BASE}/api/walkie/quotations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Itemized quotation sent to customer!");
        setQuotingEnquiry(null);
        fetchVendorEnquiries();
      } else {
        setErrorMsg(data.message || "Failed to issue quotation.");
      }
    } catch {
      setErrorMsg("Network error while creating quotation.");
    }
  };

  // Vendor verify / scan token
  const handleScanToken = async (e) => {
    e.preventDefault();
    if (!scanTokenInput.trim()) return;
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/walkie/bookings/verify-token/${scanTokenInput.trim()}`);
      const data = await res.json();
      if (res.ok) {
        setScannedResult(data);
      } else {
        setErrorMsg(data.message || "Invalid QR scan token.");
        setScannedResult(null);
      }
    } catch {
      setErrorMsg("Network error checking token.");
    }
  };

  // Vendor execute handover
  const handleExecuteHandover = async () => {
    if (!scannedResult?.bookingId) return;
    try {
      const res = await fetch(`${API_BASE}/api/walkie/bookings/${scannedResult.bookingId}/handover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify({
          token: scanTokenInput.trim(),
          notes: scanActionNotes || "Equipment handed over with fully charged batteries and frequency check.",
          dispatchedBy: authData?.user?.fullName || "Field Tech",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Equipment handover marked complete! Radios are live in use.");
        setScannedResult(null);
        setScanTokenInput("");
      } else {
        setErrorMsg(data.message || "Handover execution failed.");
      }
    } catch {
      setErrorMsg("Network error during handover execution.");
    }
  };

  // Vendor execute return
  const handleExecuteReturn = async () => {
    if (!scannedResult?.bookingId) return;
    try {
      const res = await fetch(`${API_BASE}/api/walkie/bookings/${scannedResult.bookingId}/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify({
          token: scanTokenInput.trim(),
          missingCount: 0,
          damagedCount: 0,
          damageCharges: 0,
          notes: scanActionNotes || "All radios, antennas, chargers and earpieces returned in pristine order.",
          inspectedBy: authData?.user?.fullName || "Return Inspector",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Return confirmed! Full security deposit reconciliation processed.");
        setScannedResult(null);
        setScanTokenInput("");
      } else {
        setErrorMsg(data.message || "Return processing failed.");
      }
    } catch {
      setErrorMsg("Network error during return execution.");
    }
  };

  // Fetch Team Channels
  const handleOpenChannelManager = async (booking) => {
    setSelectedBookingForChannel(booking);
    try {
      const res = await fetch(`${API_BASE}/api/walkie/bookings/${booking._id}/assignments`);
      const data = await res.json();
      if (res.ok) setBookingAssignments(data);
    } catch (err) {
      console.error("Failed to load channel assignments:", err);
    }
  };

  // Add Team Channel Assignment
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!selectedBookingForChannel) return;
    try {
      const res = await fetch(`${API_BASE}/api/walkie/bookings/${selectedBookingForChannel._id}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify({
          groupName: newAssignmentGroup,
          channelNumber: Number(newAssignmentChannel),
          assignedRadioCount: Number(newAssignmentCount),
          leadPersonName: newAssignmentLead,
          contactPhone: newAssignmentPhone,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookingAssignments((prev) => [...prev, data.assignment]);
        setNewAssignmentLead("");
        setNewAssignmentPhone("");
        setSuccessMsg("Channel successfully allocated to crew group!");
      }
    } catch {
      setErrorMsg("Failed to add channel assignment.");
    }
  };

  // Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewBooking) return;
    try {
      const res = await fetch(`${API_BASE}/api/walkie/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify({
          bookingId: reviewBooking._id,
          rating: reviewRating,
          review: reviewText,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Thank you! Your verified review has been published.");
        setReviewBooking(null);
        setReviewText("");
        fetchMyBookings();
      } else {
        setErrorMsg(data.message || "Failed to submit review.");
      }
    } catch {
      setErrorMsg("Network error submitting review.");
    }
  };

  // Admin verify toggle
  const handleToggleVerification = async (vendorId) => {
    try {
      const res = await fetch(`${API_BASE}/api/walkie/admin/vendors/${vendorId}/verify`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message);
        fetchVendors();
      }
    } catch (err) {
      console.error("Admin verify toggle error:", err);
    }
  };

  return (
    <div className="walkie-container">
      {/* Hero Header */}
      <div className="walkie-hero">
        <div className="walkie-hero-content">
          <div className="hero-top-row">
            <div className="walkie-badge">
              <Radio size={14} color="#38bdf8" />
              <span>PROFESSIONAL EVENT TWO-WAY RADIO RENTAL</span>
            </div>
            {onBackHome && (
              <button
                type="button"
                className="walkie-outline-sm-btn"
                onClick={onBackHome}
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff", borderColor: "rgba(255,255,255,0.25)" }}
              >
                ← Back to Services
              </button>
            )}
          </div>
          <h1>Walkie-Talkie Fleet & Event Crew Communication</h1>
          <p>
            Rent high-performance UHF/VHF digital DMR walkie-talkies, covert acoustic tube earpieces, and multi-bank chargers.
            Ensuring flawless coordination for wedding baraats, stage managers, VIP escorts, valet parking, and emergency crews.
          </p>

          <div className="compliance-pill-box">
            <ShieldCheck size={16} color="#38bdf8" />
            <span>
              <strong>Compliance Notice:</strong> All rental units operate strictly within legal WPC license-free PMR446 or verified commercial event frequencies. Real hardware rentals, not smartphone apps.
            </span>
          </div>

          <div className="walkie-hero-metrics">
            <div className="w-metric">
              <Zap size={16} color="#fbbf24" />
              <span>Crystal-Clear Digital DMR Audio</span>
            </div>
            <div className="w-metric">
              <Battery size={16} color="#34d399" />
              <span>24h Hot-Swappable Battery Packs</span>
            </div>
            <div className="w-metric">
              <QrCode size={16} color="#60a5fa" />
              <span>Secure QR Dispatch & Return Handover</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      {successMsg && (
        <div className="walkie-alert success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg("")}>✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="walkie-alert error">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg("")}>✕</button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="walkie-nav-tabs">
        <button
          className={activeTab === "discovery" ? "w-tab active" : "w-tab"}
          onClick={() => setActiveTab("discovery")}
        >
          <Search size={16} /> Discover Fleet ({equipmentList.length})
        </button>
        <button
          className={activeTab === "calculator" ? "w-tab active" : "w-tab"}
          onClick={() => setActiveTab("calculator")}
        >
          <IndianRupee size={16} /> Instant Rental Calculator
        </button>
        <button
          className={activeTab === "enquiries" ? "w-tab active" : "w-tab"}
          onClick={() => setActiveTab("enquiries")}
        >
          <FileText size={16} /> Enquiries & Quotes ({myEnquiries.length})
        </button>
        <button
          className={activeTab === "bookings" ? "w-tab active" : "w-tab"}
          onClick={() => setActiveTab("bookings")}
        >
          <Calendar size={16} /> Active Bookings & QR ({myBookings.length})
        </button>
        <button
          className={activeTab === "vendor_portal" ? "w-tab active" : "w-tab"}
          onClick={() => setActiveTab("vendor_portal")}
        >
          <Radio size={16} /> Vendor Operations Hub
        </button>
        {adminData && (
          <button
            className={activeTab === "admin" ? "w-tab active admin" : "w-tab admin"}
            onClick={() => setActiveTab("admin")}
          >
            <ShieldCheck size={16} /> Admin Portal
          </button>
        )}
      </div>

      {/* ==================================================== */}
      {/* TAB 1: EQUIPMENT DISCOVERY & SEARCH                 */}
      {/* ==================================================== */}
      {activeTab === "discovery" && (
        <div className="walkie-discovery-section">
          {/* Search Card */}
          <div className="walkie-search-card">
            <div className="search-row-top">
              <div className="search-box">
                <Search size={18} color="#0284c7" />
                <input
                  type="text"
                  placeholder="Search by model (e.g. Motorola DP4400e, Kenwood, SL1600, Earpiece)..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              <div className="search-filter-input">
                <MapPin size={16} color="#64748b" />
                <input
                  type="text"
                  placeholder="City (e.g. Mumbai, Delhi NCR, Jaipur, Bangalore)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
              </div>
            </div>

            <div className="search-row-bottom">
              <div className="filter-group">
                <label>Category:</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Type:</label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                  {RADIO_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Max Daily Rate:</label>
                <input
                  type="number"
                  placeholder="₹ Max Rate"
                  value={maxRateFilter}
                  onChange={(e) => setMaxRateFilter(e.target.value)}
                  style={{ width: 100 }}
                />
              </div>

              <label className="checkbox-filter">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                />
                <span>Verified Fleets Only</span>
              </label>

              {(searchKeyword || searchCity || selectedCategory !== "All" || selectedType !== "All" || maxRateFilter || verifiedOnly) && (
                <button
                  className="reset-btn"
                  onClick={() => {
                    setSearchKeyword("");
                    setSearchCity("");
                    setSelectedCategory("All");
                    setSelectedType("All");
                    setMaxRateFilter("");
                    setVerifiedOnly(false);
                  }}
                >
                  <RotateCcw size={13} /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Equipment Grid */}
          {loading ? (
            <div className="loading-state">
              <Radio size={36} className="spin-anim" />
              <p>Scanning certified radio communication fleets...</p>
            </div>
          ) : equipmentList.length === 0 ? (
            <div className="empty-card">
              <Radio size={48} color="#0284c7" style={{ opacity: 0.5 }} />
              <h3>No Communication Equipment Found</h3>
              <p>Try broadening your city or category filters.</p>
              <button
                className="walkie-primary-sm-btn"
                onClick={() => {
                  setSearchCity("");
                  setSelectedCategory("All");
                  setSelectedType("All");
                }}
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="walkie-equipment-grid">
              {equipmentList.map((item) => (
                <div className="walkie-equipment-card" key={item._id}>
                  <div className="card-top-tags">
                    <span className="category-pill">{item.category}</span>
                    <span className="type-pill">{item.radioType}</span>
                    {item.vendor?.verificationStatus === "Verified" && (
                      <span className="verified-tag">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    )}
                  </div>

                  <h3 className="item-title">{item.name}</h3>
                  <div className="item-brand-sub">
                    Brand: <strong>{item.brand}</strong> · Model: <strong>{item.modelNumber}</strong>
                  </div>

                  <p className="item-desc">{item.description}</p>

                  <div className="item-specs-grid">
                    <div>
                      <Activity size={12} /> Range: <strong>{item.operatingRangeEstimate}</strong>
                    </div>
                    <div>
                      <Battery size={12} /> Battery: <strong>{item.batteryType}</strong>
                    </div>
                    <div>
                      <Zap size={12} /> RF Power: <strong>{item.rfPowerWatts}W Output</strong>
                    </div>
                    <div>
                      <MapPin size={12} /> Location: <strong>{item.vendor?.city || "Nationwide"}</strong>
                    </div>
                  </div>

                  {item.compatibleAccessories?.length > 0 && (
                    <div className="accessories-chips">
                      {item.compatibleAccessories.slice(0, 3).map((acc) => (
                        <span key={acc} className="acc-chip">
                          <Check size={11} color="#0284c7" /> {acc}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="card-footer">
                    <div className="pricing-col">
                      <span className="lbl">Daily Rental</span>
                      <strong className="rate">{money(item.dailyRentalRate)}</strong>
                      <span className="unit">/ unit / day</span>
                    </div>

                    <div className="card-actions">
                      <button
                        className="walkie-outline-sm-btn"
                        onClick={() => setSelectedEquipment(item)}
                      >
                        Details
                      </button>
                      <button
                        className="walkie-primary-sm-btn"
                        onClick={() => {
                          setEnquiryModalItem(item);
                          setEnquiryForm((prev) => ({
                            ...prev,
                            city: item.vendor?.city || "Mumbai",
                            categoryPreference: item.category,
                          }));
                        }}
                      >
                        Enquire <ArrowRight size={13} />
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
      {/* TAB 2: INSTANT RENTAL COST CALCULATOR               */}
      {/* ==================================================== */}
      {activeTab === "calculator" && (
        <div className="walkie-calculator-section">
          <div className="section-title">
            <h2>Two-Way Radio Rental Cost Calculator</h2>
            <p>Interactive, transparent breakdown of equipment, accessories, delivery, taxes, and refundable security deposit.</p>
          </div>

          <div className="calculator-layout">
            {/* Input Controls */}
            <div className="calc-inputs-card">
              <h3>1. Equipment & Quantity Parameters</h3>

              <div className="calc-grid-2">
                <div className="calc-field">
                  <label>Handheld Radios Needed:</label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={calcRadios}
                    onChange={(e) => setCalcRadios(Math.max(1, Number(e.target.value) || 1))}
                  />
                </div>

                <div className="calc-field">
                  <label>Rental Duration (Days):</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={calcDays}
                    onChange={(e) => setCalcDays(Math.max(1, Number(e.target.value) || 1))}
                  />
                </div>

                <div className="calc-field">
                  <label>Radio Daily Rate (₹):</label>
                  <input
                    type="number"
                    min="100"
                    value={calcRate}
                    onChange={(e) => setCalcRate(Number(e.target.value) || 0)}
                  />
                </div>

                <div className="calc-field">
                  <label>Acoustic Tube Headsets (Qty & Rate ₹):</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      type="number"
                      min="0"
                      value={calcHeadsets}
                      onChange={(e) => setCalcHeadsets(Number(e.target.value) || 0)}
                      placeholder="Qty"
                    />
                    <input
                      type="number"
                      min="0"
                      value={calcHeadsetRate}
                      onChange={(e) => setCalcHeadsetRate(Number(e.target.value) || 0)}
                      placeholder="Rate ₹"
                      style={{ width: 80 }}
                    />
                  </div>
                </div>

                <div className="calc-field">
                  <label>Spare Batteries (Qty & Rate ₹):</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      type="number"
                      min="0"
                      value={calcBatteries}
                      onChange={(e) => setCalcBatteries(Number(e.target.value) || 0)}
                      placeholder="Qty"
                    />
                    <input
                      type="number"
                      min="0"
                      value={calcBatteryRate}
                      onChange={(e) => setCalcBatteryRate(Number(e.target.value) || 0)}
                      placeholder="Rate ₹"
                      style={{ width: 80 }}
                    />
                  </div>
                </div>

                <div className="calc-field">
                  <label>6-Way Charging Banks (Qty & Rate ₹):</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      type="number"
                      min="0"
                      value={calcChargers}
                      onChange={(e) => setCalcChargers(Number(e.target.value) || 0)}
                      placeholder="Qty"
                    />
                    <input
                      type="number"
                      min="0"
                      value={calcChargerRate}
                      onChange={(e) => setCalcChargerRate(Number(e.target.value) || 0)}
                      placeholder="Rate ₹"
                      style={{ width: 80 }}
                    />
                  </div>
                </div>
              </div>

              <h3 style={{ marginTop: 20 }}>2. Logistics, Technician & Discounts</h3>
              <div className="calc-grid-2">
                <div className="calc-field">
                  <label>Venue Delivery & Return Pickup (₹):</label>
                  <input
                    type="number"
                    min="0"
                    value={calcDelivery}
                    onChange={(e) => setCalcDelivery(Number(e.target.value) || 0)}
                  />
                </div>

                <div className="calc-field">
                  <label>On-Site Technician Support (₹):</label>
                  <input
                    type="number"
                    min="0"
                    value={calcTechnician}
                    onChange={(e) => setCalcTechnician(Number(e.target.value) || 0)}
                  />
                </div>

                <div className="calc-field">
                  <label>Special Event Discount (₹):</label>
                  <input
                    type="number"
                    min="0"
                    value={calcDiscount}
                    onChange={(e) => setCalcDiscount(Number(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {/* Calculated Breakdown Summary */}
            <div className="calc-summary-card">
              <h3>Estimated Financial Summary</h3>

              <div className="fin-list">
                <div className="fin-line">
                  <span>{calcRadios} Radios × {calcDays} Days:</span>
                  <strong>{money(calcResults.radioTotal)}</strong>
                </div>
                <div className="fin-line">
                  <span>{calcHeadsets} Headsets × {calcDays} Days:</span>
                  <strong>{money(calcResults.headsetTotal)}</strong>
                </div>
                <div className="fin-line">
                  <span>{calcBatteries} Spare Batteries:</span>
                  <strong>{money(calcResults.batteryTotal)}</strong>
                </div>
                <div className="fin-line">
                  <span>{calcChargers} Multi-Unit Chargers:</span>
                  <strong>{money(calcResults.chargerTotal)}</strong>
                </div>
                <div className="fin-line">
                  <span>Logistics & On-Site Technician:</span>
                  <strong>+{money(Number(calcDelivery) + Number(calcTechnician))}</strong>
                </div>
                {calcDiscount > 0 && (
                  <div className="fin-line">
                    <span>Discount:</span>
                    <strong style={{ color: "#16a34a" }}>-{money(calcDiscount)}</strong>
                  </div>
                )}
                <div className="fin-line">
                  <span>GST Taxes (18%):</span>
                  <strong>+{money(calcResults.gst)}</strong>
                </div>

                <div className="fin-divider" />

                <div className="fin-total-row">
                  <span>Grand Rental Total:</span>
                  <strong className="grand">{money(calcResults.rentalTotal)}</strong>
                </div>

                <div className="fin-line deposit-highlight">
                  <div>
                    <span>100% Refundable Security Deposit:</span>
                    <small style={{ display: "block", color: "#64748b" }}>Returned within 24h of device return</small>
                  </div>
                  <strong style={{ color: "#0284c7" }}>{money(calcResults.deposit)}</strong>
                </div>

                <div className="fin-line">
                  <span>Advance to Confirm Booking (30%):</span>
                  <strong style={{ color: "#16a34a" }}>{money(calcResults.advance)}</strong>
                </div>
                <div className="fin-line">
                  <span>Balance Due on Dispatch Handover:</span>
                  <strong>{money(calcResults.balance)}</strong>
                </div>
              </div>

              <button
                className="walkie-primary-btn"
                style={{ width: "100%", marginTop: 18 }}
                onClick={() => {
                  setEnquiryForm((prev) => ({
                    ...prev,
                    radioCount: calcRadios,
                    headsetCount: calcHeadsets,
                    extraBatteryCount: calcBatteries,
                    chargerCount: calcChargers,
                    budget: calcResults.rentalTotal,
                  }));
                  setEnquiryModalItem({});
                }}
              >
                Send Enquiry with this Estimate <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: CUSTOMER ENQUIRIES & QUOTATIONS              */}
      {/* ==================================================== */}
      {activeTab === "enquiries" && (
        <div className="walkie-enquiries-section">
          <div className="section-title">
            <h2>Your Radio Rental Enquiries</h2>
            <p>Track responses and itemized quotations submitted by certified equipment vendors.</p>
          </div>

          {myEnquiries.length === 0 ? (
            <div className="empty-card">
              <FileText size={44} color="#0284c7" style={{ opacity: 0.5 }} />
              <h3>No Enquiries Submitted</h3>
              <p>Explore equipment in the Discovery tab and click "Enquire" to receive quotations.</p>
              <button className="walkie-primary-sm-btn" onClick={() => setActiveTab("discovery")}>
                Explore Fleet
              </button>
            </div>
          ) : (
            <div className="enquiries-list">
              {myEnquiries.map((enq) => (
                <div className="enquiry-card" key={enq._id}>
                  <div className="enq-top">
                    <div>
                      <span className={`status-pill ${enq.status.toLowerCase()}`}>{enq.status}</span>
                      <h3>{enq.eventName}</h3>
                      <p className="enq-loc">
                        <MapPin size={13} /> {enq.eventLocation} ({enq.city})
                      </p>
                    </div>
                    <div className="enq-date-pill">
                      <Calendar size={13} /> {enq.startDate} to {enq.endDate} ({enq.durationDays} Days)
                    </div>
                  </div>

                  <div className="enq-details-grid">
                    <div>
                      Radios Required: <strong>{enq.radioCount} Units</strong>
                    </div>
                    <div>
                      Headsets / Earpieces: <strong>{enq.headsetCount || 0} Units</strong>
                    </div>
                    <div>
                      Spare Batteries: <strong>{enq.extraBatteryCount || 0} Units</strong>
                    </div>
                    <div>
                      Charging Docks: <strong>{enq.chargerCount || 0} Units</strong>
                    </div>
                    <div>
                      Venue Setup: <strong>{enq.venueType} ({enq.floorOrZonesCount} Zones)</strong>
                    </div>
                    <div>
                      Target Budget: <strong>{money(enq.budget)}</strong>
                    </div>
                  </div>

                  <div className="enq-footer">
                    <span className="enq-id">Enquiry ID: {enq._id}</span>
                    <button
                      className="walkie-primary-sm-btn"
                      onClick={() => handleViewQuotations(enq)}
                    >
                      <FileText size={14} /> Review Itemized Quotations
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: CONFIRMED BOOKINGS & QR HANDOVER             */}
      {/* ==================================================== */}
      {activeTab === "bookings" && (
        <div className="walkie-bookings-section">
          <div className="section-title">
            <h2>Your Confirmed Radio Rentals & QR Tokens</h2>
            <p>Access your secure QR dispatch tokens, return inspection records, and coordinate event crew channels.</p>
          </div>

          {myBookings.length === 0 ? (
            <div className="empty-card">
              <Calendar size={44} color="#0284c7" style={{ opacity: 0.5 }} />
              <h3>No Confirmed Rentals Yet</h3>
              <p>Once you accept an itemized quotation, your confirmed booking and QR tokens will appear here.</p>
              <button className="walkie-primary-sm-btn" onClick={() => setActiveTab("enquiries")}>
                View My Quotes
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              {myBookings.map((b) => (
                <div className="booking-card" key={b._id}>
                  <div className="booking-top">
                    <div>
                      <span className={`booking-status-pill ${b.bookingStatus.toLowerCase()}`}>
                        <CheckCircle2 size={13} /> {b.bookingStatus}
                      </span>
                      <h3>{b.eventName}</h3>
                      <p className="b-meta">
                        Code: <strong>{b.bookingCode}</strong> · Vendor: <strong>{b.vendor?.companyName}</strong> (📞 {b.vendor?.phone})
                      </p>
                    </div>

                    <div className="booking-fin-box">
                      <span className="lbl">Agreed Rental Total</span>
                      <strong className="amt">{money(b.agreedRentalTotal)}</strong>
                      <span className="deposit-tag">Deposit: {money(b.refundableDeposit)} (Refundable)</span>
                    </div>
                  </div>

                  <div className="booking-info-row">
                    <div>
                      <Calendar size={14} /> Dates: <strong>{b.startDate} to {b.endDate}</strong>
                    </div>
                    <div>
                      <Radio size={14} /> Equipment: <strong>{b.radioCount} Radios + {b.headsetCount} Headsets</strong>
                    </div>
                    <div>
                      <MapPin size={14} /> Venue: <strong>{b.eventLocation}</strong>
                    </div>
                  </div>

                  {/* QR Security Token Card */}
                  <div className="qr-tokens-container">
                    <div className="token-item">
                      <QrCode size={20} color="#0284c7" />
                      <div>
                        <span className="tok-label">Dispatch Handover Token:</span>
                        <code className="tok-code">{b.handoverToken}</code>
                      </div>
                    </div>
                    <div className="token-item">
                      <QrCode size={20} color="#16a34a" />
                      <div>
                        <span className="tok-label">Return Inspection Token:</span>
                        <code className="tok-code">{b.returnToken}</code>
                      </div>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <button
                      className="walkie-outline-sm-btn"
                      onClick={() => handleOpenChannelManager(b)}
                    >
                      <Users size={14} /> Allocate Crew Channels ({b.radioCount} Radios)
                    </button>
                    {b.bookingStatus === "Completed" && (
                      <button
                        className="walkie-primary-sm-btn"
                        onClick={() => {
                          setReviewBooking(b);
                          setReviewRating(5);
                        }}
                      >
                        <Star size={14} /> Leave Verified Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: VENDOR OPERATIONS HUB                        */}
      {/* ==================================================== */}
      {activeTab === "vendor_portal" && (
        <div className="walkie-vendor-portal">
          <div className="section-title">
            <h2>Vendor Operations & Inventory Hub</h2>
            <p>Manage incoming requests, prepare quotes, and scan QR tokens for handover and return.</p>
          </div>

          <div className="portal-grid">
            {/* Column 1: QR Scanner & Handover Verification */}
            <div className="portal-col">
              <h3><QrCode size={18} /> QR Handover & Return Scanner</h3>
              <div className="scanner-box">
                <form onSubmit={handleScanToken} className="scan-input-form">
                  <input
                    type="text"
                    placeholder="Enter or scan Handover / Return token..."
                    value={scanTokenInput}
                    onChange={(e) => setScanTokenInput(e.target.value)}
                  />
                  <button type="submit" className="walkie-primary-sm-btn">
                    Verify Token
                  </button>
                </form>

                {scannedResult && (
                  <div className="scanned-booking-card">
                    <div className="scanned-badge">
                      ✓ Validated {scannedResult.type} Token
                    </div>
                    <h4>{scannedResult.eventName}</h4>
                    <p>
                      Booking Code: <strong>{scannedResult.bookingCode}</strong> · Client: {scannedResult.customer?.fullName || "Host"}
                    </p>
                    <p>
                      Equipment: <strong>{scannedResult.radioCount} Radios, {scannedResult.headsetCount} Headsets, {scannedResult.extraBatteryCount} Batteries</strong>
                    </p>
                    <p>Status: <strong>{scannedResult.bookingStatus}</strong></p>

                    <div style={{ marginTop: 10 }}>
                      <label style={{ fontSize: 12, fontWeight: 700 }}>Inspection & Verification Notes:</label>
                      <textarea
                        rows={2}
                        placeholder="Condition notes, frequency test result..."
                        value={scanActionNotes}
                        onChange={(e) => setScanActionNotes(e.target.value)}
                        style={{ width: "100%", padding: 6, borderRadius: 6, border: "1px solid #cbd5e1" }}
                      />
                    </div>

                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                      {scannedResult.type === "Handover" ? (
                        <button className="walkie-primary-btn" onClick={handleExecuteHandover}>
                          Confirm Dispatch Handover
                        </button>
                      ) : (
                        <button className="walkie-primary-btn" onClick={handleExecuteReturn}>
                          Confirm Return & Refund Deposit
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <h3 style={{ marginTop: 24 }}><FileText size={18} /> Incoming Rental Enquiries ({vendorEnquiries.length})</h3>
              {vendorEnquiries.length === 0 ? (
                <div className="empty-panel">No pending customer requests at this time.</div>
              ) : (
                <div className="vendor-enq-list">
                  {vendorEnquiries.map((enq) => (
                    <div
                      key={enq._id}
                      className={quotingEnquiry?._id === enq._id ? "v-enq-card active" : "v-enq-card"}
                    >
                      <div className="v-enq-head">
                        <strong>{enq.eventName}</strong>
                        <span className="v-date">{enq.startDate}</span>
                      </div>
                      <p>
                        Client: {enq.contactName} ({enq.contactPhone}) · Loc: {enq.city}
                      </p>
                      <small>
                        Need: <strong>{enq.radioCount} Radios, {enq.headsetCount} Headsets ({enq.venueType})</strong>
                      </small>
                      <div style={{ textAlign: "right", marginTop: 8 }}>
                        <button
                          className="walkie-primary-sm-btn"
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

            {/* Column 2: Quotation Builder */}
            <div className="portal-col">
              <h3><IndianRupee size={18} /> Itemized Quotation Builder</h3>

              {quotingEnquiry ? (
                <form className="quote-builder-box" onSubmit={handleCreateQuotation}>
                  <div className="quote-banner">
                    Creating Quote for: <strong>{quotingEnquiry.eventName}</strong> ({quotingEnquiry.radioCount} Radios · {quotingEnquiry.city})
                  </div>

                  <div className="line-table">
                    <div className="line-head">
                      <span>Item Description</span>
                      <span>Qty</span>
                      <span>Days</span>
                      <span>Rate (₹)</span>
                      <span>Total</span>
                      <span></span>
                    </div>

                    {quoteLineItems.map((li, idx) => (
                      <div className="line-row" key={idx}>
                        <input
                          type="text"
                          value={li.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setQuoteLineItems((prev) => prev.map((item, i) => (i === idx ? { ...item, description: val } : item)));
                          }}
                        />
                        <input
                          type="number"
                          min="1"
                          style={{ width: 50 }}
                          value={li.quantity}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 1;
                            setQuoteLineItems((prev) => prev.map((item, i) => (i === idx ? { ...item, quantity: val } : item)));
                          }}
                        />
                        <input
                          type="number"
                          min="1"
                          style={{ width: 50 }}
                          value={li.durationDays}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 1;
                            setQuoteLineItems((prev) => prev.map((item, i) => (i === idx ? { ...item, durationDays: val } : item)));
                          }}
                        />
                        <input
                          type="number"
                          min="0"
                          style={{ width: 70 }}
                          value={li.rate}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setQuoteLineItems((prev) => prev.map((item, i) => (i === idx ? { ...item, rate: val } : item)));
                          }}
                        />
                        <span className="amt">{money(li.quantity * li.durationDays * li.rate)}</span>
                        <button
                          type="button"
                          className="del-btn"
                          onClick={() => setQuoteLineItems((prev) => prev.filter((_, i) => i !== idx))}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="walkie-outline-sm-btn"
                    style={{ margin: "10px 0" }}
                    onClick={() =>
                      setQuoteLineItems((prev) => [
                        ...prev,
                        { description: "Additional Radio Accessory", category: "Other", quantity: 1, durationDays: 2, rate: 100, amount: 200 },
                      ])
                    }
                  >
                    <Plus size={13} /> Add Item
                  </button>

                  <div className="quote-calc-fin">
                    <div className="q-fin-row">
                      <span>Equipment Subtotal:</span>
                      <strong>{money(quoteSubtotal)}</strong>
                    </div>
                    <div className="q-fin-row">
                      <span>Venue Delivery & Pickup (₹):</span>
                      <input
                        type="number"
                        min="0"
                        value={quoteDelivery}
                        onChange={(e) => setQuoteDelivery(e.target.value)}
                      />
                    </div>
                    <div className="q-fin-row">
                      <span>On-Site Technician Setup (₹):</span>
                      <input
                        type="number"
                        min="0"
                        value={quoteTech}
                        onChange={(e) => setQuoteTech(e.target.value)}
                      />
                    </div>
                    <div className="q-fin-row">
                      <span>Special Discount (₹):</span>
                      <input
                        type="number"
                        min="0"
                        value={quoteDiscount}
                        onChange={(e) => setQuoteDiscount(e.target.value)}
                      />
                    </div>
                    <div className="q-fin-row">
                      <span>GST Taxes (%):</span>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <input
                          type="number"
                          style={{ width: 50 }}
                          value={quoteTaxPct}
                          onChange={(e) => setQuoteTaxPct(Number(e.target.value) || 0)}
                        />
                        <strong>{money(quoteTaxAmount)}</strong>
                      </div>
                    </div>
                    <div className="q-fin-total">
                      <span>Grand Quoted Total:</span>
                      <strong className="grand">{money(quoteGrandTotal)}</strong>
                    </div>
                    <div className="q-fin-row">
                      <span>100% Refundable Security Deposit (₹):</span>
                      <input
                        type="number"
                        min="0"
                        value={quoteDeposit}
                        onChange={(e) => setQuoteDeposit(Number(e.target.value) || 0)}
                      />
                    </div>
                    <div className="q-fin-row">
                      <span>Advance Required (%):</span>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          style={{ width: 50 }}
                          value={quoteAdvPct}
                          onChange={(e) => setQuoteAdvPct(Number(e.target.value) || 0)}
                        />
                        <strong style={{ color: "#16a34a" }}>{money(quoteAdvance)}</strong>
                      </div>
                    </div>
                    <div className="q-fin-row">
                      <span>Balance on Dispatch:</span>
                      <strong>{money(quoteBalance)}</strong>
                    </div>
                  </div>

                  <button type="submit" className="walkie-primary-btn" style={{ width: "100%", marginTop: 14 }}>
                    <Send size={15} /> Send Itemized Quotation to Client
                  </button>
                </form>
              ) : (
                <div className="empty-panel">
                  Select a customer enquiry from the left list to generate an itemized quote.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 6: ADMIN SAFETY & VERIFICATION PORTAL           */}
      {/* ==================================================== */}
      {activeTab === "admin" && (
        <div className="walkie-admin-section">
          <div className="section-title">
            <h2>Milap Admin — Radio Fleets & WPC Compliance</h2>
            <p>Ensure equipment safety, WPC license-free standard certification, and vendor verification.</p>
          </div>

          {adminStats && (
            <div className="admin-stats-grid">
              <div className="stat-card">
                <span>Total Fleet Vendors</span>
                <strong>{adminStats.totalVendors}</strong>
              </div>
              <div className="stat-card">
                <span>Verified Vendors</span>
                <strong style={{ color: "#16a34a" }}>{adminStats.verifiedVendors}</strong>
              </div>
              <div className="stat-card">
                <span>Equipment Models</span>
                <strong style={{ color: "#0284c7" }}>{adminStats.totalEquipmentModels}</strong>
              </div>
              <div className="stat-card">
                <span>Completed Rentals</span>
                <strong style={{ color: "#6366f1" }}>{adminStats.completedBookings}</strong>
              </div>
            </div>
          )}

          <div className="admin-vendor-table-card">
            <h3>Registered Two-Way Radio Fleet Vendors</h3>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Contact</th>
                    <th>City</th>
                    <th>WPC License Status</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v) => (
                    <tr key={v._id}>
                      <td>
                        <strong>{v.companyName}</strong>
                      </td>
                      <td>{v.contactPerson} ({v.phone})</td>
                      <td>{v.city}</td>
                      <td>
                        <span className="wpc-pill">{v.wpcLicenseStatus}</span>
                      </td>
                      <td>★ {v.rating} ({v.reviewCount})</td>
                      <td>
                        <span className={`status-pill ${v.verificationStatus.toLowerCase()}`}>
                          {v.verificationStatus}
                        </span>
                      </td>
                      <td>
                        <button
                          className={v.verificationStatus === "Verified" ? "walkie-outline-sm-btn" : "walkie-primary-sm-btn"}
                          onClick={() => handleToggleVerification(v._id)}
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
      {/* MODAL 1: EQUIPMENT TECHNICAL SPECS                   */}
      {/* ==================================================== */}
      {selectedEquipment && (
        <div className="modal-backdrop" onClick={() => setSelectedEquipment(null)}>
          <div className="walkie-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="category-pill">{selectedEquipment.category}</span>
                <h2>{selectedEquipment.name}</h2>
                <p>
                  Brand: {selectedEquipment.brand} · Model: {selectedEquipment.modelNumber}
                </p>
              </div>
              <button className="close-btn" onClick={() => setSelectedEquipment(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-scroll-body">
              <div className="modal-info-box">
                <h4>Technical Specifications & Wireless Performance:</h4>
                <div className="specs-modal-grid">
                  <div>
                    <strong>Radio Type:</strong> {selectedEquipment.radioType}
                  </div>
                  <div>
                    <strong>Frequency Band:</strong> {selectedEquipment.frequencyBand}
                  </div>
                  <div>
                    <strong>RF Output Power:</strong> {selectedEquipment.rfPowerWatts} Watts
                  </div>
                  <div>
                    <strong>Channel Capacity:</strong> {selectedEquipment.channelCapacity} Channels
                  </div>
                  <div>
                    <strong>Battery Standard:</strong> {selectedEquipment.batteryType}
                  </div>
                  <div>
                    <strong>Operating Coverage:</strong> {selectedEquipment.operatingRangeEstimate}
                  </div>
                  <div>
                    <strong>Compliance Standard:</strong> {selectedEquipment.complianceClass}
                  </div>
                  <div>
                    <strong>Condition:</strong> {selectedEquipment.condition}
                  </div>
                </div>
              </div>

              <div style={{ margin: "16px 0" }}>
                <h4>Compatible Event Accessories:</h4>
                <div className="accessories-chips">
                  {selectedEquipment.compatibleAccessories?.map((acc) => (
                    <span key={acc} className="acc-chip">
                      <Check size={12} color="#0284c7" /> {acc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="modal-info-box">
                <h4>Vendor Profile & Service Terms:</h4>
                <p>
                  Fleet Provider: <strong>{selectedEquipment.vendor?.companyName}</strong> ({selectedEquipment.vendor?.city})
                </p>
                <p style={{ marginTop: 4 }}>
                  Cancellation: {selectedEquipment.vendor?.cancellationPolicy}
                </p>
                <p style={{ marginTop: 4 }}>
                  Deposit: {selectedEquipment.vendor?.depositPolicy}
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="walkie-outline-btn" onClick={() => setSelectedEquipment(null)}>
                Close
              </button>
              <button
                className="walkie-primary-btn"
                onClick={() => {
                  setEnquiryModalItem(selectedEquipment);
                  setEnquiryForm((prev) => ({
                    ...prev,
                    city: selectedEquipment.vendor?.city || "Mumbai",
                    categoryPreference: selectedEquipment.category,
                  }));
                  setSelectedEquipment(null);
                }}
              >
                Send Service Enquiry <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: RENTAL ENQUIRY FORM                         */}
      {/* ==================================================== */}
      {enquiryModalItem && (
        <div className="modal-backdrop" onClick={() => setEnquiryModalItem(null)}>
          <div className="walkie-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>Event Two-Way Radio Rental Enquiry</h2>
                <p>Request itemized quotations and reserve equipment for your event.</p>
              </div>
              <button className="close-btn" onClick={() => setEnquiryModalItem(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateEnquiry} className="modal-scroll-body">
              <div className="form-grid-2">
                <div>
                  <label>Event Name: *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sangeet & Reception Ceremony"
                    value={enquiryForm.eventName}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, eventName: e.target.value })}
                  />
                </div>

                <div>
                  <label>Event Type:</label>
                  <select
                    value={enquiryForm.eventType}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, eventType: e.target.value })}
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Start Date: *</label>
                  <input
                    type="date"
                    required
                    value={enquiryForm.startDate}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, startDate: e.target.value })}
                  />
                </div>

                <div>
                  <label>End Date: *</label>
                  <input
                    type="date"
                    required
                    value={enquiryForm.endDate}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, endDate: e.target.value })}
                  />
                </div>

                <div>
                  <label>City & Service Area: *</label>
                  <input
                    type="text"
                    required
                    value={enquiryForm.city}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, city: e.target.value })}
                  />
                </div>

                <div>
                  <label>Venue Location Address: *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Taj Lands End, Bandra West"
                    value={enquiryForm.eventLocation}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, eventLocation: e.target.value })}
                  />
                </div>
              </div>

              <h4 style={{ margin: "16px 0 8px 0" }}>Equipment & Accessory Fleet Requirements:</h4>
              <div className="form-grid-4">
                <div>
                  <label>Radios (Units): *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={enquiryForm.radioCount}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, radioCount: Number(e.target.value) || 1 })}
                  />
                </div>

                <div>
                  <label>Headset Earpieces:</label>
                  <input
                    type="number"
                    min="0"
                    value={enquiryForm.headsetCount}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, headsetCount: Number(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label>Spare Batteries:</label>
                  <input
                    type="number"
                    min="0"
                    value={enquiryForm.extraBatteryCount}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, extraBatteryCount: Number(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label>Multi-Chargers:</label>
                  <input
                    type="number"
                    min="0"
                    value={enquiryForm.chargerCount}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, chargerCount: Number(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: 14 }}>
                <div>
                  <label>Venue Architecture & Grounds:</label>
                  <select
                    value={enquiryForm.venueType}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, venueType: e.target.value })}
                  >
                    {VENUE_TYPES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Delivery Preference:</label>
                  <select
                    value={enquiryForm.deliveryPreference}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, deliveryPreference: e.target.value })}
                  >
                    <option value="Vendor Delivery to Venue">Vendor Delivery to Venue</option>
                    <option value="Self Pickup from Vendor Hub">Self Pickup from Vendor Hub</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: 14 }}>
                <div>
                  <label>Your Name: *</label>
                  <input
                    type="text"
                    required
                    placeholder="Event Organizer Name"
                    value={enquiryForm.contactName}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, contactName: e.target.value })}
                  />
                </div>

                <div>
                  <label>Contact Phone: *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={enquiryForm.contactPhone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, contactPhone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <label>Special Instructions & Channel Requirements:</label>
                <textarea
                  rows={2}
                  placeholder="e.g. VIP escort channel needed, heavy outdoor interference expected..."
                  value={enquiryForm.specialInstructions}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, specialInstructions: e.target.value })}
                />
              </div>

              <div className="modal-footer" style={{ marginTop: 20 }}>
                <button type="button" className="walkie-outline-btn" onClick={() => setEnquiryModalItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="walkie-primary-btn">
                  Submit Enquiry & Get Quotation
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
          <div className="walkie-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>Quotations for: {viewingQuotationsEnquiry.eventName}</h2>
                <p>
                  {viewingQuotationsEnquiry.startDate} to {viewingQuotationsEnquiry.endDate} · {viewingQuotationsEnquiry.radioCount} Radios
                </p>
              </div>
              <button className="close-btn" onClick={() => setViewingQuotationsEnquiry(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-scroll-body">
              {availableQuotations.length === 0 ? (
                <div className="empty-panel">
                  <Clock size={36} color="#0284c7" style={{ margin: "0 auto 10px" }} />
                  <h4>Quotation in Preparation</h4>
                  <p>The vendor is checking date-based radio stock and formulating your itemized quotation.</p>
                </div>
              ) : (
                <div className="quotes-display-list">
                  {availableQuotations.map((quote) => (
                    <div className="quote-card" key={quote._id}>
                      <div className="q-head">
                        <div>
                          <span className={`status-pill ${quote.status.toLowerCase()}`}>{quote.status}</span>
                          <h4>Vendor: {quote.vendor?.companyName}</h4>
                          <small>Quotation Ref: {quote._id}</small>
                        </div>
                        <div className="q-grand-box">
                          <span className="lbl">Total Quoted Amount</span>
                          <strong className="amt">{money(quote.grandTotal)}</strong>
                          <span className="dep-tag">Refundable Deposit: {money(quote.refundableDeposit)}</span>
                        </div>
                      </div>

                      <table className="quote-items-tbl">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Days</th>
                            <th>Rate</th>
                            <th style={{ textAlign: "right" }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quote.lineItems?.map((li, i) => (
                            <tr key={i}>
                              <td>{li.description}</td>
                              <td>{li.quantity}</td>
                              <td>{li.durationDays}</td>
                              <td>₹{li.rate}</td>
                              <td style={{ textAlign: "right", fontWeight: 700 }}>{money(li.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="quote-fin-summary">
                        <div className="f-row">
                          <span>Subtotal:</span>
                          <strong>{money(quote.subtotal)}</strong>
                        </div>
                        <div className="f-row">
                          <span>Delivery & Logistics:</span>
                          <strong>+{money(quote.deliveryFee)}</strong>
                        </div>
                        {quote.setupTechnicianFee > 0 && (
                          <div className="f-row">
                            <span>Technician Support:</span>
                            <strong>+{money(quote.setupTechnicianFee)}</strong>
                          </div>
                        )}
                        <div className="f-row">
                          <span>Taxes ({quote.taxPercentage}%):</span>
                          <strong>+{money(quote.taxAmount)}</strong>
                        </div>
                        <div className="f-total">
                          <span>Grand Total Payable:</span>
                          <strong>{money(quote.grandTotal)}</strong>
                        </div>
                        <div className="f-row">
                          <span>Advance Required to Confirm ({quote.advancePercentage}%):</span>
                          <strong style={{ color: "#16a34a" }}>{money(quote.advanceRequired)}</strong>
                        </div>
                      </div>

                      {quote.status === "Sent" && (
                        <div style={{ textAlign: "right", marginTop: 14 }}>
                          <button
                            className="walkie-primary-btn"
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
      {/* MODAL 4: CREW CHANNEL ALLOCATION MANAGER             */}
      {/* ==================================================== */}
      {selectedBookingForChannel && (
        <div className="modal-backdrop" onClick={() => setSelectedBookingForChannel(null)}>
          <div className="walkie-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>Event Crew Channel Allocation</h2>
                <p>
                  Booking: <strong>{selectedBookingForChannel.bookingCode}</strong> ({selectedBookingForChannel.radioCount} Radios Total)
                </p>
              </div>
              <button className="close-btn" onClick={() => setSelectedBookingForChannel(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-scroll-body">
              <div className="modal-info-box">
                <p>
                  Organize your event staff into distinct wireless channels (e.g. Channel 1: Stage, Channel 2: Security, Channel 3: Valet).
                  Prevents cross-talk and ensures seamless coordination.
                </p>
              </div>

              {/* Existing Allocations */}
              <div className="assignments-table">
                {bookingAssignments.map((a) => (
                  <div className="assignment-row" key={a._id}>
                    <div className="ch-badge">CH {a.channelNumber}</div>
                    <div className="grp-info">
                      <strong>{a.groupName}</strong>
                      <small>
                        Radios: {a.assignedRadioCount} Units {a.leadPersonName ? `· Lead: ${a.leadPersonName}` : ""}
                      </small>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Channel */}
              <form onSubmit={handleAddAssignment} style={{ marginTop: 18, background: "#f8fafc", padding: 14, borderRadius: 10 }}>
                <h4>Assign New Channel Group:</h4>
                <div className="form-grid-2">
                  <div>
                    <label>Crew Group:</label>
                    <select
                      value={newAssignmentGroup}
                      onChange={(e) => setNewAssignmentGroup(e.target.value)}
                    >
                      {CREW_GROUPS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Channel Number (1-16):</label>
                    <input
                      type="number"
                      min="1"
                      max="16"
                      value={newAssignmentChannel}
                      onChange={(e) => setNewAssignmentChannel(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label>Radios to Allocate:</label>
                    <input
                      type="number"
                      min="1"
                      value={newAssignmentCount}
                      onChange={(e) => setNewAssignmentCount(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label>Group Lead Name:</label>
                    <input
                      type="text"
                      placeholder="e.g. Inspector Ramesh"
                      value={newAssignmentLead}
                      onChange={(e) => setNewAssignmentLead(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="walkie-primary-sm-btn" style={{ marginTop: 12 }}>
                  <Plus size={14} /> Allocate Channel
                </button>
              </form>
            </div>

            <div className="modal-footer">
              <button className="walkie-outline-btn" onClick={() => setSelectedBookingForChannel(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 5: POST-EVENT VERIFIED REVIEW                  */}
      {/* ==================================================== */}
      {reviewBooking && (
        <div className="modal-backdrop" onClick={() => setReviewBooking(null)}>
          <div className="walkie-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>Rate & Review Radio Fleet</h2>
                <p>Vendor: <strong>{reviewBooking.vendor?.companyName}</strong></p>
              </div>
              <button className="close-btn" onClick={() => setReviewBooking(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} style={{ padding: 20 }}>
              <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>
                Overall Rating (1 to 5 Stars):
              </label>
              <div className="star-select">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    className="star-btn"
                    onClick={() => setReviewRating(s)}
                  >
                    <Star
                      size={26}
                      fill={s <= reviewRating ? "#f59e0b" : "none"}
                      color="#f59e0b"
                    />
                  </button>
                ))}
              </div>

              <label style={{ display: "block", fontWeight: 700, margin: "16px 0 6px" }}>
                Audio Clarity, Range & Battery Performance Feedback:
              </label>
              <textarea
                rows={4}
                required
                placeholder="How was the signal penetration, battery backup, and earpiece audio quality during the event?..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
              />

              <div className="modal-footer" style={{ marginTop: 20 }}>
                <button type="button" className="walkie-outline-btn" onClick={() => setReviewBooking(null)}>
                  Cancel
                </button>
                <button type="submit" className="walkie-primary-btn">
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
