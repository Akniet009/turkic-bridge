import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#061826",
          navy: "#0A2540",
          blue: "#14487A",
          accent: "#00D4B2",
          accentHover: "#00B99B",
          gold: "#F59E0B",
          emerald: "#10B981",
        },
      },
    },
  },
  plugins: [],
};
export default config;
