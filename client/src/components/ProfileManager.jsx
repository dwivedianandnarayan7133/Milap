import { useState } from "react";
import logoImg from "../assets/logo.jpg";
import {
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  Users,
  IndianRupee,
  Utensils,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function ProfileManager({ authData, onUpdateProfile, onLogout }) {
  const user = authData?.user || {};

  const [fullName, setFullName] = useState(user.fullName || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [weddingDate, setWeddingDate] = useState(user.weddingDate || "");
  const [city, setCity] = useState(user.city || "");
  const [guestCount, setGuestCount] = useState(user.guestCount ?? 500);
  const [budget, setBudget] = useState(user.budget || "");
  const [foodPreference, setFoodPreference] = useState(user.foodPreference || "Veg");
  const [notes, setNotes] = useState(user.notes || "");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const token = authData?.token;
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          weddingDate: weddingDate.trim(),
          city: city.trim(),
          guestCount: Number(guestCount) || 500,
          budget: budget.trim(),
          foodPreference,
          notes: notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedAuthData = {
        ...authData,
        user: data.user,
      };

      onUpdateProfile(updatedAuthData);
      setSuccessMsg("Profile & wedding details updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (error) {
      setErrorMsg(error.message || "Could not save profile changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profile-manager-container">
      {/* Top Profile Hero Card */}
      <div className="profile-hero-card">
        <div className="profile-avatar-wrap">
          <img src={logoImg} alt="Milap" className="profile-avatar-img" />
          <span className="profile-verified-badge" title="Verified Milap Member">
            ✓
          </span>
        </div>

        <div className="profile-hero-text">
          <div className="profile-title-row">
            <h1>{fullName || user.username || "Valued User"}</h1>
            <span className="profile-tag">Wedding Couple Account</span>
          </div>
          <p className="profile-meta">
            <span>
              <UserRound size={14} /> @{user.username}
            </span>
            <span>
              <Mail size={14} /> {user.email}
            </span>
            {city && (
              <span>
                <MapPin size={14} /> {city}
              </span>
            )}
          </p>
        </div>

        <button className="profile-logout-btn" onClick={onLogout} title="Logout">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Main Profile Update Form */}
      <div className="profile-form-box">
        <div className="profile-box-header">
          <div className="profile-header-title">
            <Sparkles size={22} className="accent-icon" />
            <div>
              <h2>Update Profile & Wedding Preferences</h2>
              <p>Manage your celebration details, contact numbers, and catering specs</p>
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="profile-alert success">
            <CheckCircle2 size={18} /> <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="profile-alert error">
            <AlertCircle size={18} /> <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="profile-edit-grid">
          {/* Couple / Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">
              <UserRound size={16} /> Couple / Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="e.g. Rahul & Sneha Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Contact Phone */}
          <div className="form-group">
            <label htmlFor="phone">
              <Phone size={16} /> Contact / WhatsApp Phone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Wedding Date */}
          <div className="form-group">
            <label htmlFor="weddingDate">
              <CalendarDays size={16} /> Wedding / Event Date
            </label>
            <input
              id="weddingDate"
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
            />
          </div>

          {/* Destination / City */}
          <div className="form-group">
            <label htmlFor="city">
              <MapPin size={16} /> Preferred City / Venue Location
            </label>
            <input
              id="city"
              type="text"
              placeholder="e.g. Mumbai, Jaipur, Delhi NCR, Udaipur"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {/* Estimated Guests */}
          <div className="form-group">
            <label htmlFor="guestCount">
              <Users size={16} /> Estimated Guests ({guestCount})
            </label>
            <input
              id="guestCount"
              type="number"
              min="1"
              max="100000"
              value={guestCount}
              onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>

          {/* Budget Range */}
          <div className="form-group">
            <label htmlFor="budget">
              <IndianRupee size={16} /> Approximate Budget
            </label>
            <input
              id="budget"
              type="text"
              placeholder="e.g. ₹15,00,000 – ₹25,00,000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          {/* Food Preference */}
          <div className="form-group">
            <label>
              <Utensils size={16} /> Catering & Food Preference
            </label>
            <div className="food-radio-group">
              <button
                type="button"
                className={`food-choice-btn ${foodPreference === "Veg" ? "active" : ""}`}
                onClick={() => setFoodPreference("Veg")}
              >
                🟢 Pure Veg Menu
              </button>
              <button
                type="button"
                className={`food-choice-btn ${foodPreference === "Non-Veg" ? "active" : ""}`}
                onClick={() => setFoodPreference("Non-Veg")}
              >
                🍗 Veg & Non-Veg Menu
              </button>
            </div>
          </div>

          {/* Special Notes / Vision */}
          <div className="form-group full-width">
            <label htmlFor="notes">
              <FileText size={16} /> Special Celebration Notes & Requirements
            </label>
            <textarea
              id="notes"
              rows="3"
              placeholder="Tell our event managers about your dream theme, music choices, jaimala stage vision, or specific catering traditions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="form-actions-full">
            <button type="submit" className="save-profile-btn" disabled={saving}>
              <Save size={18} /> {saving ? "Saving Changes..." : "Save & Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
