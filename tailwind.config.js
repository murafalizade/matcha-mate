/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#D9704A",
        espresso: "#4A2C2A",
        caramel: "#E8B776",
        cream: "#FFF8F0",
      },
    },
  },
  plugins: [],
}