/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#D9704A",
        espresso: "#4A2C2A",
        caramel: "#CD8F62",
        cream: "#FFF8F0",
        // Added for the onboarding/language screens (design/DESIGN.md) —
        // "ink" is that design's own "primary" token, renamed to avoid
        // colliding with this app's existing `primary` (the CTA orange),
        // since there it's a headline text color, not a button fill.
        ink: "#321716",
        muted: "#504443",
        panel: "#FBF2F0",
        dot: "#D4C3C1",
      },
    },
  },
  plugins: [],
}