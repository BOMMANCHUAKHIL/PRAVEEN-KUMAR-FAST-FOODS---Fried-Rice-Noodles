/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'red-700': '#b91c1c',
        'red-600': '#dc2626',
        'yellow-400': '#facc15',
        'yellow-300': '#fcd34d',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: [],
};