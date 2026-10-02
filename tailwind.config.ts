import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/screens/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        chaos: {
          void: "#090310",
          bg: "#12091F",
          surface: "#1B0F2E",
          card: "#201338",
          cardHover: "#2B1A4B",
          cardBorder: "rgba(168, 85, 247, 0.25)",
          red: {
            DEFAULT: "#E11D48",
            glow: "#FF1F4B",
            dark: "#9F1239",
            gradientStart: "#FF1F4B",
            gradientEnd: "#B91C1C",
          },
          gold: {
            DEFAULT: "#F59E0B",
            glow: "#FBBF24",
            light: "#FDE68A",
            dark: "#B45309",
          },
          blue: {
            DEFAULT: "#00D2FF",
            glow: "#38BDF8",
            border: "#0284C7",
          },
          magenta: {
            DEFAULT: "#EC4899",
            glow: "#F472B6",
            dark: "#BE185D",
          },
          purple: {
            DEFAULT: "#A855F7",
            glow: "#C084FC",
            dark: "#7E22CE",
          },
        },
      },
      fontFamily: {
        display: ["Kanit", "Outfit", "sans-serif"],
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        "chaos-red": "0 8px 30px rgba(225, 29, 72, 0.45)",
        "chaos-gold": "0 0 25px rgba(245, 158, 11, 0.4)",
        "neon-blue": "0 0 25px rgba(0, 210, 255, 0.55)",
        "neon-magenta": "0 0 25px rgba(236, 72, 153, 0.5)",
        "neon-purple": "0 0 25px rgba(168, 85, 247, 0.45)",
        "card-glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-subtle": "pulseSubtle 2s infinite ease-in-out",
        "shake-box": "shakeBox 0.5s ease-in-out infinite",
        "burst-light": "burstLight 1s ease-out forwards",
        "float-card": "floatCard 3s ease-in-out infinite",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        shakeBox: {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "20%": { transform: "translateX(-4px) rotate(-2deg)" },
          "40%": { transform: "translateX(4px) rotate(2deg)" },
          "60%": { transform: "translateX(-3px) rotate(-1deg)" },
          "80%": { transform: "translateX(3px) rotate(1deg)" },
        },
        burstLight: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        floatCard: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
