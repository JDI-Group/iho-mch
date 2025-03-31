import { heroui } from '@heroui/theme'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        merriweather: ['var(--font-merriweather)'],
        barlow: ['var(--font-barlow)'],
        spacex: ['spacex'],
      },
      backgroundImage: {
        dark: 'linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.40) 100%), linear-gradient(180deg, #666 0%, #000 100%)',
        light: 'linear-gradient(0deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.40) 100%), linear-gradient(180deg, #a6a6a6 0%, #fff 100%)',
        tag: 'linear-gradient(90deg, #0079D0 0%, #9E52D8 15%, #DA365C 50%, #D04901 100%)',
      },
    },
  },
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [heroui()],
}

export default config
