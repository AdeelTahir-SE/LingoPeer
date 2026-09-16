/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./App.tsx"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#5B52F9",
          primaryHover: "#4A40EE",
          dark: "#0F172A",
          muted: "#64748B",
          border: "#E2E8F0",
          bgLight: "#F8FAFC",
        },
      },
    },
  },
  plugins: [],
}