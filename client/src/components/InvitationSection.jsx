import { useEffect } from "react";
import { CARD_STUDIO_URL } from "../apiConfig";

export default function InvitationSection() {
  useEffect(() => {
    window.location.href = CARD_STUDIO_URL;
  }, []);

  return (
    <div style={{ padding: "80px 20px", textAlign: "center", minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 42,
          height: 42,
          border: "3px solid #fce7ec",
          borderTopColor: "#941b45",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          marginBottom: 16,
        }}
      />
      <h3 style={{ margin: "0 0 6px", color: "#881337", fontSize: 20 }}>
        Opening VivahPatra AI Studio...
      </h3>
      <p style={{ margin: "0 0 16px", color: "#666", fontSize: 14 }}>
        Redirecting to your Indian invitation card designer
      </p>
      <a
        href={CARD_STUDIO_URL}
        style={{
          background: "#941b45",
          color: "#fff",
          padding: "10px 22px",
          borderRadius: 8,
          textDecoration: "none",
          fontSize: 13,
          fontWeight: 700,
          boxShadow: "0 4px 12px rgba(148, 27, 69, 0.2)",
        }}
      >
        Click here if not redirected automatically
      </a>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
