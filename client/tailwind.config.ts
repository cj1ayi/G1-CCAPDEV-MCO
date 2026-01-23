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
        primary: '#007036',
        'primary-dark': '#005c2d',
        'primary-light': '#00944a',
        'background-light': '#f2f4f3',
        'background-dark': '#0f0f0f',
        'surface-light': '#ffffff',
        'surface-dark': '#1a1a1a',
        'border-light': '#dae7e0',
        'border-dark': '#333333',
        'dlsu-gold': '#C1A624',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
