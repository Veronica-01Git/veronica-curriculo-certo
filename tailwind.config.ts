import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0A0A0B",
          900: "#111113",
          700: "#3A3A3F",
          500: "#6B6B72",
          300: "#B4B4BA",
          100: "#EDEDF0",
        },
        brand: {
          50: "#EEF4FF",
          100: "#DCE8FF",
          200: "#B3CDFF",
          300: "#80ACFF",
          400: "#4C86FF",
          500: "#2361FF",
          600: "#1548E0",
          700: "#1138B0",
          800: "#0E2C8A",
          900: "#0B2270",
        },
        approve: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10,10,11,0.04), 0 8px 24px -8px rgba(10,10,11,0.08)",
        card: "0 1px 1px rgba(10,10,11,0.03), 0 2px 12px -2px rgba(10,10,11,0.06)",
        lift: "0 20px 50px -20px rgba(35,97,255,0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 2.5s linear infinite",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(10,10,11,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,11,0.035) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
