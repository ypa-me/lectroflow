import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        ppmori: ['var(--font-ppmori)', 'sans-serif'],
        jetbrains: ['var(--font-jetbrains)', 'monospace'],
        libre:['var(--font-Libre)', 'serif'],
        hand:['var(--font-Hand)', 'cursive'],
      },
    },
  },
  plugins: [
    
  ],
};
export default config;