import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Design token colors
      colors: {
        // Primary - amber/orange for CTAs and key highlights
        primary: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        // Accent - indigo/violet for secondary CTAs and gradients
        accent: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        // Success - emerald for streaks and completed states
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        // Background soft colors
        "bg-soft": "#f8fafc", // slate-50
        "bg-muted": "#f1f5f9", // slate-100
        // Border soft colors
        "border-soft": "#e2e8f0", // slate-200
        "border-muted": "#cbd5e1", // slate-300
      },
      // Border radius tokens
      borderRadius: {
        card: "1.5rem", // 24px - outer cards/sections (3xl)
        inner: "1rem", // 16px - nested cards (2xl)
        button: "9999px", // full - buttons
        chip: "9999px", // full - badges/chips
      },
      // Box shadow tokens
      boxShadow: {
        soft: "0 1px 2px 0 rgb(15 23 42 / 0.05)", // shadow-sm equivalent
        elevated: "0 4px 6px -1px rgb(15 23 42 / 0.1), 0 2px 4px -2px rgb(15 23 42 / 0.1)", // shadow-md equivalent
        card: "0 1px 3px 0 rgb(15 23 42 / 0.1), 0 1px 2px -1px rgb(15 23 42 / 0.1)",
        "card-hover": "0 10px 15px -3px rgb(15 23 42 / 0.1), 0 4px 6px -4px rgb(15 23 42 / 0.1)",
      },
      // Typography scale
      fontSize: {
        "page-title": ["1.875rem", { lineHeight: "2.25rem", fontWeight: "600" }], // text-3xl font-semibold
        "section-title": ["1.125rem", { lineHeight: "1.75rem", fontWeight: "600" }], // text-lg font-semibold
        "card-title": ["1rem", { lineHeight: "1.5rem", fontWeight: "600" }], // text-base font-semibold
        body: ["0.875rem", { lineHeight: "1.25rem" }], // text-sm
        meta: ["0.75rem", { lineHeight: "1rem" }], // text-xs
        chip: ["0.6875rem", { lineHeight: "1rem", fontWeight: "600" }], // 11px
      },
      // Animation for micro-interactions
      keyframes: {
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "check-bounce": {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "scale-in": "scale-in 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "check-bounce": "check-bounce 0.3s ease-out",
      },
      // Gradient backgrounds (as background images)
      backgroundImage: {
        "gradient-hero": "linear-gradient(to right, #f59e0b, #f43f5e, #6366f1)", // amber-rose-indigo
        "gradient-secondary": "linear-gradient(to right, #6366f1, #8b5cf6)", // indigo-violet
        "gradient-badge": "linear-gradient(to right, #f59e0b, #6366f1)", // amber-indigo
        "gradient-success": "linear-gradient(to right, #10b981, #14b8a6)", // emerald-teal
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
