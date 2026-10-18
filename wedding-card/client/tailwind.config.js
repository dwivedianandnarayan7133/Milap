/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Royal Indian Color Palette
        royal: {
          maroon: '#6B1224',
          'maroon-dark': '#4A0815',
          gold: '#D4AF37',
          'gold-light': '#F3E5AB',
          'gold-dark': '#AA7C11',
          crimson: '#8B0000',
          ivory: '#FFFDF9',
          cream: '#FDFBF7',
          terracotta: '#C85A32',
          peacock: '#005F73',
          'peacock-dark': '#003844',
          emerald: '#134E3F',
          rose: '#D9777F',
          midnight: '#1A1C29',
          parchment: '#F5EBE1',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        royal: ['"Cinzel"', '"Rozha One"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        hindi: ['"Rozha One"', '"Noto Serif Devanagari"', 'serif'],
        bengali: ['"Noto Serif Bengali"', 'serif'],
        gujarati: ['"Noto Serif Gujarati"', 'serif'],
        tamil: ['"Noto Serif Tamil"', 'serif'],
        telugu: ['"Noto Serif Telugu"', 'serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 4px 20px -2px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 10px 30px -4px rgba(212, 175, 55, 0.4)',
        'maroon': '0 4px 20px -2px rgba(107, 18, 36, 0.3)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #AA7C11 100%)',
        'maroon-gradient': 'linear-gradient(135deg, #6B1224 0%, #4A0815 100%)',
        'ivory-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #FDFBF7 100%)',
        'peacock-gradient': 'linear-gradient(135deg, #005F73 0%, #003844 100%)',
      },
    },
  },
  plugins: [],
}
