import { useState } from "react";
import logoImg from "./assets/logo.jpg";
import { UserRound, Mail, Lock, Phone, Calendar, MapPin, X, ChevronDown, ChevronUp } from "lucide-react";

export default function Auth({ onLogin, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // Optional Profile Fields for Registration
  const [showProfileDetails, setShowProfileDetails] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [city, setCity] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const payload = isRegister
        ? {
            username: username.trim(),
            email: email.trim(),
            password,
            fullName: fullName.trim(),
            phone: phone.trim(),
            weddingDate: weddingDate.trim(),
            city: city.trim(),
          }
        : { userId: userId.trim(), password };

      const response = await fetch(
        `http://localhost:5000/api/auth/${
          isRegister ? "register" : "login"
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      onLogin(data);
    } catch (error) {
      setMessage(error.message || "Server se connection nahi ho saka.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={styles.closeBtn}
            title="Back to site"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}

        <div style={styles.logoWrapper}>
          <img src={logoImg} alt="Milap Logo" style={styles.logoImg} />
        </div>
        <h1 style={styles.title}>Milap</h1>
        <p style={styles.subtitle}>
          har taiyari, ab ek hi jagah.
        </p>

        <h2 style={styles.heading}>
          {isRegister ? "Create Your Account" : "Welcome Back"}
        </h2>

        {isRegister ? (
          <>
            <div style={styles.inputWrap}>
              <UserRound size={17} style={styles.inputIcon} />
              <input
                style={styles.inputWithIcon}
                placeholder="Username (lowercase, numbers, _)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                pattern="[a-z0-9_]{3,30}"
                title="3–30 characters: lowercase letters, numbers or underscores"
                autoComplete="username"
                required
              />
            </div>

            <div style={styles.inputWrap}>
              <Mail size={17} style={styles.inputIcon} />
              <input
                style={styles.inputWithIcon}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div style={styles.inputWrap}>
              <Lock size={17} style={styles.inputIcon} />
              <input
                style={styles.inputWithIcon}
                type="password"
                placeholder="Password (minimum 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                required
              />
            </div>

            {/* Profile Information Toggle for Registering Users */}
            <div style={styles.profileToggleBox}>
              <button
                type="button"
                style={styles.toggleBtn}
                onClick={() => setShowProfileDetails(!showProfileDetails)}
              >
                <span>💍 Wedding & Profile Details (Optional)</span>
                {showProfileDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showProfileDetails && (
                <div style={styles.profileFieldsGroup}>
                  <div style={styles.inputWrap}>
                    <UserRound size={17} style={styles.inputIcon} />
                    <input
                      style={styles.inputWithIcon}
                      placeholder="Couple / Full Name (e.g. Rahul & Sneha)"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div style={styles.inputWrap}>
                    <Phone size={17} style={styles.inputIcon} />
                    <input
                      style={styles.inputWithIcon}
                      type="tel"
                      placeholder="Contact / WhatsApp number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div style={styles.inputWrap}>
                    <MapPin size={17} style={styles.inputIcon} />
                    <input
                      style={styles.inputWithIcon}
                      placeholder="Wedding City (e.g. Mumbai, Jaipur, Delhi)"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div style={styles.inputWrap}>
                    <Calendar size={17} style={styles.inputIcon} />
                    <input
                      style={styles.inputWithIcon}
                      type="date"
                      title="Estimated Wedding Date"
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div style={styles.inputWrap}>
              <UserRound size={17} style={styles.inputIcon} />
              <input
                style={styles.inputWithIcon}
                placeholder="Username or email address"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div style={styles.inputWrap}>
              <Lock size={17} style={styles.inputIcon} />
              <input
                style={styles.inputWithIcon}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                maxLength={72}
                autoComplete="current-password"
                required
              />
            </div>
          </>
        )}

        {message && <p style={styles.error} role="alert">{message}</p>}

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Complete Registration" : "Login to Milap"}
        </button>

        <p style={styles.switchText}>
          {isRegister ? "Already registered? " : "New to Milap? "}
          <button
            type="button"
            style={styles.link}
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
              setPassword("");
            }}
          >
            {isRegister ? "Login here" : "Register with Profile"}
          </button>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "85vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 20px",
    boxSizing: "border-box",
    fontFamily: "Inter, Arial, sans-serif",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: 480,
    padding: "34px 28px",
    boxSizing: "border-box",
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 14px 45px rgba(148, 27, 69, 0.10)",
    border: "1px solid #fae8ee",
  },
  closeBtn: {
    position: "absolute",
    right: 18,
    top: 18,
    border: "none",
    background: "#f7f1f3",
    color: "#666",
    width: 34,
    height: 34,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  logoWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoImg: {
    width: 78,
    height: 78,
    borderRadius: 20,
    boxShadow: "0 8px 24px rgba(148, 27, 69, 0.18)",
    objectFit: "cover",
  },
  title: {
    textAlign: "center",
    color: "#881337",
    fontSize: 26,
    margin: "6px 0 2px",
    fontWeight: "800",
  },
  subtitle: {
    textAlign: "center",
    color: "#777",
    margin: "0 0 18px",
    fontSize: 13,
  },
  heading: {
    textAlign: "center",
    fontSize: 19,
    color: "#333",
    marginBottom: 16,
    fontWeight: "700",
  },
  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    marginTop: 12,
  },
  inputIcon: {
    position: "absolute",
    left: 14,
    color: "#99858c",
    pointerEvents: "none",
  },
  inputWithIcon: {
    width: "100%",
    padding: "12px 14px 12px 42px",
    boxSizing: "border-box",
    border: "1px solid #e5d8dc",
    borderRadius: 10,
    fontSize: 14,
    outline: "none",
    background: "#fcfbfa",
  },
  profileToggleBox: {
    marginTop: 14,
    padding: "12px",
    background: "#fff7f9",
    borderRadius: 12,
    border: "1px solid #fedfe7",
  },
  toggleBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    border: "none",
    background: "transparent",
    color: "#941b45",
    fontWeight: "600",
    fontSize: 13,
    cursor: "pointer",
    padding: "4px 2px",
  },
  profileFieldsGroup: {
    marginTop: 8,
    borderTop: "1px dashed #fad0dc",
    paddingTop: 8,
  },
  button: {
    width: "100%",
    padding: 14,
    marginTop: 20,
    border: "none",
    borderRadius: 10,
    background: "#941b45",
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(148, 27, 69, 0.25)",
  },
  error: {
    color: "#be123c",
    background: "#fff1f2",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    marginTop: 12,
  },
  switchText: {
    textAlign: "center",
    marginTop: 18,
    color: "#666",
    fontSize: 13,
  },
  link: {
    border: "none",
    background: "transparent",
    color: "#941b45",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: 13,
  },
};
