/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        accent: {
          DEFAULT: "#06B6D4",
          50: "#ECFEFF",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
        },
        slate: {
          850: "#151F32",
          900: "#0F172A",
          950: "#090D16",
        }
      },
    },
  },
  plugins: [],
};
