import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00944a',
        'primary-dark': '#00944a',
        'primary-light': '#00944a',

        // Light mode
        'background-light': '#f2f4f3',
        'surface-light': '#ffffff',
        'border-light': '#dae7e0',

        // Dark mode
        'background-dark': '#111111',
        'surface-dark': '#1c1c1c',
        'surface-darker': '#242424',
        'surface-input': '#2d2d2d',
        'border-dark': '#1f1f1f',
        'dlsu-gold': '#C1A624',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
} satisfies Config
