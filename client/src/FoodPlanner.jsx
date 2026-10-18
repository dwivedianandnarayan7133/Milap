
import { useEffect, useMemo, useState } from "react";
import { Utensils, Users, IndianRupee, ShoppingBasket } from "lucide-react";
import logoImg from "./assets/logo.jpg";
import "./FoodPlanner.css";

const STORAGE_KEY = "shaadiManagerFoodPlanner";
const API_URL = "http://localhost:5000/api/food-plan";
const recipes = [
  { id: "rice", name: "Chawal", unit: "kg", perGuest: 0.08, rate: 60, veg: true },
  { id: "atta", name: "Aata (roti)", unit: "kg", perGuest: 0.10, rate: 40, veg: true },
  { id: "paneer", name: "Paneer", unit: "kg", perGuest: 0.05, rate: 360, veg: true },
  { id: "potato", name: "Aloo", unit: "kg", perGuest: 0.06, rate: 30, veg: true },
  { id: "tomato", name: "Tamatar", unit: "kg", perGuest: 0.025, rate: 40, veg: true },
  { id: "dal", name: "Dal", unit: "kg", perGuest: 0.025, rate: 120, veg: true },
  { id: "oil", name: "Tel", unit: "litre", perGuest: 0.015, rate: 150, veg: true },
  { id: "spices", name: "Masale (mixed)", unit: "kg", perGuest: 0.008, rate: 300, veg: true },
  { id: "sweets", name: "Mithai", unit: "kg", perGuest: 0.10, rate: 250, veg: true },
  { id: "chicken", name: "Chicken (boneless equivalent)", unit: "kg", perGuest: 0.18, rate: 260, veg: false },
];

export default function FoodPlanner() {
  const [savedData] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem("shaadiManagerFoodPlanner")
    ) || {};
  } catch {
    return {};
  }
});

const [guests, setGuests] = useState(savedData.guests ?? 500);
const [foodType, setFoodType] = useState(savedData.foodType ?? "Veg");
const [wastage, setWastage] = useState(savedData.wastage ?? 10);

const [selected, setSelected] = useState(
  savedData.selected ?? [
    "rice", "atta", "paneer", "potato", "tomato",
    "dal", "oil", "spices", "sweets"
  ]
);

const [rates, setRates] = useState(() => ({
  ...Object.fromEntries(recipes.map(item => [item.id, item.rate])),
  ...(savedData.rates || {})
}));


const [apiLoaded, setApiLoaded] = useState(false);
const [saveStatus, setSaveStatus] = useState("Loading...");

// Backend se Food Plan load karna
useEffect(() => {
  let cancelled = false;

  async function loadFoodPlan() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Food plan load failed");
      }

      const data = await response.json();

      if (cancelled) return;

      setGuests(data.guests ?? 500);
      setFoodType(data.foodType ?? "Veg");
      setWastage(data.wastage ?? 10);

      setSelected(
        data.selected ?? [
          "rice", "atta", "paneer", "potato",
          "tomato", "dal", "oil", "spices", "sweets"
        ]
      );

      setRates(prev => ({
        ...prev,
        ...(data.rates || {})
      }));

      setSaveStatus("Loaded from server");
    } catch (error) {
      if (!cancelled) {
        console.error("Food plan load error:", error);
        setSaveStatus("Using local data");
      }
    } finally {
      if (!cancelled) setApiLoaded(true);
    }
  }

  loadFoodPlan();

  return () => {
    cancelled = true;
  };
}, []);

// Changes ko Local Storage aur MongoDB mein save karna
useEffect(() => {
  if (!apiLoaded) return;

  const foodPlan = { guests, foodType, wastage, selected, rates };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(foodPlan));

  const controller = new AbortController();

  async function saveFoodPlan() {
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(foodPlan),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error("Food plan save failed");
      }

      setSaveStatus("Saved to MongoDB");
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Food plan save error:", error);
        setSaveStatus("Local copy saved; server save failed");
      }
    }
  }

  saveFoodPlan();

  return () => controller.abort();
}, [apiLoaded, guests, foodType, wastage, selected, rates]);


  const items = useMemo(() => {
    return recipes
      .filter(item => selected.includes(item.id))
      .map(item => {
        const quantity =
          Math.ceil(guests * item.perGuest * (1 + wastage / 100) * 10) / 10;
        return {
          ...item,
          quantity,
          cost: quantity * Number(rates[item.id] || 0),
        };
      });
  }, [guests, selected, wastage, rates]);

  const total = items.reduce((sum, item) => sum + item.cost, 0);
  const money = value =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  function changeFoodType(type) {
    setFoodType(type);
    setSelected(prev => {
      const vegItems = recipes.filter(item => item.veg).map(item => item.id);
      if (type === "Veg") return prev.filter(id => vegItems.includes(id));
      return [...new Set([...prev, "chicken"])];
    });
  }

  function toggleItem(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }

  function downloadList() {
    const content = [
      "MILAP - FOOD SHOPPING LIST",
      `Guests: ${guests}`,
      `Menu: ${foodType}`,
      `Wastage buffer: ${wastage}%`,
      "",
      ...items.map(item =>
        `${item.name}: ${item.quantity} ${item.unit} | Rate: Rs ${rates[item.id]} | Total: Rs ${Math.round(item.cost)}`
      ),
      "",
      `Estimated ingredient total: Rs ${Math.round(total)}`,
      "Note: Estimates only. Confirm quantities with your caterer."
    ].join("\n");

    const file = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shaadi-food-shopping-list.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="food-planner">
      <div className="food-heading">
        <img src={logoImg} alt="Milap" className="food-planner-logo" />
        <div>
          <h1>Food Planner</h1>
          <p>Menu, ingredients aur budget ek jagah manage karein.</p>
          <p className="food-note">{saveStatus}</p>
        </div>
      </div>

      <section className="food-box">
        <label htmlFor="guestCount">Total guests</label>
        <div className="guest-input">
          <Users size={20} />
          <input
            id="guestCount"
            type="number"
            min="1"
            max="100000"
            value={guests}
            onChange={e => setGuests(Math.max(1, Math.min(100000, Number(e.target.value) || 1)))}
          />
        </div>

        <label>Food preference</label>
        <div className="food-types">
          <button
            className={foodType === "Veg" ? "food-type active" : "food-type"}
            onClick={() => changeFoodType("Veg")}
          >🟢 Veg</button>
          <button
            className={foodType === "Non-Veg" ? "food-type active" : "food-type"}
            onClick={() => changeFoodType("Non-Veg")}
          >🍗 Non-Veg option</button>
        </div>

        <label htmlFor="wastage">Extra quantity buffer: {wastage}%</label>
        <input
          id="wastage"
          type="range"
          min="0"
          max="25"
          step="5"
          value={wastage}
          onChange={e => setWastage(Number(e.target.value))}
        />
      </section>

      <section className="food-box">
        <h2>Select your dishes</h2>
        <p className="food-note">Ingredients neeche diye gaye approximate per-guest estimates par based hain.</p>
        <div className="dish-list">
          {recipes.filter(item => foodType === "Non-Veg" || item.veg).map(item => (
            <label className="dish-option" key={item.id}>
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => toggleItem(item.id)}
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="food-total">
        <div>
          <span>Estimated ingredient cost</span>
          <h2>{money(total)}</h2>
          <p>{money(total / guests)} per guest · {guests} guests</p>
        </div>
        <IndianRupee size={30} />
      </section>

      <section className="food-box">
        <h2><ShoppingBasket size={20} /> Shopping list</h2>
        <div className="ingredient-table">
          <div className="ingredient-row ingredient-head">
            <span>Item</span><span>Quantity</span><span>Rate ₹</span><span>Cost</span>
          </div>
          {items.map(item => (
            <div className="ingredient-row" key={item.id}>
              <span>{item.name}</span>
              <span>{item.quantity} {item.unit}</span>
              <input
                aria-label={`${item.name} rate`}
                type="number"
                min="0"
                value={rates[item.id]}
                onChange={e => setRates(prev => ({
                  ...prev, [item.id]: Math.max(0, Number(e.target.value) || 0)
                }))}
              />
              <strong>{money(item.cost)}</strong>
            </div>
          ))}
        </div>
        <button className="food-download" onClick={downloadList}>
          Download Shopping List
        </button>
      </section>
      <p className="food-disclaimer">
        Important: Yeh preliminary estimate hai, guaranteed catering quantity nahi.
        Roti, rice, paneer aur meat ki actual requirement menu, portion size aur serving
        style ke hisaab se caterer se confirm karein. Budget mein labour, gas, transport,
        plates aur service charges shamil nahi hain.
      </p>
    </div>
  );
}
