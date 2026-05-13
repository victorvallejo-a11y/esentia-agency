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
        cream:    '#FAFAF7',
        sand:     '#F3F3EE',
        dark:     '#111111',
        darker:   '#0A0A0A',
        teal:     '#0F766E',
        tealLight:'#5EEAD4',
        tealText: '#2DD4BF',
        textMain: '#1A1A1A',
        textSec:  '#64748B',
      },
      fontFamily: {
        inter:   ['var(--font-inter)', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'monospace'],
        barlow:  ['var(--font-barlow)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
