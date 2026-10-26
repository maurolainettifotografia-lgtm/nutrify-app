/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nutri: {
          primary: '#10B981',       // Emerald green
          primaryDark: '#059669',
          primaryLight: '#D1FAE5',
          secondary: '#3B82F6',     // Blue
          secondaryLight: '#DBEAFE',
          accent: '#F59E0B',        // Amber
          surface: '#F8FAFC',
          surfaceCard: '#FFFFFF',
          textMain: '#0F172A',
          textMuted: '#64748B',
          borderLight: '#E2E8F0',
          protein: '#3B82F6',       // Blue for protein
          carbs: '#F59E0B',         // Amber for carbs
          fat: '#EF4444',           // Red/Rose for fat
        }
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
