import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        brand: {
          dark: "#0B1120",
          navy: "#0F172A",
          blue: "#1E293B",
          accent: "#0D9488",
          accentHover: "#0F766E",
          gold: "#D97706",
          emerald: "#059669",
        },
      },
      boxShadow: {
        "2xs": "0 1px 2px 0 rgba(15, 23, 42, 0.03)",
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)",
        elevated: "0 10px 30px -10px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
