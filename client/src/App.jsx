
import { useState } from "react";
import FoodPlanner from "./FoodPlanner";
import Auth from "./Auth";
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
  Bell,
  Moon,
  Sun,
  ArrowRight,
  Sparkles,
  LogOut,
} from "lucide-react";
import "./index.css";

const services = [
  { name: "Venue Booking", desc: "Hall, home, farm", icon: MapPin, page: "Venue" },
  { name: "Food Planning", desc: "Veg & Non-Veg", icon: Utensils, page: "Food" },
  { name: "DJ & Sound", desc: "Music & lights", icon: Music, page: "DJ & Stage" },
  { name: "Tent & Decor", desc: "Beautiful decoration", icon: Tent, page: "Tent & Decor" },
  { name: "Bhandari", desc: "Cooking services", icon: ChefHat, page: "Bhandari" },
  { name: "Invitation", desc: "Wedding card designs", icon: Mail, page: "Invitation" },
  { name: "Jaimala Stage", desc: "Stage decoration", icon: Flower2, page: "Jaimala Stage" },
  { name: "Sweets & Drinks", desc: "Mithai & water", icon: Heart, page: "Sweets & Drinks" },
];

export default function App() {
  const [page, setPage] = useState("Home");
  const [dark, setDark] = useState(false);

  const [authData, setAuthData] = useState(() => {
    try {
      const saved = sessionStorage.getItem("shaadiAuth");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  function handleLogin(data) {
    sessionStorage.setItem("shaadiAuth", JSON.stringify(data));
    setAuthData(data);
    setPage("Home");
  }

  function handleLogout() {
    sessionStorage.removeItem("shaadiAuth");
    setAuthData(null);
    setPage("Home");
  }

  const navigation = [
    { name: "Home", icon: Home },
    { name: "Bookings", icon: CalendarDays },
    { name: "Food", icon: Utensils },
    { name: "Budget", icon: Wallet },
    { name: "Profile", icon: UserRound },
  ];

  if (!authData) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className={dark ? "app dark" : "app"}>
      <header className="topbar">
        <button className="brand" onClick={() => setPage("Home")}>
          <span className="brand-logo">♥</span>
          <span>
            <strong>Milap</strong>
            <small>Har Rishte ka Utsav</small>
          </span>
        </button>

        <div className="header-actions">
          <button
            className="icon-btn"
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun /> : <Moon />}
          </button>

          <button className="icon-btn" aria-label="Notifications">
            <Bell />
          </button>

          <button
            className="icon-btn"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut />
          </button>
        </div>
      </header>

      <main className="main">
        {page === "Home" ? (
          <>
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

                <p>Venue, food, decoration aur budget — sab kuch aasan.</p>

                <button
                  className="hero-btn"
                  onClick={() => setPage("Bookings")}
                >
                  Start Planning <ArrowRight size={17} />
                </button>
              </div>

              <div className="hero-heart">♥</div>

              <div className="hero-bottom">
                <span>Your special day</span>
                <span>Made with love</span>
              </div>
            </section>

            <div className="welcome-row">
              <div>
                <p className="muted">WELCOME TO YOUR WEDDING PLANNER</p>
                <h2>What would you like to plan?</h2>
              </div>
              <span className="step-label">8 SERVICES</span>
            </div>

            <section className="service-grid">
              {services.map(({ name, desc, icon: Icon, page: target }, i) => (
                <button
                  className="service-card"
                  key={name}
                  onClick={() => setPage(target)}
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

            <section className="summary-card">
              <div>
                <span className="muted">YOUR WEDDING</span>
                <h3>Every detail matters</h3>
                <p>
                  Apni planning, bookings aur expenses ek jagah manage karein.
                </p>
              </div>
              <button
                className="outline-btn"
                onClick={() => setPage("Budget")}
              >
                View Budget <ArrowRight size={15} />
              </button>
            </section>
          </>
        ) : page === "Food" ? (
          <FoodPlanner />
        ) : page === "Profile" ? (
          <section className="page-panel">
            <h2>Your Profile</h2>
            <p>
              Logged in as:{" "}
              {authData.user?.username || authData.user?.email || "User"}
            </p>
            <button className="primary-btn" onClick={handleLogout}>
              <LogOut size={17} /> Logout
            </button>
          </section>
        ) : (
          <section className="page-panel">
            <h2>{page}</h2>
            <p>
              This section is ready for the next development step.
            </p>
            <button className="primary-btn" onClick={() => setPage("Home")}>
              Explore Home
            </button>
          </section>
        )}
      </main>

      <nav className="bottom-nav">
        {navigation.map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={page === name ? "nav-item active" : "nav-item"}
            onClick={() => setPage(name)}
          >
            <Icon size={21} />
            <span>{name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
