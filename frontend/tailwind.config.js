/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FDFBF7",
          50: "#FDFBF7",
          100: "#F7F3EC",
          200: "#F0EBE1",
          300: "#E3D8CC",
          400: "#D2C4B3",
          500: "#C0AF9C",
          600: "#A89280",
        },
        charcoal: {
          DEFAULT: "#2B2927",
          light: "#4A4643",
          muted: "#8A817C",
        },
        nude: {
          DEFAULT: "#D2C4B3",
          light: "#E3D8CC",
          dark: "#B8A898",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Lora", "Georgia", "serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(3rem, 8vw, 7rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "clamp(2rem, 5vw, 4.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.015em" },
        ],
        "display-md": [
          "clamp(1.5rem, 3vw, 2.5rem)",
          { lineHeight: "1.2", letterSpacing: "-0.01em" },
        ],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        88: "22rem",
        100: "25rem",
        112: "28rem",
        128: "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
      },
      boxShadow: {
        nude: "0 4px 40px -8px rgba(43, 41, 39, 0.08)",
        "nude-lg": "0 12px 60px -12px rgba(43, 41, 39, 0.12)",
        "nude-xl": "0 24px 80px -16px rgba(43, 41, 39, 0.15)",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
        silk: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.19, 1, 0.22, 1) forwards",
        "fade-in": "fade-in 0.6s ease forwards",
        "slide-in-right":
          "slide-in-right 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards",
        "slide-out-right":
          "slide-out-right 0.4s cubic-bezier(0.95, 0.05, 0.795, 0.035) forwards",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
