/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0b1020",
        surface: "#10182b",
        panel: "rgba(255,255,255,0.08)",
        primary: "#46c7d8",
        secondary: "#7c8cff",
        accent: "#7ef0b8",
      },
      boxShadow: {
        glass: "0 10px 30px rgba(15, 23, 42, 0.24)",
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(255,255,255,.09) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
