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
  Navigation,
  Compass,
} from "lucide-react";
import { API_BASE } from "../apiConfig";
import { DEFAULT_VENDORS } from "./musicTentVendorsData";
import "./MusicTentServiceView.css";

// Coordinates for Indian wedding hubs
const CITY_COORDINATES = {
  Mumbai: { lat: 19.076, lng: 72.8777 },
  "Delhi NCR": { lat: 28.6139, lng: 77.209 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
};

// Haversine distance calculator in kilometers
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
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

// Fallback high quality imagery for wedding vendors
const DEFAULT_COVERS = {
  Music: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=700&q=80",
  TentDecor: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80",
  Both: "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=700&q=80",
};

export default function MusicTentServiceView({
  authData,
  initialMode = "All", // "All" | "Music" | "TentDecor"
  onOpenAuth,
  onBackHome,
}) {
  // Service mode: "Music" or "TentDecor" (or "All")
  const [activeMode, setActiveMode] = useState(
    initialMode === "DJ & Stage" ? "Music" : initialMode === "Tent & Decor" ? "TentDecor" : "Music"
  );

  // Tabs: "browse" | "estimator" | "my_quotes"
  const [activeTab, setActiveTab] = useState("browse");

  // Vendors list: initialized immediately with 12 DJ & Sound vendors + 4 Tent Decorators
  const [vendors, setVendors] = useState(DEFAULT_VENDORS);
  const [loading, setLoading] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Location-based Search & Distance
  const [userCoords, setUserCoords] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationStatusText, setLocationStatusText] = useState("");
  const [maxDistanceFilter, setMaxDistanceFilter] = useState("All"); // "All" | "25" | "50" | "100"
  const [sortBy, setSortBy] = useState("default"); // "default" | "distance" | "rating" | "price_asc" | "price_desc"

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

  // Fetch Vendors from backend API to sync any fresh database additions
  useEffect(() => {
    async function loadVendors() {
      try {
        const res = await fetch(`${API_BASE}/api/music-tent/vendors`);
        const data = await res.json();
        if (data.success && Array.isArray(data.vendors) && data.vendors.length > 0) {
          setVendors(data.vendors);
        }
      } catch (err) {
        console.warn("Could not load vendors from API, showing default vendors:", err);
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

  // Active Center Coordinates for distance measurement
  const activeCenterCoords = useMemo(() => {
    if (userCoords) return userCoords;
    if (selectedCity !== "All" && CITY_COORDINATES[selectedCity]) {
      return CITY_COORDINATES[selectedCity];
    }
    return null;
  }, [userCoords, selectedCity]);

  // Handle GPS "Near Me" Location Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please select a city.");
      return;
    }
    setDetectingLocation(true);
    setLocationStatusText("Detecting your location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setDetectingLocation(false);

        // Find nearest city
        let nearestCity = "All";
        let minD = Infinity;
        Object.entries(CITY_COORDINATES).forEach(([cName, coords]) => {
          const d = calculateDistanceKm(latitude, longitude, coords.lat, coords.lng);
          if (d < minD) {
            minD = d;
            nearestCity = cName;
          }
        });

        if (minD <= 120) {
          setSelectedCity(nearestCity);
          setLocationStatusText(`📍 Detected near ${nearestCity} (~${Math.round(minD)} km away)`);
        } else {
          setSelectedCity("All");
          setLocationStatusText(`📍 GPS Active (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`);
        }
        setSortBy("distance");
      },
      (err) => {
        setDetectingLocation(false);
        console.warn("Geolocation error:", err.message);
        setLocationStatusText("Location permission not granted. Please pick a city manually.");
      },
      { timeout: 9000, enableHighAccuracy: false }
    );
  };

  // Dynamic City Pills with Count
  const cityPills = useMemo(() => {
    const modeVendors = vendors.filter((v) => {
      if (activeMode === "Music" && v.serviceType === "TentDecor") return false;
      if (activeMode === "TentDecor" && v.serviceType === "Music") return false;
      return true;
    });

    const counts = { All: modeVendors.length };
    Object.keys(CITY_COORDINATES).forEach((city) => {
      counts[city] = modeVendors.filter(
        (v) => v.city === city || (v.extendedServiceAreas || []).includes(city)
      ).length;
    });

    return [
      { name: "All", label: "🇮🇳 All India", count: counts.All },
      ...Object.keys(CITY_COORDINATES).map((city) => ({
        name: city,
        label: city,
        count: counts[city] || 0,
      })),
    ];
  }, [vendors, activeMode]);

  // Open Quote Modal with Auto-Filled Location
  const openQuoteModal = (vendor) => {
    setQuoteModalVendor(vendor);
    setQuoteForm((prev) => ({
      ...prev,
      eventLocation:
        prev.eventLocation ||
        (selectedCity !== "All"
          ? `${selectedCity}`
          : vendor.locality ? `${vendor.locality}, ${vendor.city}` : vendor.city),
    }));
  };

  // Filtered & Distance-Calculated Vendors
  const filteredVendors = useMemo(() => {
    const list = vendors.map((v) => {
      let distanceKm = null;
      if (activeCenterCoords && v.coordinates?.lat && v.coordinates?.lng) {
        distanceKm = calculateDistanceKm(
          activeCenterCoords.lat,
          activeCenterCoords.lng,
          v.coordinates.lat,
          v.coordinates.lng
        );
      }
      const isWithinService =
        distanceKm !== null
          ? distanceKm <= (v.serviceRadiusKm || 60)
          : selectedCity === "All" || v.city === selectedCity || (v.extendedServiceAreas || []).includes(selectedCity);

      return {
        ...v,
        distanceKm,
        isWithinService,
      };
    });

    const result = list.filter((v) => {
      // 1. Service Type
      if (activeMode === "Music" && v.serviceType === "TentDecor") return false;
      if (activeMode === "TentDecor" && v.serviceType === "Music") return false;

      // 2. City / Location
      if (selectedCity !== "All") {
        const matchesCity =
          v.city === selectedCity ||
          (v.extendedServiceAreas || []).includes(selectedCity) ||
          (v.distanceKm !== null && v.distanceKm <= (v.serviceRadiusKm || 60));
        if (!matchesCity) return false;
      }

      // 3. Max Distance Filter
      if (maxDistanceFilter !== "All" && v.distanceKm !== null) {
        if (v.distanceKm > Number(maxDistanceFilter)) return false;
      }

      // 4. Verified only
      if (verifiedOnly && v.verificationStatus !== "Verified") return false;

      // 5. Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = v.name?.toLowerCase().includes(q);
        const matchesCity = v.city?.toLowerCase().includes(q);
        const matchesLoc = v.locality?.toLowerCase().includes(q);
        const matchesCat = (v.categories || []).some((c) => c.toLowerCase().includes(q));
        const matchesDesc = v.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesLoc && !matchesCat && !matchesDesc) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "distance") {
        const da = a.distanceKm != null ? a.distanceKm : 99999;
        const db = b.distanceKm != null ? b.distanceKm : 99999;
        return da - db;
      }
      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "price_asc") {
        const pa = a.packages?.[0]?.price || 0;
        const pb = b.packages?.[0]?.price || 0;
        return pa - pb;
      }
      if (sortBy === "price_desc") {
        const pa = a.packages?.[0]?.price || 0;
        const pb = b.packages?.[0]?.price || 0;
        return pb - pa;
      }
      if (userCoords) {
        const da = a.distanceKm != null ? a.distanceKm : 99999;
        const db = b.distanceKm != null ? b.distanceKm : 99999;
        return da - db;
      }
      return 0;
    });

    return result;
  }, [
    vendors,
    activeMode,
    selectedCity,
    maxDistanceFilter,
    verifiedOnly,
    searchQuery,
    sortBy,
    activeCenterCoords,
    userCoords,
  ]);

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
        setSubmitSuccess("Quotation request sent! The vendor will contact you shortly.");
        setQuoteModalVendor(null);
        setQuoteForm((prev) => ({
          ...prev,
          notes: "",
          referenceImages: [],
        }));
        loadEnquiries();
        setTimeout(() => setSubmitSuccess(""), 6000);
      } else {
        alert(data?.message || `Request failed with error status: ${res.status}`);
      }
    } catch (err) {
      alert("Error sending request: " + (err.message || "Network issue"));
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

  return (
    <div className="mt-page-wrapper">
      {/* ============================================================
          1. CLEAN HEADER & 2-BUTTON SERVICE SWITCHER
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

      {/* Success Banner */}
      {submitSuccess && (
        <div
          style={{
            background: "#dcfce7",
            border: "1px solid #86efac",
            color: "#166534",
            padding: "12px 18px",
            borderRadius: "12px",
            marginBottom: "18px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckCircle size={18} color="#16a34a" /> {submitSuccess}
        </div>
      )}

      {/* ============================================================
          2. SIMPLE NAVIGATION BAR (3 TABS)
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
      </div>

      {/* ============================================================
          TAB 1: BROWSE VENDORS (CLEAN & LOCATION-AWARE)
          ============================================================ */}
      {activeTab === "browse" && (
        <div>
          {/* Quick Location / City Pills Bar */}
          <div className="mt-city-pills-bar">
            <div className="mt-city-pills-label">
              <MapPin size={14} color="#7c3aed" />
              <span>Location:</span>
            </div>
            <div className="mt-city-pills-scroll">
              {cityPills.map((pill) => (
                <button
                  key={pill.name}
                  className={`mt-city-pill ${selectedCity === pill.name && !userCoords ? "active" : ""}`}
                  onClick={() => {
                    setSelectedCity(pill.name);
                    setUserCoords(null);
                    if (pill.name === "All") {
                      setLocationStatusText("");
                    } else {
                      setLocationStatusText(`📍 Filtered for ${pill.name} & service radius`);
                    }
                  }}
                >
                  <span>{pill.label}</span>
                  <span className="mt-pill-count">{pill.count}</span>
                </button>
              ))}
            </div>

            {/* GPS "Near Me" Button */}
            <button
              className={`mt-detect-gps-btn ${detectingLocation ? "detecting" : ""} ${userCoords ? "active" : ""}`}
              onClick={handleDetectLocation}
              title="Detect your current location"
            >
              <Navigation size={13} />
              <span>{detectingLocation ? "Detecting..." : userCoords ? "GPS Active" : "Near Me"}</span>
            </button>
          </div>

          {/* Location Status & Active Filters Banner */}
          {(locationStatusText || selectedCity !== "All" || maxDistanceFilter !== "All" || userCoords) && (
            <div className="mt-location-status-banner">
              <div className="mt-location-status-left">
                <Compass size={14} color="#7c3aed" />
                <span>
                  {locationStatusText || `📍 Location: ${selectedCity}`}
                  {maxDistanceFilter !== "All" ? ` • Within ${maxDistanceFilter} km` : ""}
                  {` • Showing ${filteredVendors.length} provider(s)`}
                </span>
              </div>
              <button
                className="mt-location-reset-btn"
                onClick={() => {
                  setSelectedCity("All");
                  setUserCoords(null);
                  setMaxDistanceFilter("All");
                  setLocationStatusText("");
                  setSortBy("default");
                }}
              >
                Reset Location
              </button>
            </div>
          )}

          {/* Search, City, Distance & Sort Bar */}
          <div className="mt-search-bar">
            <div className="mt-search-input-wrap">
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder={
                  activeMode === "Music"
                    ? "Search DJs, bands, shehnai, sound systems, locality..."
                    : "Search mandaps, tents, floral decor, stages, locality..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* City Selector */}
            <select
              className="mt-filter-select"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setUserCoords(null);
                if (e.target.value === "All") {
                  setLocationStatusText("");
                } else {
                  setLocationStatusText(`📍 Filtered for ${e.target.value}`);
                }
              }}
            >
              <option value="All">All Cities (Pan-India)</option>
              {Object.keys(CITY_COORDINATES).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Distance Radius Filter */}
            <select
              className="mt-filter-select"
              value={maxDistanceFilter}
              onChange={(e) => setMaxDistanceFilter(e.target.value)}
              title="Filter by distance from location"
            >
              <option value="All">Any Distance</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
              <option value="100">Within 100 km</option>
            </select>

            {/* Sort Dropdown */}
            <select
              className="mt-filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              title="Sort vendors"
            >
              <option value="default">Sort: Recommended</option>
              <option value="distance">Sort: Nearest Distance</option>
              <option value="rating">Sort: Top Rated</option>
              <option value="price_asc">Sort: Price (Low to High)</option>
              <option value="price_desc">Sort: Price (High to Low)</option>
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
              <h3 style={{ margin: "0 0 6px", color: "#334155" }}>No services found in this location</h3>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>
                Try selecting "All India" or expanding your distance radius.
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
                      <img
                        src={cover}
                        alt={vendor.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            vendor.serviceType === "TentDecor"
                              ? DEFAULT_COVERS.TentDecor
                              : DEFAULT_COVERS.Music;
                        }}
                      />
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

                      {/* Location & Distance Line */}
                      <div className="mt-card-location-row">
                        <div className="mt-card-location">
                          <MapPin size={13} color="#7c3aed" />
                          <span>
                            {vendor.locality ? `${vendor.locality}, ` : ""}
                            {vendor.city}
                          </span>
                        </div>
                        {vendor.distanceKm !== null && (
                          <span
                            className={`mt-distance-badge ${
                              vendor.isWithinService ? "nearby" : "outstation"
                            }`}
                            title={
                              vendor.isWithinService
                                ? `Within service area (${vendor.serviceRadiusKm || 50} km)`
                                : `Outstation distance: travel surcharge may apply`
                            }
                          >
                            <Navigation size={10} /> {vendor.distanceKm} km away
                          </span>
                        )}
                      </div>

                      {/* Coverage Info */}
                      <div className="mt-card-coverage-info">
                        <span>✓ Serves up to {vendor.serviceRadiusKm || 50} km</span>
                        {vendor.extendedServiceAreas?.length > 0 && (
                          <span className="mt-coverage-extended">
                            • Covers: {vendor.extendedServiceAreas.slice(0, 2).join(", ")}
                          </span>
                        )}
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
                            onClick={() => openQuoteModal(vendor)}
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
          TAB 2: QUICK PRICE ESTIMATOR (SIMPLE 3 SLIDERS)
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
          TAB 3: MY QUOTES
          ============================================================ */}
      {activeTab === "my_quotes" && (
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: "20px" }}>My Quotation Requests</h2>
          <p style={{ margin: "0 0 18px", color: "#64748b", fontSize: "13.5px" }}>
            Track vendor responses and confirmed dates.
          </p>

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
              <h3>No quotation requests yet</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                Click "Get Quote" on any vendor card to receive an official price quotation.
              </p>
              <button className="mt-btn-primary" onClick={() => setActiveTab("browse")}>
                Find Vendors
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {enquiries.map((enq) => (
                <div
                  key={enq._id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "16px 20px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <strong>{enq.category}</strong>
                    <span
                      style={{
                        padding: "3px 9px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "700",
                        background: enq.status === "Confirmed" ? "#dcfce7" : "#fef3c7",
                        color: enq.status === "Confirmed" ? "#166534" : "#92400e",
                      }}
                    >
                      {enq.status}
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>
                    Event Date: {enq.eventDate} • Venue: {enq.eventLocation}
                  </div>
                  {enq.customRequirements && (
                    <div style={{ fontSize: "12.5px", color: "#334155", marginTop: "6px" }}>
                      Note: {enq.customRequirements}
                    </div>
                  )}
                </div>
              ))}
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
                onError={(e) => {
                  e.currentTarget.src =
                    selectedVendor.serviceType === "TentDecor"
                      ? DEFAULT_COVERS.TentDecor
                      : DEFAULT_COVERS.Music;
                }}
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

            {/* Location & Coverage Breakdown */}
            <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", padding: "12px 14px", borderRadius: "10px", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "13px", color: "#5b21b6", marginBottom: "4px" }}>
                <MapPin size={14} color="#7c3aed" /> Service Location & Coverage
              </div>
              <div style={{ fontSize: "12.5px", color: "#4c1d95" }}>
                Base: <strong>{selectedVendor.locality ? `${selectedVendor.locality}, ` : ""}{selectedVendor.city}</strong>
                {selectedVendor.serviceRadiusKm ? ` • Local transit included up to ${selectedVendor.serviceRadiusKm} km` : ""}
              </div>
              {selectedVendor.extendedServiceAreas?.length > 0 && (
                <div style={{ fontSize: "12px", color: "#6b21a8", marginTop: "4px" }}>
                  Also serves: {selectedVendor.extendedServiceAreas.join(", ")}
                </div>
              )}
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
                  openQuoteModal(v);
                }}
              >
                Request Free Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 2: SIMPLE 4-FIELD QUOTE FORM
          ============================================================ */}
      {quoteModalVendor && (
        <div className="mt-modal-backdrop" onClick={() => setQuoteModalVendor(null)}>
          <div className="mt-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="mt-modal-close" onClick={() => setQuoteModalVendor(null)}>
              <X size={18} />
            </button>

            <h2 style={{ margin: "0 0 4px", fontSize: "19px" }}>Request Free Quote</h2>
            <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>
              Vendor: <strong>{quoteModalVendor.name}</strong>
            </div>

            {/* Location Verification Tag */}
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                padding: "8px 12px",
                borderRadius: "8px",
                marginBottom: "14px",
                fontSize: "12px",
                color: "#166534",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <MapPin size={13} color="#16a34a" />
              <span>
                Based in <strong>{quoteModalVendor.locality ? `${quoteModalVendor.locality}, ` : ""}{quoteModalVendor.city}</strong> (Service Radius: {quoteModalVendor.serviceRadiusKm || 50} km)
              </span>
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
                <label>Event Venue / City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taj Hotel Banquet, Bandra, Mumbai"
                  value={quoteForm.eventLocation}
                  onChange={(e) => setQuoteForm((p) => ({ ...p, eventLocation: e.target.value }))}
                />
              </div>

              <div className="mt-form-group">
                <label>Notes / Song or Theme Preferences (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Bollywood songs for Sangeet, Royal Red Mandap theme..."
                  value={quoteForm.notes}
                  onChange={(e) => setQuoteForm((p) => ({ ...p, notes: e.target.value }))}
                ></textarea>
              </div>

              {/* Simple Photo Upload */}
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
                  <Send size={13} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
