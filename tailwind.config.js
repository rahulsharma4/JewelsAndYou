/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#FFFDF9",     // Main background (Cream)
          cream: "#FFF9F0",     // Secondary background (Slightly warmer cream)
          gold: "#CB843C",      // Accent color (Orange-Gold from logo)
          goldLight: "#D19455", // Lighter accent
          dark: "#5E4834"       // Main text color (Dark Brown)
        }
      },
      fontFamily: {
        heading: ["Playfair Display", "ui-serif", "Georgia", "Times New Roman", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"]
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
