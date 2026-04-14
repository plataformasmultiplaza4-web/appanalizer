import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#6366F1',
        'brand-light': '#EEF2FF',
        'brand-mid': '#818CF8',
        sidebar: '#1A1B2E',
        surface: '#FFFFFF',
        'bg-page': '#F4F5F7',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          "'Segoe UI'",
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}

export default config
