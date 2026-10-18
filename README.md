# Milap (मिलाप) - Modern Indian Wedding & Event Management Platform

> A comprehensive, full-stack Indian Wedding & Event Management platform with integrated **VivahPatra AI** - an advanced multi-faith, 30+ regional language digital invitation card studio.

---

## 🌟 Overview & Key Features

### 1. Milap Core Platform (`client/` & `server/`)
- **Event & Venue Management**: Browse curated heritage venues, palatial resorts, banquet halls, and wedding destinations.
- **Interactive Food Planner**: Real-time multi-cuisine catering calculator with live price estimates, regional Indian cuisines (North Indian, South Indian, Gujarati, Marwari, Awadhi, Bengali), live chaat counters, and beverage stations.
- **Universal Header & Navigation**: Seamless navigation across Home, Venues, Food Planner, Invitations, Contact/Location, and About Us.
- **Responsive Dark Charcoal Universal Footer**: Quick links, 24/7 dedicated event support, contact info, and legal policies.
- **User Authentication & Profile Manager**: Secure JWT authentication, user profile management, and saved bookings.
- **Admin Management Portal**: Administrative overview for bookings, event inquiries, and venue listings.

### 2. VivahPatra AI Invitation Card Studio (`wedding-card/`)
- **30+ Regional Indian Languages & Universal Script Adaptation**:
  - Full support for Hindi, Sanskrit, Gujarati, Punjabi (Gurmukhi), Bengali, Tamil, Telugu, Kannada, Malayalam, Marathi, Odia, Assamese, Urdu (Nastaliq/Arabic), Kashmiri, Maithili, and English.
  - Automatically loads Google Fonts appropriate for each script (Noto Sans Devanagari, Gurmukhi, Tamil, Bengali, Telugu, Noto Nastaliq Urdu, etc.).
- **Auspicious Cultural & Religious Motifs**:
  - Automatically switches sacred motifs based on regional tradition and religion:
    - **Hindu**: Shubh Ganesha, Mangal Kalash, Diya, Lotus.
    - **Muslim / Urdu / Kashmiri**: Hilal Crescent & Star, Bismillah calligraphy.
    - **Sikh / Punjabi**: Ik Onkar, Khanda.
    - **Milestone & Celebration**: Solitaire Diamond Rings, Bal Gopal Cradle, Sacred Hawan Kund.
- **Sacred Mantras & Invocations by Tradition**:
  - Auto-adapts sacred invocations and blessings tailored to each faith and region (Vakratunda Mahakaya, Mangalam Bhagwan Vishnu, Ek Onkar Satnam, Bismillahir Rahmanir Raheem, etc.).
- **Categorical Event Templates**:
  - **Wedding (विवाह)**: Royal Marwar, South Indian Temple Gold, Punjabi Royal Sangeet.
  - **Ring Ceremony / Engagement (सगाई)**: Rose Gold Shimmer with Solitaire Diamond Rings motif.
  - **Graduation / Convocation (दीक्षांत समारोह)**: Academic honors with Saraswati Lotus motif and scholar details.
  - **Retirement (सेवानिवृत्ति)**: Golden years honoring lifetime service.
  - **Naamkaran (नामकरण)**: Gentle pastel cradles and divine blessings.
  - **Mundan (मुंडन)**: Traditional Hawan and auspicious blessings.
  - **Griha Pravesh (गृह प्रवेश)** & **Anniversary (वैवाहिक वर्षगांठ)**.
- **Full Customization Studio**:
  - Real-time drag-and-drop canvas, multi-layer management, text formatting, regional background textures (Royal Silk, Rose Shimmer, Navy Velvet, Turmeric Parchment, Emerald Parchment).
  - High-resolution PDF export, PNG preview generator, and dynamic event RSVP QR codes.

---

## 🏗️ Repository Architecture

```
Milap/
├── client/                     # Milap Main Web Client (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # UniversalHeader, UniversalFooter, FoodPlanner, etc.
│   │   ├── App.jsx             # Main router and view controllers
│   │   └── main.jsx
│   └── package.json
│
├── server/                     # Milap Main Backend API (Node.js + Express + MongoDB)
│   ├── models/                 # Booking, FoodPlan, User models
│   ├── routes/                 # Auth and booking endpoints
│   ├── server.js               # Express entrypoint
│   └── package.json
│
└── wedding-card/               # VivahPatra AI Invitation Card Studio
    ├── client/                 # Card Studio Web App (React 18 + Vite + TypeScript + Zustand)
    │   ├── src/
    │   │   ├── components/     # CardCanvas, Editor, Modals, Auspicious Motifs
    │   │   ├── data/           # 30+ Languages, Motifs, Templates, Categories
    │   │   ├── store/          # Zustand State Management (cardStore.ts)
    │   │   └── types/          # TypeScript Card & Event Schemas
    │   └── package.json
    │
    └── server/                 # Card Studio Export & AI Backend (Express + TypeScript + Puppeteer)
        ├── src/
        │   ├── controllers/    # Project, Export, AI generation
        │   ├── services/       # PDF vector export & Gemini AI wording
        │   └── index.ts
        └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017 or a MongoDB Atlas URI)

---

### 1. Running the Milap Main Portal

```bash
# 1. Start Milap Backend Server
cd server
npm install
npm run dev # or npm start (runs on http://localhost:5000)

# 2. In a separate terminal, start Milap Frontend
cd client
npm install
npm run dev # (runs on http://localhost:5173)
```

Open `http://localhost:5173` in your browser.

---

### 2. Running the VivahPatra AI Invitation Card Studio

```bash
# 1. Start Card Studio Backend
cd wedding-card/server
npm install
npm run dev # (runs on http://localhost:5001)

# 2. In a separate terminal, start Card Studio Frontend
cd wedding-card/client
npm install
npm run dev # (runs on http://localhost:5174)
```

Open `http://localhost:5174` in your browser or click **"Invitations"** on the Milap main platform.

---

## 🚀 One-Click Cloud Deployment

### A. Deploy on Render (Full-Stack Backend + Client)
This repository includes a native [`render.yaml`](render.yaml) Blueprint configuration:
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository: `https://github.com/dwivedianandnarayan7133/Milap` (or `https://github.com/Vishal-9580/Milap`).
4. Render automatically configures:
   - **`milap-server`** (Node.js web service running Express API)
   - **`milap-client`** (Fast static site running React + Vite with SPA rewrites)
5. Add your `MONGODB_URI` connection string in the Render environment variables dashboard.
6. Click **Apply** to deploy live!

### B. Deploy on Vercel (Frontend Client)
This repository includes [`vercel.json`](vercel.json) pre-configured with Vite and SPA rewrites:
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository: `https://github.com/dwivedianandnarayan7133/Milap`.
4. Vercel automatically detects the build command (`cd client && npm install && npm run build`) and output directory (`client/dist`).
5. Click **Deploy** — your live production URL is ready in under 60 seconds!

---

## 🎨 Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Canvas API, Google Fonts.
- **State Management**: Zustand with persistent local storage and history stack (undo/redo).
- **Backend**: Node.js, Express, TypeScript, Mongoose, JWT authentication.
- **Export & Rendering**: Puppeteer for print-ready vector PDF & high-res image generation.
- **AI Integration**: Google Gemini API for cultural invitation wording, tone styling, and translations.

---

## 📄 License
ISC License. Built with ❤️ for celebrating memorable Indian weddings and cultural events.
