/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#111827", // slate-900
          accent: "#f59e0b", // amber-500 for highlights
        }
      }
    },
  },
  plugins: [],
}
