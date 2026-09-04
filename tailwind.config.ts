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
        background: "#0D0D0D",
        surface: "#1A1A1A",
        accent: "#C6FF33",
        muted: "#888888",
        border: "#2A2A2A",
        subtle: "#111111",
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        general: ["var(--font-general)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        apple: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"SF Pro"',
          "system-ui",
          '"Helvetica Neue"',
          "sans-serif",
        ],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px)" },
          "40%, 80%": { transform: "translateX(6px)" },
        },
        scrollHint: {
          "0%, 100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(6px)", opacity: "0.4" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        marqueeSlow: "marquee 40s linear infinite",
        fadeUp: "fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) both",
        fadeIn: "fadeIn 0.4s ease both",
        shake: "shake 0.4s ease",
        scrollHint: "scrollHint 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
