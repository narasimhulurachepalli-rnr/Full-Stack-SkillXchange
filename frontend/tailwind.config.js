/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          indigo: '#6366F1',
          slate: '#64748B',
          teal: '#14B8A6',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444',
          darkBg: '#120E2E',
          lightBg: '#F8FAFC',
          cardLight: '#FFFFFF',
          cardDark: 'rgba(30, 27, 75, 0.8)',
          textDark: '#0F172A',
          textMuted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif']
      }
    },
  },
  plugins: [],
}
