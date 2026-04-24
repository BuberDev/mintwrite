import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          teal: '#00D4AA',
          purple: '#A855F7',
          blue: '#3B82F6',
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        brand: {
          50:  'hsl(var(--accent) / <alpha-value>)',
          100: 'hsl(var(--accent) / <alpha-value>)',
          200: 'hsl(var(--accent-foreground) / <alpha-value>)',
          300: 'hsl(var(--primary) / <alpha-value>)',
          400: 'hsl(var(--primary) / <alpha-value>)',
          500: 'hsl(var(--primary) / <alpha-value>)', // primary accent amber
          600: 'hsl(var(--primary) / <alpha-value>)',
          700: 'hsl(var(--accent-foreground) / <alpha-value>)',
          800: 'hsl(var(--accent-foreground) / <alpha-value>)',
          900: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        dark: {
          950: 'hsl(var(--background) / <alpha-value>)',
          900: 'hsl(var(--background) / <alpha-value>)', // page background
          800: 'hsl(var(--card) / <alpha-value>)', // card background
          700: 'hsl(var(--muted) / <alpha-value>)', // elevated card
          600: 'hsl(var(--border) / <alpha-value>)', // border/subtle
          500: 'hsl(var(--muted-foreground) / <alpha-value>)', 
          400: 'hsl(var(--muted-foreground) / <alpha-value>)', 
          300: 'hsl(var(--muted-foreground) / <alpha-value>)', 
          200: 'hsl(var(--foreground) / <alpha-value>)', 
          100: 'hsl(var(--foreground) / <alpha-value>)', 
          50:  'hsl(var(--foreground) / <alpha-value>)', 
        },
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
