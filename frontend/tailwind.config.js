/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        hub: {
          navy: "#1A2C59",
          yellow: "#FFD700",
          "yellow-bar": "#F5C842",
          "blue-btn": "#368EE0",
          "light-bg": "#E8F4FC",
          "card-border": "#B8D4E8",
        },
        para: {
          teal: "#00ACD8",
          "teal-dark": "#0891B2",
          "teal-light": "#22D3EE",
          bg: "#F7FAFC",
          "bg-warm": "#F0F9FF",
          navy: "#0E7490",
          white: "#FFFFFF",
        },
      },
      backgroundImage: {
        "medical-pattern": "radial-gradient(circle at 20% 80%, rgba(0, 172, 216, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(14, 116, 144, 0.06) 0%, transparent 50%)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.45s ease-out forwards",
        slideIn: "slideIn 0.35s ease-out forwards",
        scaleIn: "scaleIn 0.35s ease-out forwards",
      },
    },
  },
  plugins: [],
};
