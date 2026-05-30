import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    borderRadius: {
      none: "0",
      DEFAULT: "0",
      sm: "0",
      md: "0",
      lg: "0",
      xl: "0",
      "2xl": "0",
      "3xl": "0",
      full: "0",
    },
    extend: {
      colors: {
        cream: "#F5F0E8",
        ink: "#0A0A0A",
        accent: "#FF3B00",
        muted: "#888580",
        background: "#0A0A0A",
        foreground: "#F5F0E8",
        "accent-indigo": "#FF3B00",
        "accent-violet": "#CC2F00",
        ring: "#FF3B00",
        secondary: {
          DEFAULT: "#1a1a1a",
          foreground: "#F5F0E8",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        serif: ["var(--font-serif)", "serif"],
      },
      fontSize: {
        hero: "clamp(80px, 14vw, 180px)",
        display: "clamp(48px, 7vw, 96px)",
        mega: "clamp(120px, 20vw, 280px)",
      },
      maxWidth: {
        site: "1440px",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "slide-up": "slideUp 0.4s ease-out forwards",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(-33.333%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
