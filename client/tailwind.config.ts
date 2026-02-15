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
        
        // Light mode
        'background-light': '#f2f4f3',
        'surface-light': '#ffffff',
        'border-light': '#dae7e0',
        
        'background-dark': '#030303',
        'surface-dark': '#1a1a1b',
        'surface-darker': '#0d0d0e',
        'surface-input': '#272729',
        'border-dark': '#343536',         
        
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
