import { useState, useRef, useEffect } from "react";
import "./InvitationCard.css";
import {
  Sparkles,
  Download,
  Share2,
  Printer,
  Copy,
  Check,
  RefreshCw,
  Palette,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Mail,
  QrCode,
  Sliders,
  CheckCircle2,
  Phone,
  Send,
  Building,
  ArrowRight,
} from "lucide-react";

// ==========================================
// 6 PRESET AUTHENTIC INDIAN THEMES
// ==========================================
const THEMES = [
  {
    id: "rajput",
    name: "Rajputana Royal Palace",
    subtitle: "Jaipur Ruby & Gold Zari",
    bg: "linear-gradient(145deg, #4d0718 0%, #26020b 100%)",
    textColor: "#ffffff",
    accentColor: "#d4af37",
    secondaryColor: "#f5e6b3",
    borderColor: "#d4af37",
    dotColor: "#7e0d27",
    motif: "ganesha",
  },
  {
    id: "south",
    name: "Kanjivaram Temple",
    subtitle: "Sacred Emerald & Gopuram Gold",
    bg: "linear-gradient(145deg, #0a3325 0%, #03140e 100%)",
    textColor: "#ffffff",
    accentColor: "#e5a93c",
    secondaryColor: "#fcedcc",
    borderColor: "#e5a93c",
    dotColor: "#0f4231",
    motif: "kalash",
  },
  {
    id: "punjabi",
    name: "Anand Karaj Regal",
    subtitle: "Royal Sapphire & Marigold",
    bg: "linear-gradient(145deg, #0e2238 0%, #050d17 100%)",
    textColor: "#ffffff",
    accentColor: "#f59e0b",
    secondaryColor: "#fde68a",
    borderColor: "#f59e0b",
    dotColor: "#1d4ed8",
    motif: "peacock",
  },
  {
    id: "pastel",
    name: "Blush Champagne Modern",
    subtitle: "Rose Gold & Contemporary Floral",
    bg: "linear-gradient(145deg, #fff7f7 0%, #f7e6eb 100%)",
    textColor: "#38121d",
    accentColor: "#941b45",
    secondaryColor: "#6b2339",
    borderColor: "#c59b27",
    dotColor: "#f472b6",
    motif: "mandala",
  },
  {
    id: "mughal",
    name: "Mughal Teal & Gold",
    subtitle: "Lattice Jali & Antique Champagne",
    bg: "linear-gradient(145deg, #0a2d36 0%, #021419 100%)",
    textColor: "#ffffff",
    accentColor: "#e2c37e",
    secondaryColor: "#f6e7c7",
    borderColor: "#e2c37e",
    dotColor: "#0f766e",
    motif: "peacock",
  },
  {
    id: "banarasi",
    name: "Banarasi Crimson Silk",
    subtitle: "Auspicious Sindoor & Brocade",
    bg: "linear-gradient(145deg, #5c0d1c 0%, #2f030b 100%)",
    textColor: "#ffffff",
    accentColor: "#ecc94b",
    secondaryColor: "#fff4be",
    borderColor: "#ecc94b",
    dotColor: "#b91c1c",
    motif: "elephant",
  },
];

// ==========================================
// SACRED INDIAN SHLOKAS & BLESSINGS
// ==========================================
const SHLOKAS = [
  {
    id: "ganesh",
    title: "Ganesha Shloka (Auspicious Start)",
    text: "॥ श्री गणेशाय नमः ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
  },
  {
    id: "vishnu",
    title: "Mangalam Shloka (Divine Union)",
    text: "॥ ॐ नमो भगवते वासुदेवाय ॥ मंगलम् भगवान विष्णुः मंगलम् गरुडध्वजः। मंगलम् पुण्डरीकाक्षः मंगलाय तनो हरिः॥",
  },
  {
    id: "radha",
    title: "Radha Krishna Prem (Eternal Love)",
    text: "॥ राधे राधे ॥ प्रेम, विश्वास और समर्पण के इस पावन बंधन में आपका स्नेह और आशीर्वाद सादर प्रार्थनीय है।",
  },
  {
    id: "modern",
    title: "Modern Grace (Bilingual Blessing)",
    text: "॥ ॐ ॥ Two lives, two hearts, joined together in friendship, united forever in love with the blessings of Almighty.",
  },
];

// ==========================================
// TRADITIONAL VECTOR MOTIFS
// ==========================================
function MotifGanesha({ color = "#d4af37" }) {
  return (
    <svg width="44" height="44" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="14" r="3" fill={color} />
      {/* Crown */}
      <path d="M25 18 L32 7 L39 18 Z" fill={color} opacity="0.9" />
      {/* Head & Ears */}
      <path
        d="M20 25 C14 20 12 30 18 35 C22 38 25 38 25 38"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M44 25 C50 20 52 30 46 35 C42 38 39 38 39 38"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Trunk & Modak */}
      <path
        d="M32 20 Q32 36 34 42 Q36 47 42 45 Q46 44 44 40"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Tilak */}
      <path d="M30 22 H34 M30 24 H34 M32 21 V27" stroke={color} strokeWidth="1.8" />
      <circle cx="45" cy="38" r="2.5" fill={color} />
    </svg>
  );
}

function MotifKalash({ color = "#e5a93c" }) {
  return (
    <svg width="44" height="44" viewBox="0 0 64 64" fill="none">
      {/* Coconut & Mango leaves */}
      <circle cx="32" cy="18" r="7" fill={color} opacity="0.85" />
      <path d="M22 22 Q32 10 32 18 Q32 10 42 22" stroke={color} strokeWidth="2.2" fill="none" />
      {/* Pot Rim */}
      <ellipse cx="32" cy="27" rx="10" ry="2.5" fill={color} />
      {/* Pot Body */}
      <path
        d="M23 28 C20 36 18 44 24 50 C28 53 36 53 40 50 C46 44 44 36 41 28 Z"
        fill={color}
        opacity="0.3"
        stroke={color}
        strokeWidth="2.2"
      />
      {/* Swastik on Kalash */}
      <path d="M28 40 H36 M32 36 V44 M28 36 V40 M36 40 V44" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function MotifPeacock({ color = "#f59e0b" }) {
  return (
    <svg width="44" height="44" viewBox="0 0 64 64" fill="none">
      {/* Body & Neck */}
      <path
        d="M36 20 C36 16 33 13 29 13 C26 13 24 16 25 20 C26 24 29 28 29 34 C29 42 22 46 16 46"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <circle cx="28" cy="15" r="1.5" fill={color} />
      {/* Crown */}
      <path d="M28 12 L26 7 M29 12 L29 6 M30 12 L32 7" stroke={color} strokeWidth="1.6" />
      {/* Plumage fan */}
      <path
        d="M32 30 Q46 22 52 30 Q48 38 34 38 M35 34 Q50 32 54 42 Q46 46 33 42 M32 38 Q48 44 48 52 Q38 52 30 46"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

function MotifElephant({ color = "#ecc94b" }) {
  return (
    <svg width="44" height="44" viewBox="0 0 64 64" fill="none">
      {/* Elephant Body */}
      <path
        d="M18 42 C16 35 18 24 28 22 C37 20 45 22 48 30 C50 35 48 44 48 48 L44 48 L44 40 L38 40 L38 48 L34 48 L34 38 L26 38 L26 48 L22 48 C20 48 18 45 18 42 Z"
        fill={color}
        opacity="0.3"
        stroke={color}
        strokeWidth="2"
      />
      {/* Trunk */}
      <path
        d="M48 29 C52 30 55 35 53 43 C52 46 48 46 48 43"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Hauda / Umbrella */}
      <path d="M30 21 L35 12 L40 21 Z" fill={color} />
      <circle cx="35" cy="10" r="1.5" fill={color} />
      {/* Jhool (Cloth) */}
      <rect x="28" y="27" width="12" height="10" rx="2" fill={color} opacity="0.8" />
    </svg>
  );
}

function MotifMandala({ color = "#941b45" }) {
  return (
    <svg width="44" height="44" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="6" fill={color} opacity="0.3" stroke={color} strokeWidth="1.8" />
      <circle cx="32" cy="32" r="14" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Petals */}
      <path
        d="M32 10 Q36 20 32 24 Q28 20 32 10 M32 54 Q36 44 32 40 Q28 44 32 54 M10 32 Q20 36 24 32 Q20 28 10 32 M54 32 Q44 36 40 32 Q44 28 54 32"
        fill={color}
        opacity="0.75"
      />
      <circle cx="32" cy="32" r="22" stroke={color} strokeWidth="1" />
    </svg>
  );
}

function MotifDoli({ color = "#d4af37" }) {
  return (
    <svg width="44" height="44" viewBox="0 0 64 64" fill="none">
      {/* Palanquin Roof */}
      <path d="M16 28 Q32 16 48 28 Z" fill={color} opacity="0.85" />
      <path d="M8 26 H56" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Doli Box */}
      <rect x="20" y="28" width="24" height="18" rx="3" stroke={color} strokeWidth="2" fill={color} opacity="0.25" />
      {/* Curtains */}
      <path d="M24 28 Q28 36 24 44 M40 28 Q36 36 40 44" stroke={color} strokeWidth="1.8" />
      {/* Kalash on top */}
      <circle cx="32" cy="18" r="2.5" fill={color} />
    </svg>
  );
}

export default function InvitationCardGenerator({ onOpenContact }) {
  // Theme & Motif State
  const [theme, setTheme] = useState(THEMES[0]);
  const [selectedMotif, setSelectedMotif] = useState("ganesha");
  const [selectedShloka, setSelectedShloka] = useState(SHLOKAS[0].id);

  // Card Content State
  const [ceremonyType, setCeremonyType] = useState("Vivah Sanskar (Wedding Ceremony)");
  const [brideName, setBrideName] = useState("Ananya");
  const [groomName, setGroomName] = useState("Rahul");
  const [brideParents, setBrideParents] = useState("D/o Smt. Sunita & Shri Rajesh Sharma");
  const [groomParents, setGroomParents] = useState("S/o Smt. Kavita & Shri Anand Verma");
  const [eventDate, setEventDate] = useState("2026-12-14");
  const [displayDate, setDisplayDate] = useState("Sunday, 14th December 2026");
  const [muhuratTime, setMuhuratTime] = useState("Hastamelap: 8:15 PM | Banquet: 7:30 PM Onwards");
  const [venueName, setVenueName] = useState("The Grand Palace Ballroom");
  const [venueAddress, setVenueAddress] = useState("Bandra Kurla Complex (BKC), Mumbai - 400051");
  const [rsvpContact, setRsvpContact] = useState("Sharma: +91 98765 43210 | Verma: +91 98234 56789");

  // Invitation text
  const [invitationBody, setInvitationBody] = useState(
    "request the honor of your gracious presence and blessings to celebrate the auspicious wedding ceremony of their children."
  );

  // AI Prompting
  const [aiTone, setAiTone] = useState("royal");
  const [aiCustomPrompt, setAiCustomPrompt] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Active view tab (main card, schedule, rsvp qr)
  const [activeCardTab, setActiveCardTab] = useState("main");
  const [activeCtrlTab, setActiveCtrlTab] = useState("details"); // 'details', 'ai', 'design', 'schedule'

  // Schedule Items
  const [scheduleItems, setScheduleItems] = useState([
    { ritual: "Shree Ganesh Sthapana & Haldi", time: "10:00 AM", desc: "Auspicious blessings and turmeric ritual" },
    { ritual: "Shahi Baraat Swagat", time: "05:30 PM", desc: "Grand welcome with royal brass band & dhol" },
    { ritual: "Jaimala & Varmala Ceremony", time: "07:00 PM", desc: "Floral garland exchange at central stage" },
    { ritual: "Sacred Vedic Phere & Hastamelap", time: "08:15 PM", desc: "Seven vows around holy agni" },
    { ritual: "Preeti Bhoj (Grand Reception Dinner)", time: "08:00 PM Onwards", desc: "Royal banquet dinner & celebrations" },
  ]);

  // UI Toast
  const [toastMessage, setToastMessage] = useState("");

  const canvasRef = useRef(null);

  // Keep display date updated when eventDate changes
  useEffect(() => {
    try {
      if (eventDate) {
        const d = new Date(eventDate);
        if (!isNaN(d.getTime())) {
          const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
          setDisplayDate(d.toLocaleDateString("en-IN", options));
        }
      }
    } catch {
      // fallback
    }
  }, [eventDate]);

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  }

  // ==========================================
  // AI INVITATION TEXT GENERATOR ENGINE
  // ==========================================
  function handleGenerateAiCopy(toneOverride) {
    const tone = toneOverride || aiTone;
    setIsGeneratingAi(true);

    setTimeout(() => {
      let generated = "";
      if (tone === "royal") {
        generated =
          "cordially solicit the honor of your esteemed presence and heartfelt blessings to grace the royal union and wedding festivities of their beloved children.";
      } else if (tone === "vedic") {
        generated =
          "under the divine grace of Almighty God and revered elders, invite you to witness the sacred Vivah Sanskar and bestow your holy blessings upon the new couple.";
      } else if (tone === "romantic") {
        generated =
          "warmly invite you to share their joy, dance under the stars, and celebrate the unforgettable beginning of a lifetime together as they exchange eternal vows.";
      } else if (tone === "sangeet") {
        generated =
          "invite you to an electrifying evening filled with foot-tapping beats, sparkling cocktail toasts, energetic dance performances, and boundless family joy!";
      } else if (tone === "poetic") {
        generated =
          "तारों की छाँव में, खुशियों के आँगन में — दो दिलों के पावन मिलन पर आप सपरिवार सादर आमंत्रित हैं। आपकी गरिमामयी उपस्थिति हमारे उल्लास को द्विगुणित करेगी।";
      }

      if (aiCustomPrompt.trim()) {
        generated += ` (${aiCustomPrompt.trim()})`;
      }

      setInvitationBody(generated);
      setIsGeneratingAi(false);
      showToast(`✨ Generated ${tone.toUpperCase()} Indian wedding wording!`);
    }, 400);
  }

  // ==========================================
  // RENDER MOTIF COMPONENT
  // ==========================================
  function renderMotif(motifKey, color) {
    switch (motifKey) {
      case "ganesha":
        return <MotifGanesha color={color} />;
      case "kalash":
        return <MotifKalash color={color} />;
      case "peacock":
        return <MotifPeacock color={color} />;
      case "elephant":
        return <MotifElephant color={color} />;
      case "mandala":
        return <MotifMandala color={color} />;
      case "doli":
        return <MotifDoli color={color} />;
      default:
        return <MotifGanesha color={color} />;
    }
  }

  // Active shloka object
  const currentShlokaObj = SHLOKAS.find((s) => s.id === selectedShloka) || SHLOKAS[0];

  // ==========================================
  // EXPORT: DOWNLOAD HD PNG VIA CANVAS
  // ==========================================
  function handleDownloadPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // High resolution canvas (1200 x 1680)
    canvas.width = 1200;
    canvas.height = 1680;

    // 1. Draw Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 1680);
    if (theme.id === "rajput") {
      gradient.addColorStop(0, "#4d0718");
      gradient.addColorStop(1, "#26020b");
    } else if (theme.id === "south") {
      gradient.addColorStop(0, "#0a3325");
      gradient.addColorStop(1, "#03140e");
    } else if (theme.id === "punjabi") {
      gradient.addColorStop(0, "#0e2238");
      gradient.addColorStop(1, "#050d17");
    } else if (theme.id === "pastel") {
      gradient.addColorStop(0, "#fff7f7");
      gradient.addColorStop(1, "#f7e6eb");
    } else if (theme.id === "mughal") {
      gradient.addColorStop(0, "#0a2d36");
      gradient.addColorStop(1, "#021419");
    } else {
      gradient.addColorStop(0, "#5c0d1c");
      gradient.addColorStop(1, "#2f030b");
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 1680);

    // 2. Draw Double Gold Border
    ctx.strokeStyle = theme.accentColor;
    ctx.lineWidth = 10;
    ctx.strokeRect(60, 60, 1080, 1560);

    ctx.lineWidth = 3;
    ctx.strokeRect(84, 84, 1032, 1512);

    // 3. Draw Corner Accents
    const corners = [
      [84, 84],
      [1116, 84],
      [84, 1596],
      [1116, 1596],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = theme.accentColor;
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Shloka Text
    ctx.textAlign = "center";
    ctx.fillStyle = theme.secondaryColor;
    ctx.font = "bold 28px 'Rozha One', 'Cinzel', serif";
    ctx.fillText(currentShlokaObj.text.slice(0, 50), 600, 180);

    // 5. Ceremonial Tag
    ctx.fillStyle = theme.accentColor;
    ctx.font = "bold 24px 'Cinzel', serif";
    ctx.letterSpacing = "6px";
    ctx.fillText("॥ शुभ विवाह ॥", 600, 240);

    // 6. Bride Parents
    ctx.fillStyle = theme.textColor;
    ctx.font = "30px 'Marcellus', 'Playfair Display', serif";
    ctx.fillText(brideParents, 600, 320);

    // 7. Invitation Body
    ctx.font = "italic 26px 'Playfair Display', serif";
    ctx.fillStyle = theme.secondaryColor;
    ctx.fillText(invitationBody.slice(0, 65), 600, 390);

    // 8. Couple Names (Gold & Big)
    ctx.fillStyle = theme.accentColor;
    ctx.font = "bold 82px 'Cinzel', 'Playfair Display', serif";
    ctx.fillText(brideName, 600, 520);

    ctx.font = "italic 64px 'Great Vibes', cursive";
    ctx.fillStyle = theme.secondaryColor;
    ctx.fillText("&", 600, 600);

    ctx.fillStyle = theme.accentColor;
    ctx.font = "bold 82px 'Cinzel', 'Playfair Display', serif";
    ctx.fillText(groomName, 600, 700);

    // 9. Groom Parents
    ctx.fillStyle = theme.textColor;
    ctx.font = "30px 'Marcellus', serif";
    ctx.fillText(groomParents, 600, 780);

    // 10. Ceremony Title
    ctx.fillStyle = theme.accentColor;
    ctx.font = "bold 34px 'Cinzel', serif";
    ctx.fillText(ceremonyType.toUpperCase(), 600, 890);

    // 11. Date Box
    ctx.strokeStyle = theme.accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(300, 960);
    ctx.lineTo(900, 960);
    ctx.stroke();

    ctx.fillStyle = theme.textColor;
    ctx.font = "bold 42px 'Cinzel', serif";
    ctx.fillText(displayDate, 600, 1030);

    ctx.fillStyle = theme.secondaryColor;
    ctx.font = "bold 28px 'Marcellus', sans-serif";
    ctx.fillText(muhuratTime, 600, 1090);

    ctx.beginPath();
    ctx.moveTo(300, 1140);
    ctx.lineTo(900, 1140);
    ctx.stroke();

    // 12. Venue
    ctx.fillStyle = theme.accentColor;
    ctx.font = "bold 34px 'Cinzel', serif";
    ctx.fillText(venueName, 600, 1240);

    ctx.fillStyle = theme.textColor;
    ctx.font = "26px 'Marcellus', sans-serif";
    ctx.fillText(venueAddress, 600, 1290);

    // 13. RSVP Footer
    ctx.fillStyle = theme.secondaryColor;
    ctx.font = "bold 26px 'Marcellus', serif";
    ctx.fillText(`RSVP: ${rsvpContact}`, 600, 1450);

    ctx.font = "italic 22px 'Playfair Display', serif";
    ctx.fillText("Milap Luxury Wedding Invitation Studio • Corporate BKC Mumbai", 600, 1520);

    // Trigger Download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Milap-Wedding-Card-${brideName}-${groomName}.png`;
    link.href = dataUrl;
    link.click();

    showToast("🎉 HD Indian Wedding Card downloaded successfully!");
  }

  // ==========================================
  // WHATSAPP SHARE
  // ==========================================
  function handleShareWhatsApp() {
    const text = `✨ *WEDDING INVITATION* ✨
${currentShlokaObj.text}

*${brideParents}*
${invitationBody}

💍 *${brideName}* ❤️ *${groomName}*
(${groomParents})

🌺 *${ceremonyType}*
📅 *Date:* ${displayDate}
⏰ *Muhurat:* ${muhuratTime}
📍 *Venue:* ${venueName}, ${venueAddress}

💌 *RSVP:* ${rsvpContact}

_We eagerly await your presence and blessings!_
Created via Milap Wedding Studio (http://localhost:5173)`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
    showToast("📲 WhatsApp invite message ready to share!");
  }

  // ==========================================
  // COPY INVITATION TEXT
  // ==========================================
  function handleCopyText() {
    const text = `✨ WEDDING INVITATION ✨
${currentShlokaObj.text}

${brideParents}
${invitationBody}

${brideName} & ${groomName}
(${groomParents})

Function: ${ceremonyType}
Date: ${displayDate}
Muhurat: ${muhuratTime}
Venue: ${venueName}, ${venueAddress}

RSVP: ${rsvpContact}`;

    navigator.clipboard.writeText(text);
    showToast("📋 Invitation wording copied to clipboard!");
  }

  // ==========================================
  // PRINT CARD / SAVE AS PDF
  // ==========================================
  function handlePrint() {
    window.print();
  }

  return (
    <div className="invitation-studio">
      {/* Hidden canvas for PNG export */}
      <canvas ref={canvasRef} className="hidden-export-canvas" />

      {/* Hero Banner */}
      <section className="studio-hero">
        <div className="studio-badge">
          <Sparkles size={14} /> MILAP AI INVITATION STUDIO
        </div>
        <h1>
          Royal Indian <span>AI Wedding Cards</span>
        </h1>
        <p>
          Design authentic, luxury Indian wedding cards with Sanskrit shlokas, regal
          palace motifs, and AI-composed auspicious wording in seconds.
        </p>
      </section>

      {/* Preset Themes Selector */}
      <section className="presets-section">
        <div className="section-label">
          <Palette size={15} /> Select Royal Indian Aesthetic
        </div>
        <div className="theme-pill-grid">
          {THEMES.map((t) => (
            <div
              key={t.id}
              className={`theme-pill ${theme.id === t.id ? "active" : ""}`}
              onClick={() => {
                setTheme(t);
                setSelectedMotif(t.motif);
              }}
            >
              <div className="theme-color-dot" style={{ background: t.dotColor }} />
              <div className="theme-pill-info">
                <strong>{t.name}</strong>
                <small>{t.subtitle}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Studio Workspace */}
      <div className="studio-workspace">
        {/* LEFT COLUMN: CONTROLS & AI ENGINE */}
        <div className="controls-card">
          {/* Tab Navigation */}
          <div className="controls-tabs">
            <button
              className={`ctrl-tab-btn ${activeCtrlTab === "details" ? "active" : ""}`}
              onClick={() => setActiveCtrlTab("details")}
            >
              <Heart size={14} /> Couple & Venue
            </button>
            <button
              className={`ctrl-tab-btn ${activeCtrlTab === "ai" ? "active" : ""}`}
              onClick={() => setActiveCtrlTab("ai")}
            >
              <Sparkles size={14} /> AI Wording
            </button>
            <button
              className={`ctrl-tab-btn ${activeCtrlTab === "design" ? "active" : ""}`}
              onClick={() => setActiveCtrlTab("design")}
            >
              <Sliders size={14} /> Motifs & Shlokas
            </button>
            <button
              className={`ctrl-tab-btn ${activeCtrlTab === "schedule" ? "active" : ""}`}
              onClick={() => setActiveCtrlTab("schedule")}
            >
              <Calendar size={14} /> Rituals
            </button>
          </div>

          <div className="tab-content">
            {/* TAB 1: DETAILS */}
            {activeCtrlTab === "details" && (
              <div>
                <div className="form-grid">
                  <div className="form-group form-group-full">
                    <label>Ceremony / Event Type</label>
                    <select
                      value={ceremonyType}
                      onChange={(e) => setCeremonyType(e.target.value)}
                    >
                      <option value="Vivah Sanskar (Wedding Ceremony)">Vivah Sanskar (Wedding Ceremony)</option>
                      <option value="Sangeet & Cocktail Night">Sangeet & Cocktail Night</option>
                      <option value="Haldi & Mehendi Celebration">Haldi & Mehendi Celebration</option>
                      <option value="Ring Ceremony & Sagai">Ring Ceremony & Sagai (Engagement)</option>
                      <option value="Royal Reception (Preeti Bhoj)">Royal Reception (Preeti Bhoj)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Bride's Name</label>
                    <input
                      type="text"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="e.g. Ananya"
                    />
                  </div>

                  <div className="form-group">
                    <label>Groom's Name</label>
                    <input
                      type="text"
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="e.g. Rahul"
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label>Bride's Parents / Host Line</label>
                    <input
                      type="text"
                      value={brideParents}
                      onChange={(e) => setBrideParents(e.target.value)}
                      placeholder="e.g. D/o Smt. Sunita & Shri Rajesh Sharma"
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label>Groom's Parents Line</label>
                    <input
                      type="text"
                      value={groomParents}
                      onChange={(e) => setGroomParents(e.target.value)}
                      placeholder="e.g. S/o Smt. Kavita & Shri Anand Verma"
                    />
                  </div>

                  <div className="form-group">
                    <label>Wedding Date</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Shubh Muhurat & Timing</label>
                    <input
                      type="text"
                      value={muhuratTime}
                      onChange={(e) => setMuhuratTime(e.target.value)}
                      placeholder="e.g. Hastamelap: 8:15 PM"
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label>Venue Name</label>
                    <input
                      type="text"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder="e.g. The Grand Palace Ballroom"
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label>Venue Address & City</label>
                    <input
                      type="text"
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      placeholder="e.g. BKC, Mumbai - 400051"
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label>RSVP Contact Numbers</label>
                    <input
                      type="text"
                      value={rsvpContact}
                      onChange={(e) => setRsvpContact(e.target.value)}
                      placeholder="e.g. Sharma: 9876543210 | Verma: 9823456789"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: AI WORDING GENERATOR */}
            {activeCtrlTab === "ai" && (
              <div>
                <div className="ai-magic-box">
                  <div className="ai-magic-title">
                    <Sparkles size={16} /> Milap AI Invitation Assistant
                  </div>
                  <p style={{ fontSize: 13, color: "#666", margin: "0 0 10px" }}>
                    Select an auspicious Indian invitation tone or provide a custom cue.
                    AI will instantly adapt the wording:
                  </p>

                  <div className="ai-tone-chips">
                    {[
                      { id: "royal", label: "👑 Royal & Grand" },
                      { id: "vedic", label: "🕉️ Vedic & Devotional" },
                      { id: "romantic", label: "❤️ Modern Romantic" },
                      { id: "sangeet", label: "💃 Sangeet & Festive" },
                      { id: "poetic", label: "📜 Poetic Hindi" },
                    ].map((tone) => (
                      <button
                        key={tone.id}
                        className={`tone-chip ${aiTone === tone.id ? "active" : ""}`}
                        onClick={() => {
                          setAiTone(tone.id);
                          handleGenerateAiCopy(tone.id);
                        }}
                      >
                        {tone.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#777", textTransform: "uppercase" }}>
                      Optional Custom AI Prompt
                    </label>
                    <input
                      type="text"
                      value={aiCustomPrompt}
                      onChange={(e) => setAiCustomPrompt(e.target.value)}
                      placeholder="e.g. Mention traditional dress code or cocktail night"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #e2c0cb",
                        fontSize: 13,
                        marginTop: 4,
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <button
                    className="ai-btn-generate"
                    onClick={() => handleGenerateAiCopy()}
                    disabled={isGeneratingAi}
                  >
                    {isGeneratingAi ? (
                      <>
                        <RefreshCw size={15} className="spin" /> Generating Auspicious Wording...
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} /> Regenerate AI Invitation Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="form-group form-group-full">
                  <label>Current Invitation Body Text</label>
                  <textarea
                    rows={4}
                    value={invitationBody}
                    onChange={(e) => setInvitationBody(e.target.value)}
                    placeholder="Enter or edit the main invitation copy"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: MOTIFS & SHLOKAS */}
            {activeCtrlTab === "design" && (
              <div>
                <label className="section-label">
                  Sacred Indian Symbol / Motif
                </label>
                <div className="motif-picker">
                  {[
                    { id: "ganesha", label: "Lord Ganesha" },
                    { id: "kalash", label: "Sacred Kalash" },
                    { id: "peacock", label: "Royal Peacock" },
                    { id: "elephant", label: "Royal Elephant" },
                    { id: "mandala", label: "Floral Mandala" },
                    { id: "doli", label: "Bridal Doli" },
                  ].map((m) => (
                    <div
                      key={m.id}
                      className={`motif-item ${selectedMotif === m.id ? "active" : ""}`}
                      onClick={() => setSelectedMotif(m.id)}
                    >
                      <div className="motif-icon-wrap">
                        {renderMotif(m.id, "#941b45")}
                      </div>
                      <span className="motif-label">{m.label}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 20 }}>
                  <label className="section-label">Auspicious Sanskrit Shloka</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {SHLOKAS.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedShloka(s.id)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 10,
                          border: selectedShloka === s.id ? "2px solid #941b45" : "1px solid #eed8df",
                          background: selectedShloka === s.id ? "#fff5f8" : "#fff",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <strong style={{ fontSize: 13, color: "#881337", display: "block" }}>
                          {s.title}
                        </strong>
                        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#555", fontFamily: "'Rozha One', serif" }}>
                          {s.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: RITUALS SCHEDULE */}
            {activeCtrlTab === "schedule" && (
              <div>
                <div className="section-label">Wedding Rituals & Timeline</div>
                <p style={{ fontSize: 13, color: "#666", margin: "0 0 14px" }}>
                  These events appear in the &quot;Rituals Timeline&quot; card view:
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {scheduleItems.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        border: "1px solid #ebd3da",
                        background: "#faf4f6",
                      }}
                    >
                      <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                        <input
                          type="text"
                          value={item.ritual}
                          onChange={(e) => {
                            const updated = [...scheduleItems];
                            updated[index].ritual = e.target.value;
                            setScheduleItems(updated);
                          }}
                          placeholder="Ritual name"
                          style={{ flex: 2, padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 13 }}
                        />
                        <input
                          type="text"
                          value={item.time}
                          onChange={(e) => {
                            const updated = [...scheduleItems];
                            updated[index].time = e.target.value;
                            setScheduleItems(updated);
                          }}
                          placeholder="Time"
                          style={{ flex: 1, padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 13 }}
                        />
                      </div>
                      <input
                        type="text"
                        value={item.desc}
                        onChange={(e) => {
                          const updated = [...scheduleItems];
                          updated[index].desc = e.target.value;
                          setScheduleItems(updated);
                        }}
                        placeholder="Description"
                        style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc", fontSize: 12, boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE CARD PREVIEW & EXPORT ACTIONS */}
        <div className="preview-column">
          {/* Card View Switcher Tabs */}
          <div className="preview-toolbar">
            <div className="card-view-tabs">
              <button
                className={`card-view-tab ${activeCardTab === "main" ? "active" : ""}`}
                onClick={() => setActiveCardTab("main")}
              >
                Front Invitation
              </button>
              <button
                className={`card-view-tab ${activeCardTab === "schedule" ? "active" : ""}`}
                onClick={() => setActiveCardTab("schedule")}
              >
                Rituals Schedule
              </button>
              <button
                className={`card-view-tab ${activeCardTab === "rsvp" ? "active" : ""}`}
                onClick={() => setActiveCardTab("rsvp")}
              >
                RSVP & QR
              </button>
            </div>

            <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>
              Live HD Preview
            </span>
          </div>

          {/* THE REALISTIC INVITATION CARD SURFACE */}
          <div className="card-outer-wrap">
            <div
              className="indian-invitation-card"
              style={{
                background: theme.bg,
                color: theme.textColor,
                border: `1px solid ${theme.borderColor}`,
              }}
            >
              <div
                className="card-inner-border"
                style={{
                  borderColor: theme.borderColor,
                }}
              >
                {/* 4 Corner Ornaments */}
                <div className="card-corner corner-tl" style={{ borderColor: theme.accentColor }} />
                <div className="card-corner corner-tr" style={{ borderColor: theme.accentColor }} />
                <div className="card-corner corner-bl" style={{ borderColor: theme.accentColor }} />
                <div className="card-corner corner-br" style={{ borderColor: theme.accentColor }} />

                {/* VIEW 1: FRONT MAIN CARD */}
                {activeCardTab === "main" && (
                  <>
                    {/* Sanskrit Shloka */}
                    <div
                      className="card-shloka"
                      style={{ color: theme.secondaryColor }}
                    >
                      {currentShlokaObj.text}
                    </div>

                    {/* Central Motif */}
                    <div className="card-motif-center">
                      {renderMotif(selectedMotif, theme.accentColor)}
                    </div>

                    <div
                      className="card-blessing-header"
                      style={{ color: theme.accentColor }}
                    >
                      ॥ मंगल परिणय ॥
                    </div>

                    {/* Host & Parents */}
                    <div className="card-parents">
                      {brideParents}
                    </div>

                    <div
                      className="card-body-text"
                      style={{ color: theme.secondaryColor }}
                    >
                      {invitationBody}
                    </div>

                    {/* Couple Names */}
                    <div className="card-couple-names">
                      <span
                        className="card-bride"
                        style={{ color: theme.accentColor }}
                      >
                        {brideName}
                      </span>
                      <span
                        className="card-ampersand"
                        style={{ color: theme.secondaryColor }}
                      >
                        &
                      </span>
                      <span
                        className="card-groom"
                        style={{ color: theme.accentColor }}
                      >
                        {groomName}
                      </span>
                    </div>

                    {/* Groom Parents */}
                    <div className="card-parents" style={{ fontSize: 12.5, opacity: 0.9 }}>
                      {groomParents}
                    </div>

                    {/* Ceremony Title */}
                    <div
                      className="card-event-title"
                      style={{ color: theme.accentColor }}
                    >
                      {ceremonyType}
                    </div>

                    {/* Date & Muhurat Badge */}
                    <div
                      className="card-datetime-badge"
                      style={{ borderColor: theme.accentColor }}
                    >
                      <span className="card-date">{displayDate}</span>
                      <span className="card-time" style={{ color: theme.secondaryColor }}>
                        {muhuratTime}
                      </span>
                    </div>

                    {/* Venue */}
                    <div className="card-venue">
                      <strong style={{ color: theme.accentColor }}>{venueName}</strong>
                      <p>{venueAddress}</p>
                    </div>

                    {/* RSVP Footer */}
                    <div
                      className="card-rsvp-row"
                      style={{ borderColor: theme.accentColor, color: theme.secondaryColor }}
                    >
                      <span>RSVP: {rsvpContact}</span>
                      <span>With Best Compliments</span>
                    </div>
                  </>
                )}

                {/* VIEW 2: RITUALS SCHEDULE CARD */}
                {activeCardTab === "schedule" && (
                  <>
                    <div
                      className="card-blessing-header"
                      style={{ color: theme.accentColor, marginTop: 10 }}
                    >
                      ॥ कार्यक्रम विवरण ॥
                    </div>

                    <h2
                      style={{
                        fontFamily: "'Cinzel', serif",
                        margin: "4px 0 10px",
                        color: theme.accentColor,
                        fontSize: 22,
                      }}
                    >
                      Rituals & Celebrations
                    </h2>

                    <p
                      style={{
                        fontSize: 12,
                        color: theme.secondaryColor,
                        marginBottom: 16,
                      }}
                    >
                      {displayDate} • {venueName}
                    </p>

                    <div className="card-schedule-list">
                      {scheduleItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="schedule-item"
                          style={{ borderColor: theme.accentColor }}
                        >
                          <div>
                            <strong style={{ color: theme.textColor }}>{item.ritual}</strong>
                            <small style={{ color: theme.secondaryColor }}>{item.desc}</small>
                          </div>
                          <span
                            className="schedule-time"
                            style={{ color: theme.accentColor }}
                          >
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div
                      className="card-rsvp-row"
                      style={{ borderColor: theme.accentColor, color: theme.secondaryColor, marginTop: "auto" }}
                    >
                      <span>Join us for the celebrations</span>
                      <span>Milap Weddings</span>
                    </div>
                  </>
                )}

                {/* VIEW 3: RSVP & QR CARD */}
                {activeCardTab === "rsvp" && (
                  <>
                    <div
                      className="card-blessing-header"
                      style={{ color: theme.accentColor, marginTop: 14 }}
                    >
                      ॥ निमंत्रण एवं मार्गदर्शन ॥
                    </div>

                    <h2
                      style={{
                        fontFamily: "'Cinzel', serif",
                        margin: "6px 0 4px",
                        color: theme.accentColor,
                        fontSize: 22,
                      }}
                    >
                      Digital RSVP & Venue Map
                    </h2>

                    <p style={{ fontSize: 13, color: theme.secondaryColor, margin: "0 0 14px" }}>
                      Scan the QR Code to navigate to the wedding venue or confirm RSVP
                    </p>

                    {/* QR Code Visual Box */}
                    <div className="card-qr-box">
                      <QrCode size={105} color="#1a1a1a" />
                    </div>

                    <div style={{ marginTop: 8, textAlign: "center" }}>
                      <strong style={{ display: "block", color: theme.accentColor, fontSize: 14 }}>
                        {venueName}
                      </strong>
                      <p style={{ fontSize: 12, margin: "4px 0 14px", color: theme.secondaryColor }}>
                        {venueAddress}
                      </p>
                    </div>

                    <div
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        padding: "10px 16px",
                        borderRadius: 10,
                        border: `1px solid ${theme.accentColor}`,
                        width: "85%",
                        margin: "0 auto",
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: theme.accentColor }}>
                        Direct Helpline & Accommodation
                      </div>
                      <div style={{ fontSize: 11.5, marginTop: 4, color: theme.textColor }}>
                        {rsvpContact}
                      </div>
                    </div>

                    <div
                      className="card-rsvp-row"
                      style={{ borderColor: theme.accentColor, color: theme.secondaryColor, marginTop: "auto" }}
                    >
                      <span>Digital RSVP Card</span>
                      <span>Milap Wedding Planner</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="card-actions-bar">
            <button
              className="action-btn-primary"
              onClick={handleDownloadPNG}
              title="Download high-resolution image"
            >
              <Download size={16} /> Download HD Card (PNG)
            </button>

            <button
              className="action-btn-secondary"
              onClick={handlePrint}
              title="Print or Save as PDF"
            >
              <Printer size={16} /> Print / PDF
            </button>

            <button
              className="action-btn-secondary"
              onClick={handleCopyText}
              title="Copy formatted text"
            >
              <Copy size={16} /> Copy Text
            </button>

            <button
              className="action-btn-whatsapp"
              onClick={handleShareWhatsApp}
              title="Share on WhatsApp"
            >
              <Share2 size={16} /> Share on WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Milap Luxury Printed Card Service Banner */}
      <section className="printing-service-banner">
        <div className="service-left">
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#881337", marginBottom: 4 }}>
            <Building size={16} /> MILAP LUXURY PRINT STUDIO • BKC MUMBAI
          </div>
          <h3>Prefer Physical Velvet or Gold-Foil Box Invites?</h3>
          <p>
            Visit our Mumbai Bandra Kurla Complex (BKC) studio to explore imported
            Italian handmade cardstocks, real 24k gold foil stamping, and engraved acrylic boxes.
          </p>
          <div className="service-tiers">
            <span className="tier-badge">✨ Digital e-Invite: Free Instant HD Download</span>
            <span className="tier-badge">📜 Gold Foil Hardcover: ₹180 / Card</span>
            <span className="tier-badge">🎁 Royal Velvet Box & Sweets: ₹450 / Box</span>
          </div>
        </div>

        <button
          className="action-btn-primary"
          style={{ width: "auto", padding: "14px 24px" }}
          onClick={onOpenContact}
        >
          Book Studio Appointment <ArrowRight size={16} />
        </button>
      </section>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="copy-toast">
          <CheckCircle2 size={18} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
