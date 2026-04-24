import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#e6fff9',
          100: '#b3ffee',
          200: '#66ffe0',
          300: '#1affd0',
          400: '#00e8b8',
          500: '#00D4AA', // primary accent teal
          600: '#00a882',
          700: '#007d60',
          800: '#00533f',
          900: '#002a1f',
        },
        dark: {
          950: '#040810',
          900: '#080f17', // page background
          800: '#0d1520', // card background
          700: '#131e2b', // elevated card
          600: '#1a2737', // border/subtle
          500: '#3d5068', // muted elements (shifted from 400)
          400: '#6b8099', // placeholder text (shifted from 300)
          300: '#9ab0c5', // secondary text (shifted from 200)
          200: '#c8d8e6', // body text (shifted from 100)
          100: '#e8f0f6', // primary text (shifted from 50)
          50:  '#f8fafc', // brightest
        },
        accent: {
          teal: '#00D4AA',
          purple: '#A855F7',
          blue: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [],
}

export default config
