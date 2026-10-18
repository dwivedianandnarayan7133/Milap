import { useState } from "react";
import logoImg from "../assets/logo.jpg";
import {
  Info,
  Heart,
  Sparkles,
  ShieldCheck,
  Users,
  Award,
  Building2,
  MapPin,
  Clock,
  Phone,
  Mail,
  Send,
  CheckCircle2,
} from "lucide-react";

export default function AboutUsView({ onOpenAdmin }) {
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryCity, setInquiryCity] = useState("Mumbai BKC");
  const [inquiryDate, setInquiryDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmitInquiry(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setInquiryName("");
      setInquiryPhone("");
      setInquiryDate("");
    }, 1000);
  }

  return (
    <div className="about-us-container">
      {/* Hero Banner */}
      <section className="about-hero-banner">
        <div className="about-badge">
          <Info size={14} /> ABOUT MILAP WEDDINGS
        </div>
        <h1>Celebrating Love, Tradition & Grandeur</h1>
        <p>
          Milap was founded with a singular promise — <em>"Har Rishte ka Utsav"</em>.
          We bring together timeless Indian wedding traditions, world-class culinary
          craftsmanship, and transparent modern event technology.
        </p>

        <div className="about-stats-row">
          <div className="stat-card">
            <h3>10,000+</h3>
            <p>Weddings Executed</p>
          </div>
          <div className="stat-card">
            <h3>50+</h3>
            <p>Cities Across India</p>
          </div>
          <div className="stat-card">
            <h3>99.4%</h3>
            <p>Family Satisfaction</p>
          </div>
          <div className="stat-card">
            <h3>15+</h3>
            <p>Years of Legacy</p>
          </div>
        </div>
      </section>

      {/* Story & Vision */}
      <section className="about-story-section">
        <div className="story-card">
          <img src={logoImg} alt="Milap Logo" className="story-logo" />
          <div className="story-text">
            <h2>Our Story & Philosophy</h2>
            <p>
              In an Indian wedding, every ritual carries emotion, blessing, and
              lifelong memory. Yet planning traditionally involved stressful vendor
              negotiations, uncertain catering portions, and hidden costs.
            </p>
            <p>
              <strong>Milap</strong> was created to change that forever. We unified
              banquet reservations, gourmet food planning, royal decor design,
              and live artist coordination under one transparent roof. Every couple is
              partnered with an experienced Wedding Director who ensures your celebration
              is flawless from the first Haldi ritual to the final Vidaai.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values / Why Choose Us */}
      <section className="about-values-section">
        <h2 className="section-title">Why Families Choose Milap</h2>
        <div className="values-grid">
          <div className="value-card">
            <span className="value-icon"><Heart size={22} /></span>
            <h3>Heartfelt Hospitality</h3>
            <p>We treat every wedding as if it were in our own family, honoring cultural customs across every community.</p>
          </div>

          <div className="value-card">
            <span className="value-icon"><ShieldCheck size={22} /></span>
            <h3>100% Price Transparency</h3>
            <p>No last-minute vendor surprises. Detailed itemized estimates for catering, tents, stages, and photography.</p>
          </div>

          <div className="value-card">
            <span className="value-icon"><Award size={22} /></span>
            <h3>Master Chefs & Bhandaris</h3>
            <p>From pure vegetarian satvik delicacies to grand royal feasts, our handpicked master culinary teams deliver perfection.</p>
          </div>

          <div className="value-card">
            <span className="value-icon"><Users size={22} /></span>
            <h3>Dedicated Wedding Director</h3>
            <p>A single point of contact who manages vendors, schedules artists, and handles guest hospitality seamlessly.</p>
          </div>
        </div>
      </section>

      {/* Corporate Headquarters & Consultation */}
      <section className="about-hq-section">
        <div className="hq-grid">
          {/* Headquarters Info */}
          <div className="about-hq-card">
            <div className="hq-tag">
              <Building2 size={14} /> CENTRAL HEADQUARTERS
            </div>
            <h2>Milap Tower (BKC Mumbai)</h2>
            <p className="hq-sub">Flagship Design Studio & Executive Offices</p>

            <div className="about-hq-details">
              <div className="detail-item">
                <MapPin size={18} className="icon-wine" />
                <div>
                  <strong>Address:</strong>
                  <p>Plot No. 42, 4th & 5th Floor, Milap Tower, G-Block, Bandra Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra 400051</p>
                  <small>Landmark: Opposite Bharat Diamond Bourse, Near MMRDA Grounds</small>
                </div>
              </div>

              <div className="detail-item">
                <Clock size={18} className="icon-wine" />
                <div>
                  <strong>Consultation Hours:</strong>
                  <p>Monday – Saturday: 9:00 AM – 8:30 PM IST</p>
                  <p>Sunday: 10:00 AM – 5:00 PM (By Prior Appointment)</p>
                </div>
              </div>

              <div className="detail-item">
                <Phone size={18} className="icon-wine" />
                <div>
                  <strong>Helplines & Concierge:</strong>
                  <p>Toll-Free: <strong>1800-267-MILAP</strong></p>
                  <p>Mumbai Office: <strong>+91 (022) 2654-8900</strong></p>
                  <p>WhatsApp Concierge: <strong>+91 98765 43210</strong></p>
                </div>
              </div>

              <div className="detail-item">
                <Mail size={18} className="icon-wine" />
                <div>
                  <strong>Direct Email Desks:</strong>
                  <p>Inquiries: <strong>contact@milapweddings.com</strong></p>
                  <p>Partnerships: <strong>vendors@milap.in</strong></p>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Form */}
          <div className="about-consultation-card">
            <h3><Sparkles size={18} /> Schedule a Consultation</h3>
            <p>Meet our wedding directors in person at our BKC lounge or book a video walkthrough.</p>

            {submitted ? (
              <div className="consultation-success-box">
                <CheckCircle2 size={40} color="#27ae60" />
                <h4>Consultation Scheduled!</h4>
                <p>Our senior wedding specialist will call you shortly to confirm your appointment at our {inquiryCity} lounge.</p>
                <button className="outline-btn" onClick={() => setSubmitted(false)}>
                  Book Another Session
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="about-inquiry-form">
                <label>
                  <span>Couple / Family Name</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul & Pooja Sharma"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                  />
                </label>

                <label>
                  <span>Phone Number</span>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                  />
                </label>

                <label>
                  <span>Preferred Lounge</span>
                  <select
                    value={inquiryCity}
                    onChange={(e) => setInquiryCity(e.target.value)}
                  >
                    <option value="Mumbai BKC">Mumbai Headquarters (BKC)</option>
                    <option value="Delhi NCR">Delhi NCR Experience Center</option>
                    <option value="Jaipur">Jaipur Heritage Lounge</option>
                    <option value="Bengaluru">Bengaluru Garden Lounge</option>
                    <option value="Udaipur">Udaipur Destination Desk</option>
                  </select>
                </label>

                <label>
                  <span>Estimated Wedding Date</span>
                  <input
                    type="date"
                    value={inquiryDate}
                    onChange={(e) => setInquiryDate(e.target.value)}
                  />
                </label>

                <button type="submit" className="primary-btn about-submit-btn">
                  <Send size={15} /> Confirm Consultation Request
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Regional Branch Offices */}
      <section className="about-branches-section">
        <h3 className="section-title">Regional Experience Lounges</h3>
        <div className="about-branches-grid">
          <div className="branch-box">
            <h4>Delhi NCR Center</h4>
            <p>DLF Cyber City, Tower 8, Level 6, Gurugram, Haryana 122002</p>
            <small>Direct: +91 (0124) 456-7890</small>
          </div>
          <div className="branch-box">
            <h4>Jaipur Royal Lounge</h4>
            <p>Mirza Ismail Road, C-Scheme, Jaipur, Rajasthan 302001</p>
            <small>Direct: +91 (0141) 238-9012</small>
          </div>
          <div className="branch-box">
            <h4>Bengaluru Center</h4>
            <p>100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038</p>
            <small>Direct: +91 (080) 4125-6789</small>
          </div>
          <div className="branch-box">
            <h4>Udaipur Destination Desk</h4>
            <p>Lake Palace Road, Kalaji Goraji, Udaipur, Rajasthan 313001</p>
            <small>Direct: +91 (0294) 242-3456</small>
          </div>
        </div>
      </section>
    </div>
  );
}
