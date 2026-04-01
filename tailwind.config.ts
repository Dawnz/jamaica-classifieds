import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Jamaican palette
        jm: {
          green:      '#1A7A3C',
          'green-dark': '#115529',
          'green-light': '#E8F5ED',
          gold:       '#F7C948',
          'gold-dark': '#C9961E',
          black:      '#111111',
        },
        // Semantic aliases
        primary:   '#1A7A3C',
        secondary: '#F7C948',
        accent:    '#C9961E',
        muted:     '#6B7280',
        subtle:    '#F4F4F2',
        border:    '#E5E5E0',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
