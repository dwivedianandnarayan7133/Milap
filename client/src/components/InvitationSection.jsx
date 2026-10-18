import InvitationCardGenerator from "./InvitationCardGenerator";
import { Sparkles, ExternalLink, ArrowLeft } from "lucide-react";
import { CARD_STUDIO_URL } from "../apiConfig";

export default function InvitationSection({ onBackHome, onOpenContact }) {
  const isCloudStudioConfigured =
    CARD_STUDIO_URL && !CARD_STUDIO_URL.includes("localhost");

  return (
    <div className="invitation-page-container" style={{ padding: "0 0 40px" }}>
      {/* Top Banner & Navigation Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #4d0718 0%, #881337 100%)",
          color: "#fff",
          padding: "24px 20px",
          borderRadius: "0 0 16px 16px",
          marginBottom: "24px",
          boxShadow: "0 4px 20px rgba(136, 19, 55, 0.2)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
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
                fontSize: 12,
                fontWeight: 700,
                background: "rgba(255,255,255,0.15)",
                padding: "4px 10px",
                borderRadius: 20,
                marginBottom: 6,
                letterSpacing: "0.5px",
              }}
            >
              <Sparkles size={13} color="#fcd34d" /> VIVAHPATRA AI INVITATION STUDIO
            </div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
              Indian Wedding & Event Invitation Designer
            </h1>
            <p style={{ margin: "4px 0 0", color: "#fce7ec", fontSize: 13 }}>
              Design traditional invitations with authentic Sanskrit shlokas, royal motifs, and 6 Indian heritage palettes.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {onBackHome && (
              <button
                onClick={onBackHome}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "8px 14px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <ArrowLeft size={14} /> Back to Home
              </button>
            )}

            {isCloudStudioConfigured && (
              <a
                href={CARD_STUDIO_URL}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "#d4af37",
                  color: "#2a040d",
                  padding: "8px 16px",
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
                <ExternalLink size={14} /> Fullscreen Studio
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Full Interactive Invitation Generator */}
      <InvitationCardGenerator onOpenContact={onOpenContact} />
    </div>
  );
}
