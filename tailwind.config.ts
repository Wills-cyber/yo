import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05080a",
          900: "#0a0f12",
          850: "#0e1518",
          800: "#131c20",
          700: "#1b262c",
        },
        volt: {
          300: "#d3ff7a",
          400: "#c1f84e",
          500: "#a8e61e",
          600: "#86c400",
        },
        mint: "#4ade80",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(184, 255, 60, 0.35)",
        card: "0 20px 60px -20px rgba(0,0,0,0.6)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 2.2s linear infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
