import { useEffect, useMemo, useState } from "react";
import {
  Users,
  ShoppingBasket,
  FileDown,
  Search,
  RotateCcw,
  Sparkles,
  ChefHat,
  Info,
  Layers,
  ArrowRight
} from "lucide-react";
import { jsPDF } from "jspdf";
import logoImg from "./assets/logo.jpg";
import "./FoodPlanner.css";
import { API_BASE } from "./apiConfig";

const STORAGE_KEY = "shaadiManagerFoodPlanner";
const API_URL = `${API_BASE}/api/food-plan`;

// Comprehensive Indian Wedding Recipes and Catering Ingredients
const ALL_RECIPES = [
  // Grains & Roti
  { id: "rice", name: "Basmati Chawal (Pulao/Jeera)", category: "Grains & Roti", unit: "kg", perGuest: 0.08, rate: 80, veg: true },
  { id: "atta", name: "Gehun Ka Aata (Tawa/Tandoori)", category: "Grains & Roti", unit: "kg", perGuest: 0.10, rate: 45, veg: true },
  { id: "maida", name: "Maida (Naan/Poori/Bhature)", category: "Grains & Roti", unit: "kg", perGuest: 0.05, rate: 45, veg: true },
  { id: "dal", name: "Dal Makhani / Arhar Dal", category: "Grains & Roti", unit: "kg", perGuest: 0.035, rate: 140, veg: true },
  { id: "chana", name: "Pindi Chole / Rajma", category: "Grains & Roti", unit: "kg", perGuest: 0.03, rate: 110, veg: true },

  // Dairy & Paneer
  { id: "paneer", name: "Shahi Paneer / Kadai Paneer", category: "Dairy & Paneer", unit: "kg", perGuest: 0.06, rate: 380, veg: true },
  { id: "ghee", name: "Shuddh Desi Ghee", category: "Dairy & Paneer", unit: "kg", perGuest: 0.02, rate: 650, veg: true },
  { id: "dahi", name: "Dahi (Raita & Cooking)", category: "Dairy & Paneer", unit: "kg", perGuest: 0.05, rate: 70, veg: true },
  { id: "milk", name: "Taaza Doodh (Kheer & Chai)", category: "Dairy & Paneer", unit: "litre", perGuest: 0.08, rate: 65, veg: true },

  // Fresh Vegetables
  { id: "potato", name: "Aloo (Dum Aloo & Snacks)", category: "Vegetables", unit: "kg", perGuest: 0.07, rate: 30, veg: true },
  { id: "tomato", name: "Tamatar (Gravy & Salads)", category: "Vegetables", unit: "kg", perGuest: 0.04, rate: 40, veg: true },
  { id: "onion", name: "Pyaz (Tadka & Gravy)", category: "Vegetables", unit: "kg", perGuest: 0.05, rate: 35, veg: true },
  { id: "matar", name: "Hari Matar (Matar Paneer/Pulao)", category: "Vegetables", unit: "kg", perGuest: 0.03, rate: 90, veg: true },
  { id: "cauliflower", name: "Gobhi / Seasonal Mix Veg", category: "Vegetables", unit: "kg", perGuest: 0.05, rate: 45, veg: true },

  // Cooking Essentials & Spices
  { id: "oil", name: "Cooking Refined Oil", category: "Spices & Oil", unit: "litre", perGuest: 0.025, rate: 145, veg: true },
  { id: "spices", name: "Mixed Shahi Masale (Haldi/Mirch/Garam)", category: "Spices & Oil", unit: "kg", perGuest: 0.012, rate: 450, veg: true },
  { id: "dryfruits", name: "Kaju & Kismis (Garnishing & Mithai)", category: "Spices & Oil", unit: "kg", perGuest: 0.008, rate: 950, veg: true },

  // Mithai & Desserts
  { id: "sweets", name: "Gulab Jamun / Rasgulla", category: "Sweets & Desserts", unit: "kg", perGuest: 0.12, rate: 280, veg: true },
  { id: "kajukatli", name: "Kaju Katli / Special Barfi", category: "Sweets & Desserts", unit: "kg", perGuest: 0.05, rate: 850, veg: true },
  { id: "icecream", name: "Ice Cream / Matka Kulfi", category: "Sweets & Desserts", unit: "cups", perGuest: 1, rate: 30, veg: true },

  // Chaat & Beverages
  { id: "chaat", name: "Live Chaat (Pani Puri & Tikki)", category: "Chaat & Drinks", unit: "plates", perGuest: 1, rate: 45, veg: true },
  { id: "mocktails", name: "Welcome Drinks & Mocktails", category: "Chaat & Drinks", unit: "glasses", perGuest: 1, rate: 35, veg: true },
  { id: "coffee", name: "Espresso Coffee & Kulhad Tea", category: "Chaat & Drinks", unit: "cups", perGuest: 1.2, rate: 20, veg: true },
  { id: "water", name: "Packaged Mineral Water (250ml)", category: "Chaat & Drinks", unit: "bottles", perGuest: 2.5, rate: 8, veg: true },

  // Non-Veg Options
  { id: "chicken", name: "Chicken Curry / Butter Chicken", category: "Non-Veg", unit: "kg", perGuest: 0.18, rate: 280, veg: false },
  { id: "mutton", name: "Mutton Rogan Josh / Curry", category: "Non-Veg", unit: "kg", perGuest: 0.15, rate: 750, veg: false },
  { id: "biryani", name: "Dum Biryani (Chicken/Mutton)", category: "Non-Veg", unit: "kg", perGuest: 0.15, rate: 320, veg: false },
];

const PRESET_MENUS = [
  {
    id: "standard",
    name: "Standard North Indian (मानक उत्तर भारतीय)",
    desc: "Basmati Rice, Atta Roti, Shahi Paneer, Dal Makhani, Aloo, Tamatar, Oil, Spices, Gulab Jamun, Water",
    items: ["rice", "atta", "paneer", "dal", "potato", "tomato", "oil", "spices", "sweets", "water"],
  },
  {
    id: "royal_marwadi",
    name: "Royal Rajputana Feast (शाही राजपूताना दावत)",
    desc: "Basmati, Atta, Ghee, Shahi Paneer, Dal, Aloo, Pyaz, Spices, Dry Fruits, Kaju Katli, Chaat, Mocktails, Water",
    items: ["rice", "atta", "maida", "paneer", "ghee", "dal", "potato", "onion", "oil", "spices", "dryfruits", "kajukatli", "chaat", "mocktails", "water"],
  },
  {
    id: "grand_punjabi",
    name: "Grand Punjabi Wedding (भव्य पंजाबी शादी)",
    desc: "Basmati, Atta, Maida (Naan), Shahi Paneer, Ghee, Dal Makhani, Pindi Chole, Matar, Spices, Ice Cream, Coffee, Chaat",
    items: ["rice", "atta", "maida", "paneer", "ghee", "dal", "chana", "matar", "oil", "spices", "sweets", "icecream", "chaat", "coffee", "water"],
  },
  {
    id: "royal_nonveg",
    name: "Royal Non-Veg Dawat (शाही नॉन-वेज दावत)",
    desc: "Butter Chicken, Mutton Rogan Josh, Dum Biryani, Naan, Paneer, Dal Makhani, Spices, Gulab Jamun, Cold Drinks",
    items: ["rice", "atta", "maida", "paneer", "dal", "chicken", "mutton", "biryani", "oil", "spices", "sweets", "mocktails", "water"],
  },
];

const CATEGORIES = [
  "All",
  "Grains & Roti",
  "Dairy & Paneer",
  "Vegetables",
  "Spices & Oil",
  "Sweets & Desserts",
  "Chaat & Drinks",
  "Non-Veg",
];

export default function FoodPlanner() {
  const [savedData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  });

  const [guests, setGuests] = useState(savedData.guests ?? 500);
  const [foodType, setFoodType] = useState(savedData.foodType ?? "Veg");
  const [wastage, setWastage] = useState(savedData.wastage ?? 10);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const defaultSelected = [
    "rice", "atta", "maida", "paneer", "ghee",
    "dal", "potato", "tomato", "onion",
    "oil", "spices", "sweets", "chaat", "water"
  ];

  const [selected, setSelected] = useState(savedData.selected ?? defaultSelected);

  const defaultRates = useMemo(() => {
    return Object.fromEntries(ALL_RECIPES.map(item => [item.id, item.rate]));
  }, []);

  const [rates, setRates] = useState(() => ({
    ...defaultRates,
    ...(savedData.rates || {})
  }));

  const [apiLoaded, setApiLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Connecting...");

  // Load from MongoDB
  useEffect(() => {
    let cancelled = false;

    async function loadFoodPlan() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Food plan load failed");
        const data = await response.json();

        if (cancelled) return;

        if (data.guests) setGuests(data.guests);
        if (data.foodType) setFoodType(data.foodType);
        if (data.wastage !== undefined) setWastage(data.wastage);
        if (Array.isArray(data.selected) && data.selected.length > 0) {
          setSelected(data.selected);
        }
        if (data.rates) {
          setRates(prev => ({
            ...prev,
            ...data.rates,
          }));
        }

        setSaveStatus("Synced with Milap Cloud");
      } catch (error) {
        if (!cancelled) {
          console.warn("Food plan local fallback:", error.message);
          setSaveStatus("Saved locally");
        }
      } finally {
        if (!cancelled) setApiLoaded(true);
      }
    }

    loadFoodPlan();
    return () => { cancelled = true; };
  }, []);

  // Sync to Local Storage and MongoDB
  useEffect(() => {
    if (!apiLoaded) return;

    const foodPlan = { guests, foodType, wastage, selected, rates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foodPlan));

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(foodPlan),
          signal: controller.signal
        });
        if (response.ok) {
          setSaveStatus("Auto-saved to Milap Cloud");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setSaveStatus("Saved locally (offline mode)");
        }
      }
    }, 800);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [apiLoaded, guests, foodType, wastage, selected, rates]);

  // Selected Calculated Items
  const items = useMemo(() => {
    return ALL_RECIPES
      .filter(item => selected.includes(item.id))
      .map(item => {
        const quantity =
          Math.ceil(guests * item.perGuest * (1 + wastage / 100) * 10) / 10;
        const currentRate = Number(rates[item.id] !== undefined ? rates[item.id] : item.rate);
        return {
          ...item,
          quantity,
          rateUsed: currentRate,
          cost: quantity * currentRate,
        };
      });
  }, [guests, selected, wastage, rates]);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.cost, 0), [items]);
  const perGuestCost = useMemo(() => (guests > 0 ? total / guests : 0), [total, guests]);

  const totalGroceryWeightKg = useMemo(() => {
    return items
      .filter(i => i.unit === "kg")
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const money = value =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  function changeFoodType(type) {
    setFoodType(type);
    setSelected(prev => {
      const vegItems = ALL_RECIPES.filter(item => item.veg).map(item => item.id);
      if (type === "Veg") return prev.filter(id => vegItems.includes(id));
      return [...new Set([...prev, "chicken"])];
    });
  }

  function toggleItem(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }

  function applyPreset(preset) {
    if (preset.id === "royal_nonveg" && foodType !== "Non-Veg") {
      setFoodType("Non-Veg");
    }
    setSelected(preset.items);
  }

  function selectAllFiltered(filteredList) {
    const ids = filteredList.map(i => i.id);
    setSelected(prev => [...new Set([...prev, ...ids])]);
  }

  function deselectAllFiltered(filteredList) {
    const ids = filteredList.map(i => i.id);
    setSelected(prev => prev.filter(id => !ids.includes(id)));
  }

  function resetRates() {
    setRates(defaultRates);
  }

  // ==========================================
  // PROFESSIONAL PDF SHOPPING LIST GENERATOR
  // ==========================================
  function downloadPdf() {
    setIsPdfGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;

      let y = 14;

      // Header decorative background banner
      doc.setFillColor(132, 45, 67); // #842d43 Royal Crimson
      doc.rect(0, 0, pageWidth, 28, "F");

      // Gold Accent line
      doc.setFillColor(212, 175, 55); // #d4af37 Metallic Gold
      doc.rect(0, 27, pageWidth, 1.5, "F");

      // Title & Branding
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("MILAP (MILAP) - WEDDING & EVENT MANAGEMENT", margin, 12);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Official Event Food Catering & Grocery Shopping Order", margin, 18);
      const dateStr = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      doc.text(`Generated: ${dateStr}`, pageWidth - margin, 18, { align: "right" });

      y = 35;

      // Summary Metric Cards
      const cardWidth = (contentWidth - 9) / 4;
      const cardHeight = 18;
      const summaryCards = [
        { label: "TOTAL GUESTS", value: `${guests} People` },
        { label: "CATERING MENU", value: foodType === "Veg" ? "Pure Veg" : "Veg & Non-Veg" },
        { label: "EXTRA BUFFER", value: `+${wastage}% Margin` },
        { label: "EST. BUDGET", value: `Rs. ${Math.round(total).toLocaleString("en-IN")}` },
      ];

      summaryCards.forEach((c, idx) => {
        const cx = margin + idx * (cardWidth + 3);
        doc.setFillColor(252, 248, 250);
        doc.setDrawColor(234, 218, 222);
        doc.setLineWidth(0.4);
        doc.roundedRect(cx, y, cardWidth, cardHeight, 2, 2, "FD");

        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(132, 45, 67);
        doc.text(c.label, cx + 3, y + 6);

        doc.setFontSize(10.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 20, 25);
        doc.text(c.value, cx + 3, y + 14);
      });

      y += cardHeight + 8;

      // Table Header Definition
      const cols = [
        { name: "#", width: 10, align: "center" },
        { name: "Item / Ingredient", width: 62, align: "left" },
        { name: "Category", width: 34, align: "left" },
        { name: "Required Qty", width: 28, align: "right" },
        { name: "Rate (Rs)", width: 22, align: "right" },
        { name: "Est. Cost (Rs)", width: 26, align: "right" },
      ];

      function drawTableHeader(curY) {
        doc.setFillColor(132, 45, 67);
        doc.rect(margin, curY, contentWidth, 8, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);

        let curX = margin;
        cols.forEach(c => {
          let textX = curX;
          if (c.align === "right") textX += c.width - 2;
          else if (c.align === "center") textX += c.width / 2;
          else textX += 2;
          doc.text(c.name, textX, curY + 5.5, { align: c.align });
          curX += c.width;
        });
        return curY + 8;
      }

      y = drawTableHeader(y);

      // Rows
      const rowHeight = 7.5;
      items.forEach((item, index) => {
        if (y + rowHeight > pageHeight - 38) {
          doc.addPage();
          y = 15;
          y = drawTableHeader(y);
        }

        if (index % 2 === 1) {
          doc.setFillColor(250, 246, 248);
          doc.rect(margin, y, contentWidth, rowHeight, "F");
        }

        doc.setDrawColor(240, 230, 233);
        doc.setLineWidth(0.2);
        doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(45, 45, 45);

        let curX = margin;
        const rowData = [
          { val: String(index + 1), align: "center", width: 10 },
          { val: item.name, align: "left", width: 62 },
          { val: item.category || "General", align: "left", width: 34 },
          { val: `${item.quantity} ${item.unit}`, align: "right", width: 28 },
          { val: `Rs ${rates[item.id] || item.rate}`, align: "right", width: 22 },
          { val: `Rs ${Math.round(item.cost).toLocaleString("en-IN")}`, align: "right", width: 26, bold: true },
        ];

        rowData.forEach(c => {
          if (c.bold) doc.setFont("helvetica", "bold");
          else doc.setFont("helvetica", "normal");

          let textX = curX;
          if (c.align === "right") textX += c.width - 2;
          else if (c.align === "center") textX += c.width / 2;
          else textX += 2;
          doc.text(c.val, textX, y + 5, { align: c.align });
          curX += c.width;
        });

        y += rowHeight;
      });

      // Grand Total Summary Box
      y += 2;
      doc.setFillColor(248, 232, 236);
      doc.rect(margin, y, contentWidth, 9, "F");
      doc.setDrawColor(132, 45, 67);
      doc.setLineWidth(0.5);
      doc.rect(margin, y, contentWidth, 9, "D");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(132, 45, 67);
      doc.text("GRAND ESTIMATED INGREDIENT TOTAL:", margin + 4, y + 6);
      doc.text(
        `Rs. ${Math.round(total).toLocaleString("en-IN")} (Rs. ${Math.round(perGuestCost)}/guest)`,
        margin + contentWidth - 4,
        y + 6,
        { align: "right" }
      );

      y += 13;

      // Caterer & Halwai Guidelines and Signature Block
      if (y + 26 > pageHeight - 16) {
        doc.addPage();
        y = 15;
      }

      doc.setFillColor(254, 252, 253);
      doc.setDrawColor(230, 215, 220);
      doc.roundedRect(margin, y, contentWidth, 23, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(132, 45, 67);
      doc.text("IMPORTANT CATERER / HALWAI GUIDELINES & SIGN-OFF:", margin + 3, y + 4.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80);
      doc.text("1. Rates reflect regional wholesale benchmarks. Actual APMC mandi rates may vary by +-5% to 10%.", margin + 3, y + 9);
      doc.text("2. Confirm portion sizes and raw ingredient quantities with the Head Halwai at least 48 hours in advance.", margin + 3, y + 13);
      doc.text("3. Budget excludes commercial LPG cylinders, halwai labor charges, crockery, and buffet setup.", margin + 3, y + 17);

      // Signatures
      const sigX = margin + contentWidth - 65;
      doc.line(sigX, y + 15, sigX + 60, y + 15);
      doc.text("Head Halwai / Caterer Signature & Stamp", sigX + 2, y + 19);

      // Page Footers across all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(220, 210, 215);
        doc.setLineWidth(0.3);
        doc.line(margin, pageHeight - 10, margin + contentWidth, pageHeight - 10);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(130, 130, 130);
        doc.text("Milap Wedding Platform  *  24/7 Dedicated Event Support Helpline: +91 98765 43210  *  www.milap.events", margin, pageHeight - 6);
        doc.text(`Page ${i} of ${totalPages}`, margin + contentWidth, pageHeight - 6, { align: "right" });
      }

      doc.save(`Milap-Wedding-Food-Shopping-List-${guests}-Guests.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
    } finally {
      setIsPdfGenerating(false);
    }
  }

  // Filtered dishes for selection
  const filteredRecipes = useMemo(() => {
    return ALL_RECIPES.filter(item => {
      // Veg / Non-Veg filter
      if (foodType === "Veg" && !item.veg) return false;
      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [foodType, selectedCategory, searchQuery]);

  return (
    <div className="food-planner">
      {/* Heading Banner */}
      <div className="food-heading">
        <img src={logoImg} alt="Milap" className="food-planner-logo" />
        <div style={{ flex: 1 }}>
          <div className="food-badge-strip">
            <span className="badge-pill">
              <Sparkles size={12} color="#f59e0b" /> Real-time Catering Calculator
            </span>
            <span className="badge-sync">{saveStatus}</span>
          </div>
          <h1>Wedding & Event Food Planner</h1>
          <p>Estimate bulk wedding catering ingredients, live counters, sweets & grocery costs accurately.</p>
        </div>
      </div>

      {/* Guest Count & Preference Card */}
      <section className="food-box">
        <div className="food-box-header">
          <h2><Users size={20} /> Event Scale & Dining Preferences</h2>
          <span className="food-helper">Configure guest count and catering type</span>
        </div>

        <div className="grid-2col">
          <div>
            <label htmlFor="guestCount">Total Invited Guests (मेहमानों की संख्या)</label>
            <div className="guest-input">
              <Users size={20} color="#842d43" />
              <input
                id="guestCount"
                type="number"
                min="1"
                max="100000"
                value={guests}
                onChange={e => setGuests(Math.max(1, Math.min(100000, Number(e.target.value) || 1)))}
              />
            </div>
            <div className="quick-guest-buttons">
              {[100, 250, 500, 750, 1000, 1500].map(cnt => (
                <button
                  key={cnt}
                  type="button"
                  className={guests === cnt ? "quick-chip active" : "quick-chip"}
                  onClick={() => setGuests(cnt)}
                >
                  {cnt}
                </button>
              ))}
              <button
                type="button"
                className="quick-chip"
                onClick={() => setGuests(prev => Math.min(100000, prev + 50))}
              >
                +50
              </button>
              <button
                type="button"
                className="quick-chip"
                onClick={() => setGuests(prev => Math.min(100000, prev + 100))}
              >
                +100
              </button>
            </div>
          </div>

          <div>
            <label>Catering Type (खान-पान प्रकार)</label>
            <div className="food-types">
              <button
                type="button"
                className={foodType === "Veg" ? "food-type active" : "food-type"}
                onClick={() => changeFoodType("Veg")}
              >
                🟢 Pure Vegetarian (शुद्ध शाकाहारी)
              </button>
              <button
                type="button"
                className={foodType === "Non-Veg" ? "food-type active" : "food-type"}
                onClick={() => changeFoodType("Non-Veg")}
              >
                🍗 Veg + Non-Veg Special (मांसाहारी सहित)
              </button>
            </div>

            <label htmlFor="wastage" style={{ marginTop: "14px" }}>
              Catering Extra Buffer: <strong>+{wastage}%</strong> (सुरक्षा मार्जिन)
            </label>
            <input
              id="wastage"
              type="range"
              min="0"
              max="25"
              step="5"
              value={wastage}
              onChange={e => setWastage(Number(e.target.value))}
            />
            <div className="wastage-indicator">
              <span>0% (Tight)</span>
              <span>10% (Recommended Standard)</span>
              <span>25% (High Contingency)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Preset Menus */}
      <section className="food-box">
        <div className="food-box-header">
          <h2><ChefHat size={20} /> Popular Wedding Preset Menus (रेडिमेड मेनू)</h2>
          <span className="food-helper">Click any preset to auto-load classic catering packages</span>
        </div>

        <div className="preset-grid">
          {PRESET_MENUS.map(preset => {
            const isMatch = preset.items.every(id => selected.includes(id)) && selected.length === preset.items.length;
            return (
              <div
                key={preset.id}
                className={isMatch ? "preset-card active" : "preset-card"}
                onClick={() => applyPreset(preset)}
              >
                <div className="preset-card-title">
                  <strong>{preset.name}</strong>
                  {isMatch && <span className="preset-badge">Active</span>}
                </div>
                <p>{preset.desc}</p>
                <span className="preset-apply-link">
                  Apply Menu <ArrowRight size={13} />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dish & Ingredient Selector */}
      <section className="food-box">
        <div className="food-box-header">
          <h2><Layers size={20} /> Select Dishes & Catering Items ({selected.length} Selected)</h2>
          <div className="filter-actions">
            <button
              type="button"
              className="outline-sm-btn"
              onClick={() => selectAllFiltered(filteredRecipes)}
            >
              Select All in View
            </button>
            <button
              type="button"
              className="outline-sm-btn"
              onClick={() => deselectAllFiltered(filteredRecipes)}
            >
              Deselect All in View
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              className={selectedCategory === cat ? "cat-tab active" : "cat-tab"}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="dish-search-bar">
          <Search size={16} color="#777" />
          <input
            type="text"
            placeholder="Search dish or ingredient (e.g., Paneer, Chawal, Gulab Jamun, Ghee)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className="clear-search-btn" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>

        {/* Dishes Grid */}
        <div className="dish-list">
          {filteredRecipes.map(item => {
            const isChecked = selected.includes(item.id);
            return (
              <label className={isChecked ? "dish-option selected" : "dish-option"} key={item.id}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(item.id)}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="dish-name-row">
                    <span className="dish-name">{item.name}</span>
                    <span className="dish-cat-pill">{item.category}</span>
                  </div>
                  <div className="dish-subtext">
                    Rate: ₹{rates[item.id] || item.rate} / {item.unit}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* Live Financial & Capacity Summary */}
      <section className="food-total">
        <div className="summary-left">
          <span className="summary-label">Estimated Raw Catering Ingredient Budget</span>
          <h2>{money(total)}</h2>
          <p>
            {money(perGuestCost)} per guest · {guests} guests · {selected.length} items selected
          </p>
          {totalGroceryWeightKg > 0 && (
            <div className="weight-badge">
              📦 Est. Dry & Dairy Grocery Weight: {Math.round(totalGroceryWeightKg)} kg ({ (totalGroceryWeightKg / 100).toFixed(1) } Quintals)
            </div>
          )}
        </div>

        <div className="summary-right">
          <button
            type="button"
            className="food-pdf-download-btn"
            onClick={downloadPdf}
            disabled={isPdfGenerating || items.length === 0}
          >
            <FileDown size={20} />
            <span>{isPdfGenerating ? "Generating PDF..." : "डाउनलोड शॉपिंग लिस्ट (PDF)"}</span>
          </button>
        </div>
      </section>

      {/* Detailed Shopping List Table with Editable Rates */}
      <section className="food-box">
        <div className="food-box-header">
          <h2><ShoppingBasket size={20} /> Detailed Shopping & Procurement List</h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="outline-sm-btn"
              onClick={resetRates}
              title="Reset all prices to standard regional market benchmark rates"
            >
              <RotateCcw size={13} /> Reset Standard Rates
            </button>
            <button
              type="button"
              className="primary-sm-btn"
              onClick={downloadPdf}
              disabled={isPdfGenerating || items.length === 0}
            >
              <FileDown size={14} /> Download PDF
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="empty-shopping-state">
            <ShoppingBasket size={44} color="#941b45" style={{ opacity: 0.5, margin: "0 auto 12px" }} />
            <h3>No Items Selected</h3>
            <p>Please select dishes from the categories above or choose a preset menu to view quantities.</p>
          </div>
        ) : (
          <div className="ingredient-table">
            <div className="ingredient-row ingredient-head">
              <span>Item / Ingredient</span>
              <span>Category</span>
              <span>Total Quantity</span>
              <span>Market Rate (₹)</span>
              <span style={{ textAlign: "right" }}>Estimated Cost</span>
            </div>
            {items.map(item => (
              <div className="ingredient-row" key={item.id}>
                <span className="item-name-cell">
                  <strong>{item.name}</strong>
                </span>
                <span className="item-cat-cell">{item.category}</span>
                <span className="item-qty-cell">
                  <span className="qty-highlight">{item.quantity}</span> {item.unit}
                </span>
                <div className="rate-input-cell">
                  <span>₹</span>
                  <input
                    aria-label={`${item.name} rate`}
                    type="number"
                    min="0"
                    value={rates[item.id] !== undefined ? rates[item.id] : item.rate}
                    onChange={e =>
                      setRates(prev => ({
                        ...prev,
                        [item.id]: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                  />
                  <span className="per-unit">/{item.unit}</span>
                </div>
                <strong className="item-cost-cell">{money(item.cost)}</strong>
              </div>
            ))}

            <div className="table-footer-total">
              <div>
                <strong>TOTAL ESTIMATED RAW MATERIAL:</strong>
                <span style={{ marginLeft: "10px", fontSize: "13px", color: "#666" }}>
                  ({items.length} items for {guests} guests with +{wastage}% buffer)
                </span>
              </div>
              <h3 style={{ margin: 0, color: "#842d43", fontSize: "20px" }}>{money(total)}</h3>
            </div>
          </div>
        )}

        <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            className="food-pdf-download-btn-bottom"
            onClick={downloadPdf}
            disabled={isPdfGenerating || items.length === 0}
          >
            <FileDown size={18} />
            <span>{isPdfGenerating ? "Generating PDF..." : "डाउनलोड शॉपिंग लिस्ट (PDF Download)"}</span>
          </button>
        </div>
      </section>

      {/* Guidelines & Disclaimers */}
      <div className="food-disclaimer-box">
        <h4><Info size={16} /> Important Catering & Halwai Guidelines</h4>
        <ul>
          <li>
            <strong>Preliminary Estimates:</strong> Yeh calculations standard North/Regional Indian wedding portion benchmarks par aadharit hain. Final quantities apne Chief Halwai / Catering Head se menu selection ke aadhar par zaroor verify karein.
          </li>
          <li>
            <strong>Excluded Charges:</strong> Is estimate mein kachhe maal (raw ingredients) ka kharch shamil hai. Commercial LPG gas cylinder, Halwai ki majdoori (labor fees), tent crockery, buffet counter decoration aur serving staff charges alag se calculate honge.
          </li>
          <li>
            <strong>Storage Guidelines:</strong> Taaza doodh, dahi aur paneer function date se 1 din pehle 2°C - 4°C cold refrigeration mein store karein.
          </li>
        </ul>
      </div>
    </div>
  );
}
