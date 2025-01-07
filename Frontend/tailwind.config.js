/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        primary: '#8B5CF6',
        secondary: '#1F2937',
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgb(139 92 246 / 0.3), 0 0 20px rgb(139 92 246 / 0.2)' },
          '100%': { boxShadow: '0 0 10px rgb(139 92 246 / 0.5), 0 0 30px rgb(139 92 246 / 0.3)' },
        },
      },
    },
  },
  plugins: [],
}