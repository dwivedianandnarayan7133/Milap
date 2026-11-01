const isProd = import.meta.env.PROD;

export const API_BASE =
  import.meta.env.VITE_API_URL ||
  (isProd ? "https://milap-backend-bod0.onrender.com" : "http://localhost:5000");

export const CARD_STUDIO_URL =
  import.meta.env.VITE_CARD_STUDIO_URL ||
  (isProd ? "/studio" : "http://localhost:5174");

