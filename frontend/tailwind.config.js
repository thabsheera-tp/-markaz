/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        markaz: {
          blue: {
            DEFAULT: '#0a2e4a',
            dark: '#061c2e',
            light: '#164a73',
            50: '#f0f7fc',
            100: '#dcebf6',
            900: '#071d2f',
          },
          green: {
            DEFAULT: '#2d8b46',
            dark: '#1e6331',
            light: '#3ea85c',
            50: '#f0f9f3',
            100: '#dcf2e3',
          },
          red: {
            DEFAULT: '#c0392b',
            dark: '#962d22',
            light: '#d9534f',
            50: '#fdf2f2',
            100: '#fbe2e2',
          },
          gold: {
            DEFAULT: '#c59b27',
            light: '#e6be53',
            dark: '#997314',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['Amiri', 'Traditional Arabic', 'serif'],
      }
    },
  },
  plugins: [],
}
