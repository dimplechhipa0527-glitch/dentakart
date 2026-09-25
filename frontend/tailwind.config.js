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
        dentakart: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Primary Teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        navy: {
          800: '#0a192f',
          900: '#030d1a',
          950: '#02070f'
        },
        coral: {
          500: '#ff6b6b',
          600: '#fa5252'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(20, 184, 166, 0.3)',
        'glow-lg': '0 0 35px -5px rgba(20, 184, 166, 0.4)',
        'premium': '0 20px 40px -15px rgba(0,0,0,0.07), 0 0 1px 1px rgba(0,0,0,0.05)'
      }
    },
  },
  plugins: [],
}
