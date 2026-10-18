# VivahPatra AI — Indian Invitation Card Studio 🌸🪔

> **A production-ready web studio combining traditional Indian printed-paper invitation aesthetics, Google Gemini AI copywriting, multilingual native script typography, AI-generated background artwork, and print-ready 300 DPI PDF engineering.**

---

## 🌟 Overview

**VivahPatra AI** is designed for the rich diversity of Indian ceremonies. It unites the texture, warmth, and opulence of traditional Indian wedding cards (royal velvet, antique parchment, handmade ivory paper, gold foil borders, and auspicious motifs) with modern web engineering, Google Gemini AI, and a live visual editor.

---

## ✨ Key Features

1. **14 Supported Indian Languages (Native Scripts)**:
   - Hindi (हिन्दी) • Bengali (বাংলা) • Marathi (मराठी) • Gujarati (ગુજરાતી) • Punjabi (ਪੰਜਾਬੀ) • Tamil (தமிழ்) • Telugu (తెలుగు) • Kannada (ಕನ್ನಡ) • Malayalam (മലയാളം) • Odia (ଓଡ଼ିଆ) • Assamese (অসমীয়া) • Urdu (اردو with RTL) • Sanskrit (संस्कृतम्) • English
   - Preloaded Google Fonts for proper Indic conjunct shaping and glyph rendering without missing boxes or broken text.
2. **14 Dedicated Event Categories**:
   - Wedding • Engagement / Sagai / Roka • Ring Ceremony • Birthday • Wedding Anniversary • Baby Shower / Godh Bharai / Seemantham • Naming Ceremony / Naamkaran • Housewarming / Griha Pravesh & Vastu Shanti • Religious Ceremony / Satyanarayan Puja / Havan • Reception • Mundan • Graduation • Retirement • Custom Celebration.
3. **Google Gemini AI Content Generator**:
   - Structured invitation copywriting (blessings, headings, couple parentage, venue & muhurat, RSVP).
   - Tone selector: Royal, Devotional, Elegant, Poetic, Emotional, Minimal, Joyful Birthday, Formal.
   - Translation, grammar proofreading, and WhatsApp-ready invitation generation.
   - Graceful cultural fallback when API keys are not supplied.
4. **AI Background & Traditional Motif Library**:
   - Generate vector/SVG traditional artwork reserving central space for crisp Indic text.
   - Authentic motifs: Lord Ganesha, Mangal Kalash, Lotus, Royal Doli, Peacock, Diya, Shehnai, Om, Swastik, Ik Onkar, Bismillah, Kalka corners, Ornate arches.
5. **Multi-Page Card Architecture**:
   - Cover Page (Front)
   - Detailed Invitation Page
   - Ceremony Schedule / Haldi / Sangeet / Reception
   - Thank You / Directions Page
6. **Print-Ready 300 DPI PDF & Digital Export**:
   - Chromium/Puppeteer-powered PDF generator with vector fonts and proper HarfBuzz text shaping.
   - Optional 3mm print bleed and crop/trim marks.
   - Presets for Print PDF, Digital PDF, High-Res PNG, and WhatsApp Story (9:16).
7. **Interactive Venue QR Code**:
   - Place a scannable Google Maps directions QR code directly on the card so guests can scan and navigate to the banquet hall.
8. **Persistent Projects & Guest Mode**:
   - Automatic save, load, duplicate, and delete with MongoDB and automatic local fallback storage.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Zustand, Lucide React, Canvas Confetti, QRCode.
- **Backend**: Node.js, Express.js, TypeScript, Mongoose, Puppeteer (Chromium/Edge), Multer, Bcrypt, JWT.
- **AI**: Official `@google/generative-ai` SDK.
- **Database**: MongoDB with Mongoose (with automated local JSON persistence fallback).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: (Optional — local fallback storage automatically activates if MongoDB is not running)
- **Google Chrome / Microsoft Edge**: Already detected on Windows/Linux/macOS for Puppeteer PDF rendering.

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/wedding-card.git
cd wedding-card

# Install root, client, and server dependencies
npm run install:all # Or run:
npm install
npm --prefix client install
$env:PUPPETEER_SKIP_DOWNLOAD="true"; npm --prefix server install
```

### 2. Environment Configuration

Copy `.env.example` to `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/vivahpatra
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=vivahpatra_dev_secret_key_12345
CLIENT_URL=http://localhost:5173
```

> **Note on Gemini AI**: If you don't have a Gemini API key yet, the application will seamlessly run in **Demo / Cultural Fallback Mode**, generating authentic, culturally rich invitations in all 14 Indian languages!

### 3. Start Development Servers

Run both backend and frontend concurrently:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Testing

VivahPatra AI includes an automated 15-workflow test suite covering all functional pipelines:

```bash
npm run test
# Or inside server directory:
cd server && npx tsx test/test_suite.ts
```

Workflows verified in the test suite:
1. Hindi wedding invitation generation
2. Bengali wedding content generation
3. Marathi birthday invitation generation
4. AI vector artwork generation
5. Template switching with detail persistence
6. Edit & save project persistence
7. Multi-page card structure (Cover + Detailed Pages)
8. Multi-page PDF generation (300 DPI)
9. Indic native script font embedding
10. High-resolution PNG export
11. Project reload and persistence
12. Missing API key graceful fallback
13. Layout dimensions & safe area verification
14. User project access control
15. Valid PDF file generation on disk

---

## 📦 Production Build

```bash
# Build both server and client
npm run build

# Start production server
npm start
```

---

## 📜 License

MIT License. Designed with reverence for Indian wedding traditions and digital craftsmanship.
