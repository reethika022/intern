/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pulse: {
          primary: "#22C55E",
          secondary: "#f1f5f9",
          accent: "#84CC16",
          bg: "#ffffff",
          card: "#f8fafc",
          border: "#e2e8f0",
          text: "#1e293b",
          muted: "#64748b",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,197,94,.12), 0 18px 50px rgba(2,6,23,.45)",
      },
    },
  },
  plugins: [],
};
