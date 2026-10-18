import { useState, useEffect } from "react";
import logoImg from "./assets/logo.jpg";
import FoodPlanner from "./FoodPlanner";
import Auth from "./Auth";
import UniversalHeader from "./components/UniversalHeader";
import UniversalFooter from "./components/UniversalFooter";
import AdminLoginModal from "./components/AdminLoginModal";
import ProfileManager from "./components/ProfileManager";
import AboutUsView from "./components/AboutUsView";
import InvitationSection from "./components/InvitationSection";
import {
  Home,
  CalendarDays,
  Utensils,
  Wallet,
  UserRound,
  MapPin,
  Music,
  Flower2,
  Tent,
  ChefHat,
  Heart,
  Mail,
  ArrowRight,
  Sparkles,
  Phone,
  CheckCircle,
  Building,
  Info,
} from "lucide-react";
import "./index.css";
import "./UniversalLayout.css";

// ==========================================
// FEATURE URL ROUTE MAPPING
// ==========================================
export const ROUTE_MAP = {
  "/": "Home",
  "/home": "Home",
  "/venues": "Venue",
  "/venue": "Venue",
  "/food-planner": "Food",
  "/food": "Food",
  "/invitations": "Invitation",
  "/invitation": "Invitation",
  "/cards": "Invitation",
  "/dj-sound": "DJ & Stage",
  "/tent-decor": "Tent & Decor",
  "/bhandari": "Bhandari",
  "/jaimala-stage": "Jaimala Stage",
  "/sweets-drinks": "Sweets & Drinks",
  "/about": "About",
  "/about-us": "About",
  "/contact": "Contact",
  "/location": "Contact",
  "/profile": "Profile",
  "/bookings": "Bookings",
};

export const PAGE_TO_ROUTE = {
  Home: "/",
  Venue: "/venues",
  Food: "/food-planner",
  Invitation: "/invitations",
  "DJ & Stage": "/dj-sound",
  "Tent & Decor": "/tent-decor",
  Bhandari: "/bhandari",
  "Jaimala Stage": "/jaimala-stage",
  "Sweets & Drinks": "/sweets-drinks",
  About: "/about",
  Contact: "/contact",
  Profile: "/profile",
  Bookings: "/bookings",
};

const services = [
  { name: "Venue Booking", desc: "Hall, home, farm & resorts", icon: MapPin, page: "Venue" },
  { name: "Food Planning", desc: "Veg & Non-Veg custom menu", icon: Utensils, page: "Food" },
  { name: "DJ & Sound", desc: "Music, intelligent lighting", icon: Music, page: "DJ & Stage" },
  { name: "Tent & Decor", desc: "Royal theme decorations", icon: Tent, page: "Tent & Decor" },
  { name: "Bhandari", desc: "Traditional cooking masters", icon: ChefHat, page: "Bhandari" },
  { name: "Invitation", desc: "Custom cards & RSVP", icon: Mail, page: "Invitation" },
  { name: "Jaimala Stage", desc: "Cinematic stage design", icon: Flower2, page: "Jaimala Stage" },
  { name: "Sweets & Drinks", desc: "Mithai, mocktails & water", icon: Heart, page: "Sweets & Drinks" },
];

export default function App() {
  const getInitialPage = () => {
    if (typeof window === "undefined") return "Home";
    const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
    return ROUTE_MAP[path || "/"] || "Home";
  };

  const [page, setPageState] = useState(getInitialPage);
  const [dark, setDark] = useState(false);

  function navigateTo(target) {
    let targetPage = "Home";
    let targetRoute = "/";

    if (PAGE_TO_ROUTE[target]) {
      targetPage = target;
      targetRoute = PAGE_TO_ROUTE[target];
    } else if (ROUTE_MAP[target?.toLowerCase()]) {
      targetPage = ROUTE_MAP[target.toLowerCase()];
      targetRoute = target.toLowerCase();
    } else {
      targetPage = target || "Home";
      targetRoute = PAGE_TO_ROUTE[targetPage] || "/";
    }

    setPageState(targetPage);
    if (typeof window !== "undefined" && window.location.pathname !== targetRoute) {
      window.history.pushState({ page: targetPage }, "", targetRoute);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Handle browser back and forward button navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      const targetPage = ROUTE_MAP[path || "/"] || "Home";
      setPageState(targetPage);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // User Auth State
  const [authData, setAuthData] = useState(() => {
    try {
      const saved = sessionStorage.getItem("shaadiAuth");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Admin Auth State
  const [adminData, setAdminData] = useState(() => {
    try {
      const saved = sessionStorage.getItem("milapAdmin");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modal States
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  function handleLogin(data) {
    sessionStorage.setItem("shaadiAuth", JSON.stringify(data));
    setAuthData(data);
    setAuthModalOpen(false);
  }

  function handleLogout() {
    sessionStorage.removeItem("shaadiAuth");
    setAuthData(null);
  }

  function handleAdminLogin(session) {
    sessionStorage.setItem("milapAdmin", JSON.stringify(session));
    setAdminData(session);
  }

  function handleAdminLogout() {
    sessionStorage.removeItem("milapAdmin");
    setAdminData(null);
  }

  function handleUpdateProfile(updatedData) {
    sessionStorage.setItem("shaadiAuth", JSON.stringify(updatedData));
    setAuthData(updatedData);
  }

  const navigation = [
    { name: "Home", icon: Home },
    { name: "Bookings", icon: CalendarDays },
    { name: "Food", icon: Utensils },
    { name: "About", icon: Info },
    { name: "Profile", icon: UserRound },
  ];

  return (
    <div className={dark ? "app dark" : "app"}>
      {/* UNIVERSAL HEADER */}
      <UniversalHeader
        page={page}
        setPage={navigateTo}
        dark={dark}
        setDark={setDark}
        authData={authData}
        adminData={adminData}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* MAIN VIEW CONTENT */}
      <main className="main">
        {page === "Home" ? (
          <>
            {/* Hero Section */}
            <section className="hero">
              <div className="hero-content">
                <span className="hero-tag">
                  <Sparkles size={14} /> YOUR DREAM WEDDING
                </span>

                <h1>
                  Shaadi ki har taiyari,
                  <br />
                  <span>ab ek hi jagah.</span>
                </h1>

                <p>
                  BKC Mumbai Headquarters se lekar pan-India destination venues,
                  catering, decoration aur budget — sab kuch transparent aur aasan.
                </p>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
                  <button
                    className="hero-btn"
                    onClick={() => navigateTo("Food")}
                  >
                    Calculate Food Budget <ArrowRight size={17} />
                  </button>
                  <button
                    className="outline-btn"
                    style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}
                    onClick={() => navigateTo("About")}
                  >
                    <Info size={15} /> About Us
                  </button>
                </div>
              </div>

              {/* Watermark Logo */}
              <div className="hero-heart">
                <img src={logoImg} alt="Milap Watermark" className="hero-logo-watermark" />
              </div>

              <div className="hero-bottom">
                <span>✓ 10,000+ Verified Couples</span>
                <span>✓ Central Mumbai Office (BKC)</span>
                <span>✓ 24/7 Concierge Hotline</span>
              </div>
            </section>

            {/* Services Overview */}
            <div className="welcome-row">
              <div>
                <p className="muted">WELCOME TO YOUR WEDDING PLANNER</p>
                <h2>What would you like to plan?</h2>
              </div>
              <span className="step-label">8 WEDDING SERVICES</span>
            </div>

            <section className="service-grid">
              {services.map(({ name, desc, icon: Icon, page: target }, i) => (
                <button
                  className="service-card"
                  key={name}
                  onClick={() => navigateTo(target)}
                >
                  <span className={`service-icon tone-${i % 4}`}>
                    <Icon size={23} />
                  </span>
                  <strong>{name}</strong>
                  <small>{desc}</small>
                  <ArrowRight className="service-arrow" size={16} />
                </button>
              ))}
            </section>

            {/* Wedding Planning Summary Card */}
            <section className="summary-card">
              <div>
                <span className="muted">COMPLETE TRANSPARENCY</span>
                <h3>Corporate Headquarters & Experience Center</h3>
                <p>
                  Visit our flagship studio at Bandra Kurla Complex (BKC), Mumbai
                  to discuss your theme, sample culinary menus, and consult with our
                  head event directors.
                </p>
              </div>
              <button
                className="outline-btn"
                onClick={() => navigateTo("About")}
              >
                Learn About Milap <ArrowRight size={15} />
              </button>
            </section>
          </>
        ) : page === "Food" ? (
          <FoodPlanner />
        ) : page === "About" || page === "Contact" ? (
          <AboutUsView onOpenAdmin={() => setAdminModalOpen(true)} />
        ) : page === "Invitation" ? (
          <InvitationSection
            onBackHome={() => navigateTo("Home")}
            onOpenContact={() => navigateTo("Contact")}
          />
        ) : page === "Profile" ? (
          authData ? (
            <ProfileManager
              authData={authData}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
            />
          ) : (
            <div style={{ maxWidth: 480, margin: "30px auto" }}>
              <Auth onLogin={handleLogin} />
            </div>
          )
        ) : page === "Bookings" ? (
          <section className="page-panel">
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#fdf0f4", display: "grid", placeItems: "center", color: "#941b45" }}>
                <CalendarDays size={24} />
              </div>
              <div>
                <h2 style={{ margin: "0 0 4px", color: "#881337" }}>Your Event Bookings</h2>
                <p style={{ margin: 0, color: "#777", fontSize: 13 }}>Track your venues, catering milestones, and artist schedules</p>
              </div>
            </div>

            {authData ? (
              <div style={{ background: "#fcf8fa", padding: "24px", borderRadius: "14px", border: "1px solid #fae2e8", textAlign: "center" }}>
                <CheckCircle size={36} color="#27ae60" style={{ margin: "0 auto 10px" }} />
                <h3>Account Connected: {authData.user?.fullName || authData.user?.username}</h3>
                <p style={{ maxWidth: 480, margin: "0 auto 18px", color: "#666", fontSize: 14 }}>
                  Wedding planning consultation is active with our Mumbai BKC headquarters team.
                  Update your guest and catering details in your profile.
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button className="primary-btn" onClick={() => navigateTo("Profile")}>
                    Update Profile Details
                  </button>
                  <button className="outline-btn" onClick={() => navigateTo("Food")}>
                    Manage Food Plan
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: "#fcf8fa", padding: "30px", borderRadius: "14px", border: "1px solid #fae2e8", textAlign: "center" }}>
                <UserRound size={36} color="#941b45" style={{ margin: "0 auto 10px" }} />
                <h3>Login Required to View Bookings</h3>
                <p style={{ maxWidth: 450, margin: "0 auto 18px", color: "#666", fontSize: 14 }}>
                  Please login or register your couple account to manage your event schedule and vendor bookings.
                </p>
                <button className="primary-btn" onClick={() => setAuthModalOpen(true)}>
                  Login / Register Now
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="page-panel">
            <h2>{page}</h2>
            <p>
              Our team at the Milap BKC Corporate Office is coordinating premier services for {page}.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
              <button className="primary-btn" onClick={() => navigateTo("Contact")}>
                Inquire with BKC Office
              </button>
              <button className="outline-btn" onClick={() => navigateTo("Home")}>
                Back to Home
              </button>
            </div>
          </section>
        )}
      </main>

      {/* UNIVERSAL FOOTER (GREY BACKGROUND) */}
      <UniversalFooter
        setPage={navigateTo}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* ADMIN LOGIN MODAL */}
      <AdminLoginModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        adminData={adminData}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
      />

      {/* USER LOGIN MODAL */}
      {authModalOpen && !authData && (
        <div className="modal-backdrop" onClick={() => setAuthModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Auth
              onLogin={handleLogin}
              onClose={() => setAuthModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION FOR MOBILE */}
      <nav className="bottom-nav">
        {navigation.map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={page === name ? "nav-item active" : "nav-item"}
            onClick={() => navigateTo(name)}
          >
            <Icon size={21} />
            <span>{name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
