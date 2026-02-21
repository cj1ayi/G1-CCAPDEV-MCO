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

        // Dark mode - better hierarchy
        'background-dark': '#0a0e11', 
        'surface-dark': '#1a1a1b',         
        'surface-darker': '#272729',       
        'surface-input': '#3a3a3c',        
        'border-dark': '#404040',          
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
  plugins: [],
} satisfies Config
