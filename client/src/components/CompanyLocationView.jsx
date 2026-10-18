import { useState } from "react";
import {
  MapPin,
  Building2,
  Clock,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function CompanyLocationView({ onOpenAdmin }) {
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryCity, setInquiryCity] = useState("Mumbai");
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
    <div className="location-page-view">
      {/* Banner */}
      <div className="location-banner">
        <span className="location-tag">
          <Building2 size={15} /> CORPORATE HEADQUARTERS & EXPERIENCE CENTERS
        </span>
        <h1>Visit Our Offices & Wedding Lounges</h1>
        <p>
          Meet our senior wedding directors, experience floral themes in person,
          and sample custom wedding menus at our regional experience lounges.
        </p>
      </div>

      <div className="location-grid-layout">
        {/* Main Headquarters Card */}
        <div className="headquarters-card">
          <div className="hq-header">
            <span className="hq-badge">HQ Mumbai</span>
            <h2>Milap Tower (BKC)</h2>
            <p className="hq-tagline">Central Operations & Wedding Design Studio</p>
          </div>

          <div className="hq-details-list">
            <div className="hq-detail-item">
              <MapPin size={20} className="hq-icon" />
              <div>
                <strong>Physical Address:</strong>
                <p>
                  Plot No. 42, 4th & 5th Floor, Milap Tower, G-Block,
                  Bandra Kurla Complex (BKC), Bandra East,
                  Mumbai, Maharashtra 400051, India
                </p>
                <small className="hq-landmark">
                  ★ Landmark: Opposite Bharat Diamond Bourse, Near MMRDA Grounds
                </small>
              </div>
            </div>

            <div className="hq-detail-item">
              <Clock size={20} className="hq-icon" />
              <div>
                <strong>Operating & Consultation Hours:</strong>
                <p>Monday – Saturday: 9:00 AM – 8:30 PM IST</p>
                <p>Sunday: 10:00 AM – 5:00 PM (By Prior Appointment)</p>
              </div>
            </div>

            <div className="hq-detail-item">
              <Phone size={20} className="hq-icon" />
              <div>
                <strong>Contact Helplines:</strong>
                <p>Toll-Free Helpline: <strong>1800-267-MILAP</strong></p>
                <p>Head Office Direct: <strong>+91 (022) 2654-8900</strong></p>
                <p>Wedding Director Desk: <strong>+91 98765 43210</strong> (WhatsApp)</p>
              </div>
            </div>

            <div className="hq-detail-item">
              <Mail size={20} className="hq-icon" />
              <div>
                <strong>Official Email Desks:</strong>
                <p>General Inquiries: <strong>contact@milapweddings.com</strong></p>
                <p>Catering & Vendor Coordination: <strong>vendors@milap.in</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule a Consultation Form */}
        <div className="appointment-card">
          <h3>
            <Sparkles size={18} /> Schedule Office Consultation
          </h3>
          <p>Book a 1-on-1 session with a dedicated wedding manager.</p>

          {submitted ? (
            <div className="consultation-success">
              <CheckCircle2 size={36} color="#35784e" />
              <h4>Appointment Request Received!</h4>
              <p>
                Our wedding specialist from the {inquiryCity} office will call you within
                2 business hours.
              </p>
              <button
                className="outline-btn"
                onClick={() => setSubmitted(false)}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="inquiry-form">
              <label>
                <span>Your Name / Couple Name</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya & Aman"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                />
              </label>

              <label>
                <span>Contact Phone Number</span>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                />
              </label>

              <label>
                <span>Preferred Lounge Location</span>
                <select
                  value={inquiryCity}
                  onChange={(e) => setInquiryCity(e.target.value)}
                >
                  <option value="Mumbai BKC">Mumbai Headquarters (BKC)</option>
                  <option value="Delhi NCR">Delhi NCR Experience Lounge</option>
                  <option value="Jaipur">Jaipur Heritage Lounge</option>
                  <option value="Bengaluru">Bengaluru Tech & Garden Lounge</option>
                  <option value="Udaipur">Udaipur Destination Lounge</option>
                </select>
              </label>

              <label>
                <span>Tentative Wedding Date</span>
                <input
                  type="date"
                  value={inquiryDate}
                  onChange={(e) => setInquiryDate(e.target.value)}
                />
              </label>

              <button type="submit" className="primary-btn submit-inquiry-btn">
                <Send size={16} /> Confirm Consultation Request
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Regional Branch Offices Cards */}
      <div className="branches-section">
        <h3>Regional Experience Centers</h3>
        <div className="branches-grid">
          <div className="branch-card">
            <h4>Delhi NCR Center</h4>
            <p>DLF Cyber City, Tower 8, Level 6, Gurugram, Haryana 122002</p>
            <small>Phone: +91 (0124) 456-7890</small>
          </div>
          <div className="branch-card">
            <h4>Jaipur Royal Lounge</h4>
            <p>Mirza Ismail Road, C-Scheme, Jaipur, Rajasthan 302001</p>
            <small>Phone: +91 (0141) 238-9012</small>
          </div>
          <div className="branch-card">
            <h4>Bengaluru Center</h4>
            <p>100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038</p>
            <small>Phone: +91 (080) 4125-6789</small>
          </div>
          <div className="branch-card">
            <h4>Udaipur Destination Desk</h4>
            <p>Lake Palace Road, Kalaji Goraji, Udaipur, Rajasthan 313001</p>
            <small>Phone: +91 (0294) 242-3456</small>
          </div>
        </div>
      </div>
    </div>
  );
}
