/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Ensure Tailwind scans your files
  ],
  theme: {
    extend: {
      // You can define font families or colors here later
      colors: {
        primary: "#6366f1", // This is indigo-500
        bghover: "#eef2ff", // This is indigo-50
        textgray: "#6b7280", // This is gray-500
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        archivo: ["Archivo", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      keyframes: {
        "dropdown-open": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "dropdown-close": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.95)" },
        },
      },
      animation: {
        "dropdown-in": "dropdown-open 200ms ease-out forwards",
        "dropdown-out": "dropdown-close 150ms ease-in forwards",
      },
    },
  },
  darkMode: "class", // Enables dark mode via a `.dark` class
  plugins: [require("tailwind-scrollbar")],
};
