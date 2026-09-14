import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--desktop-bg)",
        window: "var(--window-bg)",
        surface: "var(--surface-card)",
        "surface-glass": "var(--surface-glass)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        iris: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
          dark: "#4f46e5",
        },
        cyan: {
          DEFAULT: "#06b6d4",
          light: "#38bdf8",
        },
        border: "var(--border-subtle)",
        "border-glass": "var(--border-glass)",
        "muted-foreground": "var(--muted-foreground)",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      borderRadius: {
        window: "var(--radius-window)",
        card: "var(--radius-card)",
        pill: "var(--radius-pill)",
      },
    },
  },
  plugins: [],
};
export default config;
