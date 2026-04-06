/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // NexusQuant terminal color palette
        terminal: {
          bg:        "#0a0e1a",   // Deep navy — primary background
          surface:   "#0f1629",   // Slightly lighter surface
          panel:     "#141e35",   // Panel backgrounds
          border:    "#1e2d4f",   // Subtle borders
          accent:    "#00d4ff",   // Cyan accent (Bloomberg-inspired)
          green:     "#00e676",   // Positive / buy
          red:       "#ff1744",   // Negative / sell
          amber:     "#ffab00",   // Warning / neutral
          text:      "#e8eaf6",   // Primary text
          muted:     "#546e8a",   // Secondary text
          highlight: "#1a2a4a",   // Hover highlight
        },
      },
      fontFamily: {
        mono:  ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        sans:  ["'Inter'", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-fast": "pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "blink":      "blink 1s step-end infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
