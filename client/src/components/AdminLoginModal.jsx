import { useState } from "react";
import logoImg from "../assets/logo.jpg";
import {
  Lock,
  ShieldCheck,
  X,
  UserCheck,
  AlertCircle,
  KeyRound,
  Mail,
  Building,
} from "lucide-react";

export default function AdminLoginModal({
  isOpen,
  onClose,
  adminData,
  onAdminLogin,
  onAdminLogout,
}) {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  function handleDemoFill() {
    setAdminEmail("admin@milap.com");
    setAdminPassword("Admin@2026");
    setErrorMsg("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const emailClean = adminEmail.trim().toLowerCase();

    // Check credentials (accepts demo admin or any email containing admin or password length >= 6)
    if (!emailClean || !adminPassword) {
      setErrorMsg("Please enter both Admin Work Email and Password.");
      return;
    }

    if (
      emailClean === "admin@milap.com" ||
      emailClean.startsWith("admin") ||
      adminPassword === "Admin@2026"
    ) {
      const adminSession = {
        username: emailClean.split("@")[0] || "Administrator",
        email: emailClean,
        role: "Head Operations Manager",
        department: "Milap Central Management - BKC Mumbai",
        loginTime: new Date().toLocaleTimeString(),
      };
      setSuccessMsg("Admin authentication successful! Access granted.");
      setTimeout(() => {
        onAdminLogin(adminSession);
        onClose();
      }, 500);
    } else {
      setErrorMsg("Invalid administrator credentials. Try the Demo Credentials button.");
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close Admin Modal"
        >
          <X size={20} />
        </button>

        {adminData ? (
          /* Active Admin Session View */
          <div className="admin-modal-content active-admin">
            <div className="admin-status-icon-wrap">
              <ShieldCheck size={48} className="shield-active-icon" />
            </div>
            <h2>Admin Session Active</h2>
            <p className="admin-user-welcome">
              Logged in as <strong>{adminData.username}</strong>
            </p>
            <div className="admin-details-card">
              <div>
                <span>Email:</span> <strong>{adminData.email}</strong>
              </div>
              <div>
                <span>Designation:</span> <strong>{adminData.role}</strong>
              </div>
              <div>
                <span>Office:</span> <strong>BKC Headquarters, Mumbai</strong>
              </div>
              <div>
                <span>Session Started:</span> <strong>{adminData.loginTime}</strong>
              </div>
            </div>

            <div className="admin-actions-row">
              <button
                className="admin-logout-btn"
                onClick={() => {
                  onAdminLogout();
                  onClose();
                }}
              >
                End Admin Session
              </button>
              <button className="primary-btn" onClick={onClose}>
                Continue Working
              </button>
            </div>
          </div>
        ) : (
          /* Admin Login Form View */
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <img src={logoImg} alt="Milap" className="admin-modal-logo" />
              <div>
                <h2>Milap Admin Portal</h2>
                <p>Corporate Management & Operations Login</p>
              </div>
            </div>

            <div className="admin-security-notice">
              <Lock size={15} />
              <span>
                Restricted portal for authorized Milap staff & event coordinators.
              </span>
            </div>

            {errorMsg && (
              <div className="admin-alert error">
                <AlertCircle size={16} /> <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="admin-alert success">
                <ShieldCheck size={16} /> <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="admin-modal-form">
              <label>
                <span>Admin Work Email / ID</span>
                <div className="modal-input-group">
                  <Mail size={16} />
                  <input
                    type="email"
                    placeholder="e.g. admin@milap.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
              </label>

              <label>
                <span>Security Password</span>
                <div className="modal-input-group">
                  <KeyRound size={16} />
                  <input
                    type="password"
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
              </label>

              <div className="demo-credentials-box">
                <small>Quick Testing Demo Credentials:</small>
                <button
                  type="button"
                  className="fill-demo-btn"
                  onClick={handleDemoFill}
                >
                  Auto-fill Demo Admin (admin@milap.com)
                </button>
              </div>

              <button type="submit" className="admin-submit-btn">
                <ShieldCheck size={17} /> Authenticate as Admin
              </button>
            </form>

            <div className="admin-modal-footer">
              <Building size={14} />
              <small>Milap HQ · Bandra Kurla Complex, Mumbai</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
