/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#38a5f6',
          500: '#0e87eb',
          600: '#026bc9',
          700: '#0355a3',
          800: '#074885',
          900: '#0b3d6f',
          950: '#082749',
        },
        readiness: {
          ready: '#10b981',
          'ready-light': '#ecfdf5',
          'ready-border': '#a7f3d0',
          degraded: '#f59e0b',
          'degraded-light': '#fffbeb',
          'degraded-border': '#fde68a',
          critical: '#ef4444',
          'critical-light': '#fef2f2',
          'critical-border': '#fecaca',
          maintenance: '#8b5cf6',
          'maintenance-light': '#f5f3ff',
          'maintenance-border': '#ddd6fe',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace'
        ]
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 20px -4px rgba(0, 0, 0, 0.08), 0 3px 6px -2px rgba(0, 0, 0, 0.03)',
        'popover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}

