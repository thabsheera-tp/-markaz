/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        markaz: {
          blue: {
            DEFAULT: '#0a2e4a',
            dark: '#061a2b',
            deep: '#04111d',
            light: '#144c77',
            50: '#f4f8fb',
            100: '#e5f0f8',
            200: '#cce1f1',
            900: '#061726',
          },
          green: {
            DEFAULT: '#059669',
            dark: '#047857',
            light: '#10b981',
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
          },
          red: {
            DEFAULT: '#dc2626',
            dark: '#b91c1c',
            light: '#ef4444',
            50: '#fef2f2',
            100: '#fee2e2',
          },
          gold: {
            DEFAULT: '#d97706',
            light: '#f59e0b',
            dark: '#b45309',
          }
        }
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(10, 46, 74, 0.05), 0 2px 6px -1px rgba(10, 46, 74, 0.03)',
        'card-hover': '0 16px 36px -4px rgba(10, 46, 74, 0.10), 0 6px 16px -2px rgba(10, 46, 74, 0.04)',
        'glow-emerald': '0 10px 25px -3px rgba(5, 150, 105, 0.25)',
        'glow-blue': '0 10px 25px -3px rgba(10, 46, 74, 0.25)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['var(--font-amiri)', 'Traditional Arabic', 'serif'],
      }
    },
  },
  plugins: [],
}
