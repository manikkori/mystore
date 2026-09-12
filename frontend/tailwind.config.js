/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf8f9",   
          100: "#fbe8ec",  
          200: "#f7cfd7",
          300: "#f1aab6",
          400: "#ea7c8f",
          500: "#e0536c",
          600: "#cb3550",
          700: "#a9273f",
          800: "#8d2337",
          900: "#4a0f1b", 
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'float': '0 20px 40px -10px rgba(74, 15, 27, 0.15)',
        'card': '0 4px 20px -2px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
};
