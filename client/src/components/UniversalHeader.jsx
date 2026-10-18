import { useState, useRef, useEffect } from "react";
import logoImg from "../assets/logo.jpg";
import { CARD_STUDIO_URL } from "../apiConfig";
import {
  Sun,
  Moon,
  Lock,
  UserRound,
  LogOut,
  Menu,
  X,
  MapPin,
  CalendarDays,
  Utensils,
  Home,
  ShieldCheck,
  Phone,
  ChevronDown,
  Sparkles,
  Tent,
  Music,
  Flower2,
  ChefHat,
  Mail,
  Heart,
  Grid,
  Info,
} from "lucide-react";

const navServicesList = [
  { name: "Venue Booking", desc: "Hall, farm & resorts", icon: MapPin, page: "Venue" },
  { name: "Food Planning", desc: "Veg & Non-Veg menu", icon: Utensils, page: "Food" },
  { name: "DJ & Sound", desc: "Music & intelligent lighting", icon: Music, page: "DJ & Stage" },
  { name: "Tent & Decor", desc: "Royal floral & themes", icon: Tent, page: "Tent & Decor" },
  { name: "Bhandari", desc: "Traditional master cooks", icon: ChefHat, page: "Bhandari" },
  { name: "Invitation Cards", desc: "Luxury cards & RSVP", icon: Mail, page: "Invitation" },
  { name: "Jaimala Stage", desc: "Cinematic stage design", icon: Flower2, page: "Jaimala Stage" },
  { name: "Sweets & Drinks", desc: "Mithai & mocktail bars", icon: Heart, page: "Sweets & Drinks" },
];

export default function UniversalHeader({
  page,
  setPage,
  dark,
  setDark,
  authData,
  adminData,
  onOpenAuth,
  onOpenAdmin,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef(null);

  function handleNav(targetPage) {
    if (targetPage === "Invitation") {
      window.location.href = "/studio/";
      return;
    }
    setPage(targetPage);
    setMobileMenuOpen(false);
    setServicesOpen(false);
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="universal-header">
      {/* Top Notification / Hotline Banner */}
      <div className="header-hotline-bar">
        <div className="hotline-container">
          <span className="hotline-item">
            <MapPin size={13} /> Corporate HQ: BKC Mumbai | Delhi NCR | Jaipur
          </span>
          <span className="hotline-item">
            <Phone size={13} /> 24/7 Helpline: <strong>+91 (022) 2654-8900</strong>
          </span>
          {adminData ? (
            <span className="hotline-admin-badge">
              <ShieldCheck size={13} /> Admin Active ({adminData.username || "Staff"})
            </span>
          ) : (
            <button
              className="hotline-admin-link"
              onClick={onOpenAdmin}
              title="Restricted Staff & Admin Login"
            >
              <Lock size={12} /> Admin Portal
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="header-main-nav">
        <button
          className="brand"
          onClick={() => handleNav("Home")}
          aria-label="Milap Home"
        >
          <img src={logoImg} alt="Milap Logo" className="brand-logo-img" />
          <span className="brand-text">
            <strong>Milap</strong>
            <small>Har Rishte ka Utsav</small>
          </span>
        </button>

        {/* Desktop and Tablet Navigation Links */}
        <nav className="desktop-nav-links">
          <button
            className={`header-nav-btn ${page === "Home" ? "active" : ""}`}
            onClick={() => handleNav("Home")}
          >
            <Home size={15} /> Home
          </button>

          {/* Services Dropdown in Navbar */}
          <div
            className="services-nav-dropdown-wrap"
            ref={dropdownRef}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className={`header-nav-btn dropdown-trigger ${
                ["Venue", "DJ & Stage", "Tent & Decor", "Bhandari", "Invitation", "Jaimala Stage", "Sweets & Drinks"].includes(page)
                  ? "active"
                  : ""
              }`}
              onClick={() => setServicesOpen(!servicesOpen)}
              aria-expanded={servicesOpen}
            >
              <Grid size={15} /> Services <ChevronDown size={14} className={`chevron-icon ${servicesOpen ? "rotate" : ""}`} />
            </button>

            {servicesOpen && (
              <div className="services-dropdown-panel">
                <div className="dropdown-panel-header">
                  <Sparkles size={14} /> <strong>Milap Wedding Services</strong>
                </div>
                <div className="services-dropdown-grid">
                  {navServicesList.map((svc) => {
                    const Icon = svc.icon;
                    return (
                      <button
                        key={svc.name}
                        className="service-dropdown-item"
                        onClick={() => handleNav(svc.page)}
                      >
                        <span className="svc-icon-badge">
                          <Icon size={16} />
                        </span>
                        <div>
                          <strong>{svc.name}</strong>
                          <small>{svc.desc}</small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            className={`header-nav-btn ${page === "Food" ? "active" : ""}`}
            onClick={() => handleNav("Food")}
          >
            <Utensils size={15} /> Food Planner
          </button>

          <button
            className={`header-nav-btn ${page === "Bookings" ? "active" : ""}`}
            onClick={() => handleNav("Bookings")}
          >
            <CalendarDays size={15} /> Bookings
          </button>

          <button
            className={`header-nav-btn ${page === "About" || page === "Contact" ? "active" : ""}`}
            onClick={() => handleNav("About")}
          >
            <Info size={15} /> About Us
          </button>

          <button
            className={`header-nav-btn ${page === "Profile" ? "active" : ""}`}
            onClick={() => handleNav("Profile")}
          >
            <UserRound size={15} /> Profile
          </button>
        </nav>

        {/* Right Header Actions */}
        <div className="header-actions-group">
          {/* Dark / Light Mode Toggle */}
          <button
            className="icon-btn theme-toggle-btn"
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Admin Login Button */}
          {adminData ? (
            <button
              className="admin-active-pill"
              onClick={onOpenAdmin}
              title="Click to view Admin Panel"
            >
              <ShieldCheck size={14} /> Admin
            </button>
          ) : (
            <button
              className="admin-login-cta"
              onClick={onOpenAdmin}
              title="Admin Portal Login"
            >
              <Lock size={13} /> <span>Admin</span>
            </button>
          )}

          {/* User Auth Info */}
          {authData ? (
            <div className="user-session-pill">
              <button
                className="user-name-btn"
                onClick={() => handleNav("Profile")}
                title="View & Update Profile"
              >
                <UserRound size={15} />
                <span>{authData.user?.fullName || authData.user?.username || "Account"}</span>
              </button>
              <button
                className="logout-mini-btn"
                onClick={onLogout}
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              className="user-login-cta"
              onClick={onOpenAuth}
            >
              <UserRound size={15} /> <span>Login</span>
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle (Only on phones) */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Phones Only) */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-menu">
          <div className="mobile-menu-links">
            <button
              className={`mobile-nav-link ${page === "Home" ? "active" : ""}`}
              onClick={() => handleNav("Home")}
            >
              <Home size={17} /> Home
            </button>
            <button
              className={`mobile-nav-link ${page === "Food" ? "active" : ""}`}
              onClick={() => handleNav("Food")}
            >
              <Utensils size={17} /> Food Planner
            </button>
            <button
              className={`mobile-nav-link ${page === "Bookings" ? "active" : ""}`}
              onClick={() => handleNav("Bookings")}
            >
              <CalendarDays size={17} /> Bookings
            </button>
            <button
              className={`mobile-nav-link ${page === "Profile" ? "active" : ""}`}
              onClick={() => handleNav("Profile")}
            >
              <UserRound size={17} /> Profile & Wedding Details
            </button>
            <button
              className={`mobile-nav-link ${page === "About" || page === "Contact" ? "active" : ""}`}
              onClick={() => handleNav("About")}
            >
              <Info size={17} /> About Us & Headquarters
            </button>
          </div>

          <div className="mobile-menu-footer">
            <button
              className="mobile-admin-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
            >
              <Lock size={15} /> Admin Portal Login
            </button>
            {authData ? (
              <button
                className="mobile-logout-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
              >
                <LogOut size={15} /> Logout ({authData.user?.username || "User"})
              </button>
            ) : (
              <button
                className="mobile-login-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
              >
                <UserRound size={15} /> User Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
