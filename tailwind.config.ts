import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)", void: "var(--void)", plum: "var(--plum)", royal: "var(--royal)",
        violet: "var(--violet)", lilac: "var(--lilac)", orchid: "var(--orchid)", gold: "var(--gold)",
        white: "var(--white)", mist: "var(--mist)", "text-dark": "var(--text-dark)",
        muted: "var(--muted)", "text-light": "var(--text-light)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"], body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: { glow: "0 12px 40px rgb(124 58 237 / 30%)" },
      borderRadius: { "4xl": "2rem" },
    },
  },
  plugins: [],
};
export default config;
