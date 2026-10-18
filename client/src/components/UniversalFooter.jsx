import logoImg from "../assets/logo.jpg";
import { CARD_STUDIO_URL } from "../apiConfig";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Lock,
  Building2,
  Heart,
  ChevronRight,
} from "lucide-react";

export default function UniversalFooter({ setPage, onOpenAdmin, onOpenAuth }) {
  function handleNav(targetPage) {
    if (targetPage === "Invitation") {
      window.location.href = CARD_STUDIO_URL;
      return;
    }
    if (setPage) {
      setPage(targetPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <footer className="universal-footer">
      <div className="footer-top-accent"></div>

      {/* ============================================================
          DESKTOP & TABLET VIEW: FULL 4-COLUMN RICH FOOTER
          ============================================================ */}
      <div className="footer-main-container desktop-tablet-only">
        {/* Column 1: Company Profile & Logo */}
        <div className="footer-col footer-col-brand">
          <div className="footer-brand-header">
            <img src={logoImg} alt="Milap Logo" className="footer-brand-logo" />
            <div>
              <h3 className="footer-company-name">Milap</h3>
              <p className="footer-company-tagline">Har Rishte ka Utsav</p>
            </div>
          </div>
          <p className="footer-brand-desc">
            India's premier wedding and celebration management platform. We provide
            end-to-end venue reservations, authentic catering plans, bespoke decor,
            and complete ceremony coordination.
          </p>

          <div className="footer-badges">
            <span className="footer-badge">
              <Heart size={12} fill="#fb7185" color="#fb7185" /> 10,000+ Happy Weddings
            </span>
            <span className="footer-badge">★ 4.9/5 Rated Service</span>
          </div>
        </div>

        {/* Column 2: Quick Services Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">Wedding Services</h4>
          <ul className="footer-link-list">
            <li>
              <button onClick={() => handleNav("Food")}>
                <ChevronRight size={14} /> Food & Catering Planner
              </button>
            </li>
            <li>
              <button onClick={() => handleNav("Venue")}>
                <ChevronRight size={14} /> Banquet & Venue Booking
              </button>
            </li>
            <li>
              <button onClick={() => handleNav("Tent & Decor")}>
                <ChevronRight size={14} /> Royal Tent & Floral Decor
              </button>
            </li>
            <li>
              <button onClick={() => handleNav("DJ & Stage")}>
                <ChevronRight size={14} /> DJ, Sound & Ambient Lighting
              </button>
            </li>
            <li>
              <button onClick={() => handleNav("Invitation")}>
                <ChevronRight size={14} /> AI Indian Invitation Cards
              </button>
            </li>
            <li>
              <button onClick={() => handleNav("Bookings")}>
                <ChevronRight size={14} /> Event Schedule & Bookings
              </button>
            </li>
            <li>
              <button onClick={() => handleNav("Budget")}>
                <ChevronRight size={14} /> Wedding Budget Estimator
              </button>
            </li>
            <li>
              <button onClick={() => handleNav("About")}>
                <ChevronRight size={14} /> About Milap & HQ Studio
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Dummy Company Location Information */}
        <div className="footer-col">
          <h4 className="footer-col-title">Company Location</h4>
          <div className="footer-location-info">
            <div className="location-item">
              <Building2 size={16} className="loc-icon" />
              <div>
                <strong>Milap Corporate Headquarters</strong>
                <p>Milap Tower, 4th & 5th Floor, Plot No. 42</p>
              </div>
            </div>

            <div className="location-item">
              <MapPin size={16} className="loc-icon" />
              <div>
                <p>
                  G-Block, Bandra Kurla Complex (BKC), Bandra East,
                  Mumbai, Maharashtra 400051, India
                </p>
                <small className="location-landmark">
                  Landmark: Opp. Bharat Diamond Bourse, Near City Park
                </small>
              </div>
            </div>

            <div className="location-item">
              <Clock size={16} className="loc-icon" />
              <div>
                <strong>Office Working Hours:</strong>
                <p>Monday – Saturday: 9:00 AM – 8:30 PM</p>
                <p>Sunday: 10:00 AM – 5:00 PM (By Prior Appointment)</p>
              </div>
            </div>

            <div className="branch-chips">
              <span>Delhi NCR</span>
              <span>Jaipur</span>
              <span>Bengaluru</span>
              <span>Udaipur</span>
            </div>
          </div>
        </div>

        {/* Column 4: Contact Details & Admin Login */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contact & Helpdesk</h4>
          <div className="footer-contact-info">
            <div className="contact-item">
              <Phone size={15} className="contact-icon" />
              <div>
                <small>Direct Line / Helpdesk</small>
                <a href="tel:+912226548900">+91 (022) 2654-8900</a>
                <a href="tel:+919876543210">+91 98765 43210 (WhatsApp)</a>
              </div>
            </div>

            <div className="contact-item">
              <Mail size={15} className="contact-icon" />
              <div>
                <small>Email Support</small>
                <a href="mailto:contact@milapweddings.com">contact@milapweddings.com</a>
                <a href="mailto:support@milap.in">support@milap.in</a>
              </div>
            </div>

            {/* Admin Login Section */}
            <div className="footer-admin-box">
              <div className="admin-box-header">
                <ShieldCheck size={16} className="shield-icon" />
                <span>Authorized Staff Portal</span>
              </div>
              <p className="admin-box-note">
                For managers, coordinators & vendors
              </p>
              <button
                className="footer-admin-btn"
                onClick={onOpenAdmin}
                type="button"
              >
                <Lock size={14} /> Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop & Tablet Bottom Legal Bar */}
      <div className="footer-bottom-bar desktop-tablet-only">
        <div className="footer-bottom-container">
          <p className="copyright-text">
            © {new Date().getFullYear()} Milap Wedding & Event Management Pvt. Ltd. All rights reserved.
          </p>
          <div className="legal-links">
            <button onClick={() => alert("Milap Privacy Policy: We keep your personal and wedding event details strictly confidential.")}>
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => alert("Milap Terms: All wedding booking estimates are subject to partner confirmation.")}>
              Terms of Service
            </button>
            <span>·</span>
            <button onClick={() => alert("Security: End-to-end encrypted user authentication.")}>
              Security
            </button>
            <span>·</span>
            <button onClick={onOpenAdmin} className="legal-admin-link">
              <Lock size={11} /> Admin Access
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          SMALL DEVICES (PHONE) VIEW: MINIMAL & SHORT FOOTER
          Contains ONLY Company Name & Copyright Information
          ============================================================ */}
      <div className="footer-mobile-compact phone-only">
        <div className="footer-mobile-brand">
          <img src={logoImg} alt="Milap Logo" className="footer-mobile-logo" />
          <div className="footer-mobile-titles">
            <h3 className="footer-mobile-name">Milap</h3>
            <p className="footer-mobile-company">Milap Wedding & Event Management Pvt. Ltd.</p>
          </div>
        </div>
        <p className="footer-mobile-copyright">
          © {new Date().getFullYear()} Milap Wedding & Event Management Pvt. Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
