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
          teal: "#1f3d3f",
          tealDark: "#0f2a2c",
          gold: "#c9a86a",
          goldLight: "#e0c792",
          off: "#f5efe6"
        }
      },
      fontFamily: {
        heading: ["Playfair Display", "ui-serif", "Georgia", "Times New Roman", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"]
      }
    },
  },
  plugins: [],
}

