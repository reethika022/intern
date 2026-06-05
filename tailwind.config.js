/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pulse: {
          primary: "#22C55E",
          secondary: "#0F172A",
          accent: "#84CC16",
          bg: "#020617",
          card: "#0F172A",
          border: "#1E293B",
          text: "#F8FAFC",
          muted: "#94A3B8",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,197,94,.12), 0 18px 50px rgba(2,6,23,.45)",
      },
    },
  },
  plugins: [],
};
