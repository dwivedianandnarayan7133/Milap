import React, { useState, useEffect, useMemo } from "react";
import {
  Music,
  Tent,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  Star,
  Search,
  Send,
  ArrowRight,
  ShieldCheck,
  X,
  IndianRupee,
  Layers,
  Phone,
  Upload,
  Image,
  Eye,
  Clock,
  Sparkles,
  Check,
  AlertCircle,
  FileText,
  RotateCw,
} from "lucide-react";
import { API_BASE } from "../apiConfig";
import "./MusicTentServiceView.css";

// Fallback high quality imagery for wedding vendors
const DEFAULT_COVERS = {
  Music: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=700&q=80",
  TentDecor: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80",
  Both: "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=700&q=80",
};

export default function MusicTentServiceView({
  authData,
  adminData,
  initialMode = "All", // "All" | "Music" | "TentDecor"
  onOpenAuth,
  onBackHome,
}) {
  // Service mode: "Music" or "TentDecor" (or "All")
  const [activeMode, setActiveMode] = useState(
    initialMode === "DJ & Stage" ? "Music" : initialMode === "Tent & Decor" ? "TentDecor" : "Music"
  );

  // Tabs: "browse" | "estimator" | "my_quotes" | "admin_requests"
  const [activeTab, setActiveTab] = useState("browse");

  // Vendors list
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Modals
  const [selectedVendor, setSelectedVendor] = useState(null); // Detail modal
  const [quoteModalVendor, setQuoteModalVendor] = useState(null); // Booking/Quote form modal

  // Simple Quotation Form
  const [quoteForm, setQuoteForm] = useState({
    name: authData?.user?.fullName || "",
    phone: authData?.user?.phone || "",
    eventDate: "",
    eventLocation: "",
    guests: 300,
    notes: "",
    referenceImages: [],
  });
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Simple Price Estimator State
  const [estimatorType, setEstimatorType] = useState("Music");
  const [estimatorHoursOrArea, setEstimatorHoursOrArea] = useState(5);
  const [estimatorGuests, setEstimatorGuests] = useState(400);

  // User Enquiries
  const [enquiries, setEnquiries] = useState([]);

  // ============================================================
  // ADMIN DASHBOARD & REQUESTS STATE
  // ============================================================
  const [adminEnquiries, setAdminEnquiries] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminStatusFilter, setAdminStatusFilter] = useState("All");
  const [adminServiceFilter, setAdminServiceFilter] = useState("All");
  const [adminSearch, setAdminSearch] = useState("");
  const [adminQuoteModal, setAdminQuoteModal] = useState(null);
  const [adminQuoteAmount, setAdminQuoteAmount] = useState("");
  const [adminQuoteNotes, setAdminQuoteNotes] = useState("");
  const [zoomPhoto, setZoomPhoto] = useState(null);

  // Fetch Vendors
  useEffect(() => {
    async function loadVendors() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/music-tent/vendors`);
        const data = await res.json();
        if (data.success) {
          setVendors(data.vendors || []);
        }
      } catch (err) {
        console.warn("Could not load vendors:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVendors();
  }, []);

  // Fetch User Enquiries
  const loadEnquiries = async () => {
    try {
      const phoneParam = authData?.user?.phone ? `?phone=${encodeURIComponent(authData.user.phone)}` : "";
      const res = await fetch(`${API_BASE}/api/music-tent/enquiries${phoneParam}`);
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.enquiries || []);
      }
    } catch (err) {
      console.warn("Enquiries load failed:", err);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [authData]);

  // Fetch Admin Enquiries & Stats
  const loadAdminData = async () => {
    setAdminLoading(true);
    try {
      const [resEnq, resStats] = await Promise.all([
        fetch(`${API_BASE}/api/music-tent/admin/enquiries`),
        fetch(`${API_BASE}/api/music-tent/admin/stats`),
      ]);
      const dataEnq = await resEnq.json();
      const dataStats = await resStats.json();
      if (dataEnq.success) {
        setAdminEnquiries(dataEnq.enquiries || []);
      }
      if (dataStats.success) {
        setAdminStats(dataStats);
      }
    } catch (err) {
      console.warn("Admin enquiries load failed:", err);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (adminData || activeTab === "admin_requests") {
      loadAdminData();
    }
  }, [adminData, activeTab]);

  // Filtered Vendors (Very Clean Logic)
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      // 1. Service Type
      if (activeMode === "Music" && v.serviceType === "TentDecor") return false;
      if (activeMode === "TentDecor" && v.serviceType === "Music") return false;

      // 2. City
      if (selectedCity !== "All" && v.city !== selectedCity) {
        const matchExtended = (v.extendedServiceAreas || []).includes(selectedCity);
        if (!matchExtended) return false;
      }

      // 3. Verified only
      if (verifiedOnly && v.verificationStatus !== "Verified") return false;

      // 4. Keyword
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = v.name?.toLowerCase().includes(q);
        const matchesCity = v.city?.toLowerCase().includes(q);
        const matchesLoc = v.locality?.toLowerCase().includes(q);
        const matchesCat = (v.categories || []).some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesCity && !matchesLoc && !matchesCat) return false;
      }

      return true;
    });
  }, [vendors, activeMode, selectedCity, verifiedOnly, searchQuery]);

  // Filtered Admin Requests
  const filteredAdminEnquiries = useMemo(() => {
    return adminEnquiries.filter((enq) => {
      if (adminStatusFilter !== "All" && enq.status !== adminStatusFilter) return false;
      if (adminServiceFilter !== "All" && enq.serviceType !== adminServiceFilter) return false;
      if (adminSearch.trim()) {
        const q = adminSearch.toLowerCase();
        const matchName = enq.customerName?.toLowerCase().includes(q);
        const matchPhone = enq.customerPhone?.includes(q);
        const matchLoc = enq.eventLocation?.toLowerCase().includes(q);
        const matchId = enq.enquiryNumber?.toLowerCase().includes(q);
        const matchVendor = (enq.vendor?.name || "").toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchLoc && !matchId && !matchVendor) return false;
      }
      return true;
    });
  }, [adminEnquiries, adminStatusFilter, adminServiceFilter, adminSearch]);

  // Handle Image Upload with Automatic Lightweight Compression
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.slice(0, 3).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
          setQuoteForm((prev) => ({
            ...prev,
            referenceImages: [
              ...prev.referenceImages,
              { name: file.name, dataUrl: compressedDataUrl },
            ],
          }));
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Submit Simple Quotation Form
  const handleSendQuote = async (e) => {
    e.preventDefault();
    if (!quoteModalVendor) return;

    if (!quoteForm.name?.trim() || !quoteForm.phone?.trim() || !quoteForm.eventDate?.trim() || !quoteForm.eventLocation?.trim()) {
      alert("Please fill in your Name, Phone, Event Date, and Venue Address.");
      return;
    }

    try {
      const payload = {
        vendorId: quoteModalVendor._id,
        customerName: quoteForm.name.trim(),
        customerPhone: quoteForm.phone.trim(),
        serviceType: quoteModalVendor.serviceType,
        category: quoteModalVendor.categories[0] || "DJ",
        eventDate: quoteForm.eventDate.trim(),
        eventLocation: quoteForm.eventLocation.trim(),
        guestCount: Number(quoteForm.guests) || 300,
        customRequirements: quoteForm.notes?.trim() || "",
        referenceImages: quoteForm.referenceImages,
      };

      const res = await fetch(`${API_BASE}/api/music-tent/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        const enqNo = data.enquiry?.enquiryNumber || "MTE-NEW";
        setSubmitSuccess(
          `Request sent to Admin & ${quoteModalVendor.name}! Booking Ref #${enqNo}. Our admin team is reviewing your request.`
        );
        setQuoteModalVendor(null);
        setQuoteForm((prev) => ({
          ...prev,
          notes: "",
          referenceImages: [],
        }));
        loadEnquiries();
        loadAdminData();
        setTimeout(() => setSubmitSuccess(""), 7000);
      } else {
        alert(data?.message || `Request failed with error status: ${res.status}`);
      }
    } catch (err) {
      alert("Error sending request: " + (err.message || "Network issue"));
    }
  };

  // Admin Actions
  const handleAdminUpdateStatus = async (enquiryId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/music-tent/admin/enquiries/${enquiryId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(`Request status updated to "${newStatus}"!`);
        setTimeout(() => setSubmitSuccess(""), 4000);
        loadAdminData();
        loadEnquiries();
      }
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const handleAdminSubmitQuote = async (e) => {
    e.preventDefault();
    if (!adminQuoteModal) return;

    const amt = Number(adminQuoteAmount);
    if (!amt || isNaN(amt) || amt <= 0) {
      alert("Please enter a valid quotation amount (e.g. 18000).");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/music-tent/admin/enquiries/${adminQuoteModal._id}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amt,
          notes: adminQuoteNotes || "Official Milap verified quotation for your wedding celebration.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(`Quotation of ₹${amt.toLocaleString("en-IN")} dispatched to ${adminQuoteModal.customerName}!`);
        setTimeout(() => setSubmitSuccess(""), 5000);
        setAdminQuoteModal(null);
        setAdminQuoteAmount("");
        setAdminQuoteNotes("");
        loadAdminData();
        loadEnquiries();
      } else {
        alert(data.message || "Failed to dispatch quotation.");
      }
    } catch (err) {
      alert("Error sending quote: " + err.message);
    }
  };

  const handleAdminConfirm = async (enquiryId) => {
    try {
      const res = await fetch(`${API_BASE}/api/music-tent/enquiries/${enquiryId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "Advance Paid" }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(`Booking confirmed! Event date locked with vendor.`);
        setTimeout(() => setSubmitSuccess(""), 5000);
        loadAdminData();
        loadEnquiries();
      }
    } catch (err) {
      alert("Error confirming booking: " + err.message);
    }
  };

  // Estimated Price Calculation (Budget-Friendly Rates)
  const estimatedCost = useMemo(() => {
    if (estimatorType === "Music") {
      const base = 12000;
      const extraHours = Math.max(0, estimatorHoursOrArea - 4) * 1200;
      const guestScale = estimatorGuests > 600 ? 6000 : estimatorGuests > 300 ? 3000 : 0;
      return base + extraHours + guestScale;
    } else {
      const base = 22000;
      const areaCost = (estimatorHoursOrArea * 300) * 8; // area scale * 8/sqft
      const guestScale = Math.round(estimatorGuests * 18);
      return base + areaCost + guestScale;
    }
  }, [estimatorType, estimatorHoursOrArea, estimatorGuests]);

  const pendingAdminCount = useMemo(() => {
    return adminEnquiries.filter((e) => e.status === "Pending").length;
  }, [adminEnquiries]);

  return (
    <div className="mt-page-wrapper">
      {/* ============================================================
          1. CLEAN HERO & 2-BUTTON SERVICE SWITCHER
          ============================================================ */}
      <section className="mt-clean-hero">
        <div className="mt-hero-title">
          <h1>Music Services & Tent Decoration</h1>
          <p>
            Connect with top-rated DJs, live symphony bands, wedding tents, and royal mandap decorators.
          </p>
        </div>

        {/* 2 Clean Mode Buttons (No clutter) */}
        <div className="mt-mode-toggle">
          <button
            className={`mt-mode-btn ${activeMode === "Music" ? "active" : ""}`}
            onClick={() => setActiveMode("Music")}
          >
            <Music size={16} /> Music & DJ
          </button>
          <button
            className={`mt-mode-btn ${activeMode === "TentDecor" ? "active" : ""}`}
            onClick={() => setActiveMode("TentDecor")}
          >
            <Tent size={16} /> Tent & Decoration
          </button>
        </div>
      </section>

      {/* Success Notification Banner */}
      {submitSuccess && (
        <div className="mt-success-banner">
          <CheckCircle size={20} color="#16a34a" />
          <span>{submitSuccess}</span>
          <button onClick={() => setSubmitSuccess("")} className="mt-close-banner-btn">
            <X size={15} />
          </button>
        </div>
      )}

      {/* ============================================================
          2. SIMPLE NAVIGATION BAR (4 TABS WITH ADMIN PORTAL)
          ============================================================ */}
      <div className="mt-nav-tabs">
        <button
          className={`mt-nav-tab ${activeTab === "browse" ? "active" : ""}`}
          onClick={() => setActiveTab("browse")}
        >
          <Layers size={15} /> Browse Services ({filteredVendors.length})
        </button>
        <button
          className={`mt-nav-tab ${activeTab === "estimator" ? "active" : ""}`}
          onClick={() => setActiveTab("estimator")}
        >
          <IndianRupee size={15} /> Quick Price Estimator
        </button>
        <button
          className={`mt-nav-tab ${activeTab === "my_quotes" ? "active" : ""}`}
          onClick={() => setActiveTab("my_quotes")}
        >
          <Calendar size={15} /> My Quotes{" "}
          {enquiries.length > 0 && <span className="mt-counter-badge">{enquiries.length}</span>}
        </button>

        {/* Admin Requests Tab (Prominently visible when adminData is logged in or accessible for monitoring) */}
        <button
          className={`mt-nav-tab admin-nav-tab ${activeTab === "admin_requests" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("admin_requests");
            loadAdminData();
          }}
        >
          <ShieldCheck size={16} /> Admin Requests
          {pendingAdminCount > 0 && (
            <span className="mt-admin-pending-badge" title={`${pendingAdminCount} pending customer requests`}>
              {pendingAdminCount}
            </span>
          )}
        </button>
      </div>

      {/* ============================================================
          TAB 1: BROWSE VENDORS (CLEAN & VISUAL)
          ============================================================ */}
      {activeTab === "browse" && (
        <div>
          {/* Simple Search & City Filter Bar */}
          <div className="mt-search-bar">
            <div className="mt-search-input-wrap">
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder={
                  activeMode === "Music"
                    ? "Search DJs, bands, shehnai, sound systems..."
                    : "Search mandaps, tents, floral decor, stages..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="mt-filter-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="All">All Cities (Pan-India)</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Pune">Pune</option>
              <option value="Lucknow">Lucknow</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Ahmedabad">Ahmedabad</option>
            </select>

            <label className="mt-verified-toggle">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
              />
              <span>Verified Only</span>
            </label>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              Loading wedding services...
            </div>
          ) : filteredVendors.length === 0 ? (
            <div
              style={{
                background: "#ffffff",
                padding: "36px",
                borderRadius: "16px",
                textAlign: "center",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3 style={{ margin: "0 0 6px", color: "#334155" }}>No services found</h3>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>
                Try changing your search term or select "All Cities".
              </p>
            </div>
          ) : (
            <div className="mt-cards-grid">
              {filteredVendors.map((vendor) => {
                const cover =
                  vendor.themePortfolios?.[0]?.imageUrl ||
                  DEFAULT_COVERS[vendor.serviceType] ||
                  DEFAULT_COVERS.Music;

                const topPkg = (vendor.packages || [])[0];
                const priceDisplay = topPkg?.price
                  ? `₹${topPkg.price.toLocaleString("en-IN")}`
                  : "On Request";

                return (
                  <div className="mt-card" key={vendor._id}>
                    {/* Visual Cover Photo */}
                    <div className="mt-card-image-box">
                      <img src={cover} alt={vendor.name} />
                      <div className="mt-badge-overlay">
                        <span className="mt-pill-type">
                          {vendor.serviceType === "Both"
                            ? "Music & Decor"
                            : vendor.serviceType === "Music"
                            ? "Music & DJ"
                            : "Tent & Decor"}
                        </span>
                        {vendor.verificationStatus === "Verified" && (
                          <span className="mt-pill-verified">
                            <ShieldCheck size={12} /> Verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="mt-card-content">
                      <div className="mt-card-top-row">
                        <h3>{vendor.name}</h3>
                        <div className="mt-card-rating">
                          <Star size={13} fill="#f59e0b" color="#f59e0b" />
                          <span>{vendor.rating || 4.9}</span>
                        </div>
                      </div>

                      <div className="mt-card-location">
                        <MapPin size={13} />
                        <span>
                          {vendor.locality ? `${vendor.locality}, ` : ""}
                          {vendor.city}
                        </span>
                      </div>

                      {/* Clean 1-line services */}
                      <div className="mt-card-services-line">
                        {(vendor.categories || []).slice(0, 3).join(" • ")}
                      </div>

                      {/* Bottom Pricing & Buttons */}
                      <div className="mt-card-bottom">
                        <div className="mt-price-tag">
                          <small>Starting from</small>
                          <strong>{priceDisplay}</strong>
                        </div>

                        <div className="mt-card-actions">
                          <button
                            className="mt-btn-outline"
                            onClick={() => setSelectedVendor(vendor)}
                          >
                            Details
                          </button>
                          <button
                            className="mt-btn-primary"
                            onClick={() => setQuoteModalVendor(vendor)}
                          >
                            Get Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 2: QUICK PRICE ESTIMATOR
          ============================================================ */}
      {activeTab === "estimator" && (
        <div className="mt-estimator-box">
          <h2>Quick Price Estimator</h2>
          <p>Get an approximate price range for your wedding event in seconds.</p>

          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button
              className={`mt-mode-btn ${estimatorType === "Music" ? "active" : ""}`}
              style={{
                background: estimatorType === "Music" ? "#6b21a8" : "#f1f5f9",
                color: estimatorType === "Music" ? "#fff" : "#334155",
              }}
              onClick={() => setEstimatorType("Music")}
            >
              <Music size={15} /> Music & DJ
            </button>
            <button
              className={`mt-mode-btn ${estimatorType === "TentDecor" ? "active" : ""}`}
              style={{
                background: estimatorType === "TentDecor" ? "#6b21a8" : "#f1f5f9",
                color: estimatorType === "TentDecor" ? "#fff" : "#334155",
              }}
              onClick={() => setEstimatorType("TentDecor")}
            >
              <Tent size={15} /> Tent & Mandap Decor
            </button>
          </div>

          <div className="mt-slider-row">
            <label>
              <span>{estimatorType === "Music" ? "Performance Duration" : "Setup Area Scale"}</span>
              <span>{estimatorType === "Music" ? `${estimatorHoursOrArea} Hours` : `${estimatorHoursOrArea * 500} sq. ft.`}</span>
            </label>
            <input
              type="range"
              min={estimatorType === "Music" ? 3 : 2}
              max={estimatorType === "Music" ? 10 : 10}
              value={estimatorHoursOrArea}
              onChange={(e) => setEstimatorHoursOrArea(Number(e.target.value))}
            />
          </div>

          <div className="mt-slider-row">
            <label>
              <span>Expected Guests</span>
              <span>{estimatorGuests} Guests</span>
            </label>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={estimatorGuests}
              onChange={(e) => setEstimatorGuests(Number(e.target.value))}
            />
          </div>

          <div className="mt-result-card">
            <div>
              <div style={{ fontSize: "12px", color: "#6b21a8", fontWeight: "700", textTransform: "uppercase" }}>
                Estimated Price Range
              </div>
              <h3>₹{estimatedCost.toLocaleString("en-IN")}</h3>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                Includes setup, operators, standard lighting & transport
              </div>
            </div>

            <button
              className="mt-btn-primary"
              style={{ padding: "10px 18px", fontSize: "13.5px" }}
              onClick={() => {
                setActiveTab("browse");
              }}
            >
              Browse Vendors <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 3: MY QUOTES (CUSTOMER REQUEST VIEW)
          ============================================================ */}
      {activeTab === "my_quotes" && (
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: "20px", color: "#0f172a" }}>My Quotation Requests</h2>
              <p style={{ margin: 0, color: "#64748b", fontSize: "13.5px" }}>
                Track responses from Admin and assigned event vendors.
              </p>
            </div>
            <button className="mt-btn-outline" onClick={loadEnquiries} style={{ padding: "6px 12px", fontSize: "12.5px" }}>
              <RotateCw size={13} /> Refresh
            </button>
          </div>

          {enquiries.length === 0 ? (
            <div
              style={{
                background: "#ffffff",
                padding: "36px",
                borderRadius: "16px",
                textAlign: "center",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3 style={{ margin: "0 0 6px" }}>No quotation requests yet</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 16px" }}>
                Click "Get Quote" on any DJ or Tent vendor card to send a booking request.
              </p>
              <button className="mt-btn-primary" onClick={() => setActiveTab("browse")}>
                Find DJ & Decor Vendors
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {enquiries.map((enq) => {
                const isConfirmed = enq.status === "Confirmed";
                const isQuoted = enq.status === "Quoted";
                return (
                  <div key={enq._id} className="mt-customer-quote-card">
                    <div className="mt-customer-quote-header">
                      <div>
                        <span className="mt-req-id">{enq.enquiryNumber}</span>
                        <h4 style={{ margin: "4px 0 0", fontSize: "15px", color: "#0f172a" }}>
                          {enq.vendor?.name || enq.category || "DJ & Sound"}
                        </h4>
                      </div>
                      <span className={`mt-status-tag status-${(enq.status || "Pending").toLowerCase()}`}>
                        {enq.status === "Pending" && <Clock size={12} />}
                        {enq.status === "Quoted" && <FileText size={12} />}
                        {enq.status === "Confirmed" && <Check size={12} />}
                        {enq.status}
                      </span>
                    </div>

                    <div className="mt-customer-quote-details">
                      <div>
                        <span>Event Date:</span> <strong>{enq.eventDate}</strong>
                      </div>
                      <div>
                        <span>Venue / City:</span> <strong>{enq.eventLocation}</strong>
                      </div>
                      <div>
                        <span>Guests:</span> <strong>{enq.guestCount || 300} Guests</strong>
                      </div>
                    </div>

                    {enq.customRequirements && (
                      <div className="mt-customer-quote-notes">
                        <em>" {enq.customRequirements} "</em>
                      </div>
                    )}

                    {/* Status Info Banner for Customer */}
                    <div className={`mt-status-info-box ${enq.status?.toLowerCase()}`}>
                      {isConfirmed ? (
                        <span>
                          <CheckCircle size={15} color="#16a34a" /> <strong>Booking Confirmed!</strong> Vendor is reserved for your event date.
                        </span>
                      ) : isQuoted ? (
                        <div>
                          <span>
                            <FileText size={15} color="#0284c7" /> <strong>Quotation Received!</strong> {enq.vendorNotes || "Quotation ready."}
                          </span>
                          <button
                            className="mt-btn-primary"
                            style={{ marginTop: "8px", padding: "6px 14px", fontSize: "12.5px" }}
                            onClick={() => handleAdminConfirm(enq._id)}
                          >
                            Accept & Lock Booking
                          </button>
                        </div>
                      ) : (
                        <span>
                          <Clock size={15} color="#d97706" /> <strong>Request Received by Admin & Vendor:</strong> Under operational review. You will receive an official quotation shortly.
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 4: ADMIN REQUESTS DASHBOARD (REAL-TIME OPERATIONS)
          ============================================================ */}
      {activeTab === "admin_requests" && (
        <div className="mt-admin-container">
          {/* Admin Header */}
          <div className="mt-admin-header">
            <div>
              <div className="mt-admin-badge-top">
                <ShieldCheck size={14} /> MILAP BKC CENTRAL ADMIN
              </div>
              <h2>DJ, Sound & Tent Customer Booking Requests</h2>
              <p>
                Incoming quote inquiries and event bookings dispatched from wedding couples across India.
              </p>
            </div>
            <button className="mt-btn-outline" onClick={loadAdminData} style={{ background: "#fff" }}>
              <RotateCw size={14} className={adminLoading ? "mt-spin" : ""} /> Refresh Requests
            </button>
          </div>

          {/* Admin Stats Grid */}
          <div className="mt-admin-stats-grid">
            <div className="mt-admin-stat-card">
              <span>Total Inquiries</span>
              <strong>{adminStats?.totalEnquiries ?? adminEnquiries.length}</strong>
            </div>
            <div className="mt-admin-stat-card highlight-pending">
              <span>Pending Review</span>
              <strong>{adminStats?.pendingEnquiries ?? pendingAdminCount}</strong>
            </div>
            <div className="mt-admin-stat-card highlight-quoted">
              <span>Quoted</span>
              <strong>{adminStats?.quotedEnquiries ?? adminEnquiries.filter((e) => e.status === "Quoted").length}</strong>
            </div>
            <div className="mt-admin-stat-card highlight-confirmed">
              <span>Confirmed Bookings</span>
              <strong>{adminStats?.confirmedBookings ?? adminEnquiries.filter((e) => e.status === "Confirmed").length}</strong>
            </div>
          </div>

          {/* Admin Search & Filter Bar */}
          <div className="mt-admin-filter-bar">
            <div className="mt-search-input-wrap">
              <Search size={15} color="#64748b" />
              <input
                type="text"
                placeholder="Search by customer name, phone, city, or ID..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
              />
            </div>

            <div className="mt-admin-filter-group">
              <select
                value={adminServiceFilter}
                onChange={(e) => setAdminServiceFilter(e.target.value)}
                className="mt-filter-select"
              >
                <option value="All">All Services</option>
                <option value="Music">DJ & Sound Only</option>
                <option value="TentDecor">Tent & Decor Only</option>
              </select>

              <select
                value={adminStatusFilter}
                onChange={(e) => setAdminStatusFilter(e.target.value)}
                className="mt-filter-select"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending Review</option>
                <option value="Quoted">Quoted</option>
                <option value="Confirmed">Confirmed</option>
              </select>
            </div>
          </div>

          {/* Admin Requests List */}
          {adminLoading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
              Loading incoming requests...
            </div>
          ) : filteredAdminEnquiries.length === 0 ? (
            <div className="mt-admin-empty-state">
              <h3>No requests found</h3>
              <p>There are currently no customer inquiries matching your filters.</p>
            </div>
          ) : (
            <div className="mt-admin-requests-list">
              {filteredAdminEnquiries.map((enq) => {
                const vendorName = enq.vendor?.name || "Assigned Vendor";
                const vendorCity = enq.vendor?.city || "";
                const isMusic = enq.serviceType === "Music";

                return (
                  <div className="mt-admin-card" key={enq._id}>
                    {/* Top Bar */}
                    <div className="mt-admin-card-top">
                      <div className="mt-admin-card-ids">
                        <span className="mt-admin-enq-id">{enq.enquiryNumber}</span>
                        <span className={`mt-admin-service-badge ${isMusic ? "music" : "tent"}`}>
                          {isMusic ? <Music size={12} /> : <Tent size={12} />}
                          {enq.category || (isMusic ? "DJ & Sound" : "Tent & Decor")}
                        </span>
                      </div>

                      <div className="mt-admin-card-status">
                        <span className={`mt-status-tag status-${(enq.status || "Pending").toLowerCase()}`}>
                          {enq.status}
                        </span>
                      </div>
                    </div>

                    {/* Main Grid: Customer Info & Event Details */}
                    <div className="mt-admin-card-grid">
                      {/* Customer Column */}
                      <div className="mt-admin-grid-col">
                        <div className="mt-admin-col-label">CUSTOMER DETAILS</div>
                        <div className="mt-admin-customer-name">{enq.customerName}</div>
                        <div className="mt-admin-contact-row">
                          <Phone size={13} color="#6b21a8" />
                          <a href={`tel:${enq.customerPhone}`} className="mt-admin-phone-link">
                            {enq.customerPhone}
                          </a>
                        </div>
                        {enq.customerEmail && (
                          <div className="mt-admin-email-row">{enq.customerEmail}</div>
                        )}
                      </div>

                      {/* Event Column */}
                      <div className="mt-admin-grid-col">
                        <div className="mt-admin-col-label">EVENT & LOCATION</div>
                        <div>
                          <strong>Date:</strong> {enq.eventDate}
                        </div>
                        <div>
                          <strong>Venue:</strong> {enq.eventLocation}
                        </div>
                        <div>
                          <strong>Guests:</strong> {enq.guestCount || 300} | <strong>Scale:</strong> {enq.durationHours ? `${enq.durationHours} Hours` : "Event Setup"}
                        </div>
                      </div>

                      {/* Vendor Column */}
                      <div className="mt-admin-grid-col">
                        <div className="mt-admin-col-label">SELECTED VENDOR</div>
                        <div style={{ fontWeight: "700", color: "#1e293b" }}>{vendorName}</div>
                        <div style={{ fontSize: "12.5px", color: "#64748b" }}>
                          {vendorCity} • {enq.vendor?.phone || "BKC Desk"}
                        </div>
                      </div>
                    </div>

                    {/* Customer Notes */}
                    {enq.customRequirements && (
                      <div className="mt-admin-notes-box">
                        <strong>Requirements / Notes:</strong> {enq.customRequirements}
                      </div>
                    )}

                    {/* Reference Images Preview */}
                    {Array.isArray(enq.referenceImages) && enq.referenceImages.length > 0 && (
                      <div className="mt-admin-photo-strip">
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>
                          Reference Photos ({enq.referenceImages.length}):
                        </span>
                        <div className="mt-admin-photo-thumbs">
                          {enq.referenceImages.map((img, idx) => (
                            <img
                              key={idx}
                              src={img.dataUrl}
                              alt={img.name || "Ref"}
                              onClick={() => setZoomPhoto(img.dataUrl)}
                              title="Click to view full size"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quotation / Vendor Notes Status */}
                    {enq.vendorNotes && (
                      <div className="mt-admin-quote-note-box">
                        <strong>Quotation / Admin Note:</strong> {enq.vendorNotes}
                      </div>
                    )}

                    {/* Admin Action Buttons */}
                    <div className="mt-admin-card-actions">
                      <div className="mt-admin-action-left">
                        <a href={`tel:${enq.customerPhone}`} className="mt-btn-call">
                          <Phone size={13} /> Call Customer
                        </a>
                      </div>

                      <div className="mt-admin-action-right">
                        <button
                          className="mt-btn-quote"
                          onClick={() => {
                            setAdminQuoteModal(enq);
                            setAdminQuoteAmount("18000");
                            setAdminQuoteNotes(
                              `Official quotation for ${enq.category || "DJ & Sound"} on ${enq.eventDate}. Setup & sound crew included.`
                            );
                          }}
                        >
                          <IndianRupee size={13} /> Send Quotation
                        </button>

                        {enq.status !== "Confirmed" ? (
                          <button
                            className="mt-btn-confirm"
                            onClick={() => handleAdminConfirm(enq._id)}
                          >
                            <CheckCircle size={13} /> Confirm Booking
                          </button>
                        ) : (
                          <button
                            className="mt-btn-pending"
                            onClick={() => handleAdminUpdateStatus(enq._id, "Pending")}
                          >
                            Mark Pending
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          MODAL 1: CLEAN VENDOR DETAIL POPUP
          ============================================================ */}
      {selectedVendor && (
        <div className="mt-modal-backdrop" onClick={() => setSelectedVendor(null)}>
          <div className="mt-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="mt-modal-close" onClick={() => setSelectedVendor(null)}>
              <X size={18} />
            </button>

            {/* Photo */}
            <div style={{ height: "180px", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
              <img
                src={
                  selectedVendor.themePortfolios?.[0]?.imageUrl ||
                  DEFAULT_COVERS[selectedVendor.serviceType] ||
                  DEFAULT_COVERS.Music
                }
                alt={selectedVendor.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", color: "#0f172a" }}>{selectedVendor.name}</h2>
              <div className="mt-card-rating">
                <Star size={13} fill="#f59e0b" color="#f59e0b" />
                <span>{selectedVendor.rating || 4.9}</span>
              </div>
            </div>

            <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px" }}>
              {selectedVendor.locality ? `${selectedVendor.locality}, ` : ""}
              {selectedVendor.city} • Serves radius up to {selectedVendor.serviceRadiusKm || 50} km
            </div>

            <p style={{ fontSize: "13.5px", lineHeight: "1.5", color: "#475569", margin: "0 0 16px" }}>
              {selectedVendor.description}
            </p>

            {/* What's Included */}
            {selectedVendor.packages?.[0] && (
              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", marginBottom: "18px" }}>
                <div style={{ fontWeight: "700", fontSize: "13px", marginBottom: "6px" }}>
                  Popular Package: {selectedVendor.packages[0].name}
                </div>
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12.5px", color: "#475569" }}>
                  {(selectedVendor.packages[0].inclusions || []).map((inc, i) => (
                    <li key={i}>{inc}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button className="mt-btn-outline" onClick={() => setSelectedVendor(null)}>
                Close
              </button>
              <button
                className="mt-btn-primary"
                onClick={() => {
                  const v = selectedVendor;
                  setSelectedVendor(null);
                  setQuoteModalVendor(v);
                }}
              >
                Request Free Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 2: SIMPLE 4-FIELD QUOTE FORM (CUSTOMER SUBMISSION)
          ============================================================ */}
      {quoteModalVendor && (
        <div className="mt-modal-backdrop" onClick={() => setQuoteModalVendor(null)}>
          <div className="mt-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="mt-modal-close" onClick={() => setQuoteModalVendor(null)}>
              <X size={18} />
            </button>

            <h2 style={{ margin: "0 0 4px", fontSize: "19px" }}>Request Free Quote</h2>
            <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
              Selected: <strong>{quoteModalVendor.name}</strong> ({quoteModalVendor.city})
            </div>

            <form onSubmit={handleSendQuote}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="mt-form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    required
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="mt-form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "10px" }}>
                <div className="mt-form-group">
                  <label>Event Date *</label>
                  <input
                    type="date"
                    required
                    value={quoteForm.eventDate}
                    onChange={(e) => setQuoteForm((p) => ({ ...p, eventDate: e.target.value }))}
                  />
                </div>
                <div className="mt-form-group">
                  <label>Guest Count</label>
                  <input
                    type="number"
                    value={quoteForm.guests}
                    onChange={(e) => setQuoteForm((p) => ({ ...p, guests: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="mt-form-group">
                <label>Event Venue / Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taj Lands End Banquet, Bandra, Mumbai"
                  value={quoteForm.eventLocation}
                  onChange={(e) => setQuoteForm((p) => ({ ...p, eventLocation: e.target.value }))}
                />
              </div>

              <div className="mt-form-group">
                <label>Notes / Song or Theme Preferences (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Punjabi dhol + Bollywood DJ for Sangeet night..."
                  value={quoteForm.notes}
                  onChange={(e) => setQuoteForm((p) => ({ ...p, notes: e.target.value }))}
                ></textarea>
              </div>

              {/* Photo Upload */}
              <div className="mt-form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Upload size={13} /> Attach reference photo (Optional)
                </label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {quoteForm.referenceImages.length > 0 && (
                  <div style={{ fontSize: "12px", color: "#16a34a", marginTop: "2px" }}>
                    ✓ Attached {quoteForm.referenceImages.length} image
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button
                  type="button"
                  className="mt-btn-outline"
                  onClick={() => setQuoteModalVendor(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="mt-btn-primary">
                  <Send size={13} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Send Request to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 3: ADMIN SEND QUOTATION POPUP
          ============================================================ */}
      {adminQuoteModal && (
        <div className="mt-modal-backdrop" onClick={() => setAdminQuoteModal(null)}>
          <div className="mt-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="mt-modal-close" onClick={() => setAdminQuoteModal(null)}>
              <X size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <ShieldCheck size={20} color="#6b21a8" />
              <h2 style={{ margin: 0, fontSize: "19px" }}>Dispatch Admin Quotation</h2>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#64748b" }}>
              Sending official price quotation for Request <strong>{adminQuoteModal.enquiryNumber}</strong>
            </p>

            <div className="mt-admin-quote-summary">
              <div>
                <span>Customer:</span> <strong>{adminQuoteModal.customerName} ({adminQuoteModal.customerPhone})</strong>
              </div>
              <div>
                <span>Vendor:</span> <strong>{adminQuoteModal.vendor?.name || adminQuoteModal.category}</strong>
              </div>
              <div>
                <span>Event Date:</span> <strong>{adminQuoteModal.eventDate}</strong>
              </div>
              <div>
                <span>Venue:</span> <strong>{adminQuoteModal.eventLocation}</strong>
              </div>
            </div>

            <form onSubmit={handleAdminSubmitQuote}>
              <div className="mt-form-group" style={{ marginTop: "14px" }}>
                <label>Quotation Total Amount (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 18000"
                  value={adminQuoteAmount}
                  onChange={(e) => setAdminQuoteAmount(e.target.value)}
                />
              </div>

              <div className="mt-form-group">
                <label>Inclusions & Admin Notes to Customer</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Package includes 4 Hours DJ performance, 2 Wireless Mics, 4-Point sound system & intelligent lights."
                  value={adminQuoteNotes}
                  onChange={(e) => setAdminQuoteNotes(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "18px" }}>
                <button
                  type="button"
                  className="mt-btn-outline"
                  onClick={() => setAdminQuoteModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="mt-btn-primary" style={{ background: "#6b21a8" }}>
                  <Send size={13} style={{ marginRight: "4px" }} /> Send Official Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 4: IMAGE ZOOM VIEWER
          ============================================================ */}
      {zoomPhoto && (
        <div className="mt-modal-backdrop" onClick={() => setZoomPhoto(null)}>
          <div
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              background: "#000",
              borderRadius: "16px",
              padding: "8px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomPhoto(null)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "rgba(0,0,0,0.6)",
                border: "none",
                color: "#fff",
                borderRadius: "50%",
                width: 32,
                height: 32,
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
              }}
            >
              <X size={18} />
            </button>
            <img
              src={zoomPhoto}
              alt="Reference Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                display: "block",
                borderRadius: "12px",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
