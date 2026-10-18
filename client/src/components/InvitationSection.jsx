import { useState } from "react";
import { Sparkles, ExternalLink, ArrowLeft, Maximize2 } from "lucide-react";

export default function InvitationSection({ onBackHome }) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div
      className="invitation-page-container"
      style={{
        padding: fullscreen ? "0" : "0 16px 40px",
        position: fullscreen ? "fixed" : "relative",
        top: fullscreen ? 0 : "auto",
        left: fullscreen ? 0 : "auto",
        right: fullscreen ? 0 : "auto",
        bottom: fullscreen ? 0 : "auto",
        width: "100%",
        height: fullscreen ? "100vh" : "auto",
        zIndex: fullscreen ? 99999 : 1,
        background: "#fcf8fa",
      }}
    >
      {/* Top Banner & Quick Controls */}
      <div
        style={{
          background: "linear-gradient(135deg, #4d0718 0%, #881337 100%)",
          color: "#fff",
          padding: "16px 20px",
          borderRadius: fullscreen ? "0" : "0 0 16px 16px",
          marginBottom: "16px",
          boxShadow: "0 4px 20px rgba(136, 19, 55, 0.2)",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: 11,
                fontWeight: 700,
                background: "rgba(255,255,255,0.15)",
                padding: "3px 10px",
                borderRadius: 20,
                marginBottom: 4,
                letterSpacing: "0.5px",
              }}
            >
              <Sparkles size={12} color="#fcd34d" /> VIVAHPATRA AI CARD STUDIO
            </div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
              VivahPatra AI — Indian Invitation Designer
            </h1>
            <p style={{ margin: "2px 0 0", color: "#fce7ec", fontSize: 12 }}>
              30+ Regional Languages • Auspicious Sacred Motifs • All Milestone Categories (Wedding, Ring Ceremony, Dikshant Samaroh, Retirement, Naamkaran)
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={() => setFullscreen(!fullscreen)}
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
              title={fullscreen ? "Exit Fullscreen" : "Maximize Screen"}
            >
              <Maximize2 size={13} /> {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>

            <a
              href="/studio/"
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#d4af37",
                color: "#2a040d",
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <ExternalLink size={13} /> Open Standalone Tab
            </a>

            {onBackHome && (
              <button
                onClick={onBackHome}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <ArrowLeft size={13} /> Back to Planner
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Real VivahPatra AI Studio */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          height: fullscreen ? "calc(100vh - 80px)" : "calc(100vh - 140px)",
          minHeight: "750px",
          background: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          border: "1px solid #ebd5dc",
        }}
      >
        <iframe
          src="/studio/"
          title="VivahPatra AI Indian Invitation Card Studio"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
