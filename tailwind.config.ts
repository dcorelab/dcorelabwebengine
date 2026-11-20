import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07040F",
        void: "#0D0820",
        plum: "#1A1033",
        royal: "#7C3AED",
        violet: "#8B5CF6",
        lilac: "#C4B5FD",
        orchid: "#D946EF",
        champagne: "#E6C36A",
        mist: "#F6F3FF",
        muted: "#A79FC4",
        "text-dark": "#E9E5F5",
        "text-light": "#1A1033",
      },
      borderRadius: { "4xl": "28px" },
      boxShadow: { glow: "0 18px 60px rgba(124,58,237,.22)" },
    },
  },
  plugins: [],
};

export default config;
