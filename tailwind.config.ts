import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef6ff',
          100: '#d3e3ff',
          200: '#a3c9ff',
          500: '#0078d4',
          600: '#005faa',
          700: '#004883'
        },
        surface: {
          base: '#f8f9ff',
          low: '#f1f3fc',
          DEFAULT: '#ebeef6',
          high: '#e6e8f0',
          card: '#ffffff'
        },
        slate: {
          950: '#181c22',
          900: '#2d3137',
          700: '#404752',
          600: '#52606b',
          500: '#717783',
          300: '#c0c7d4',
          200: '#e0e2ea',
          100: '#eef0f9',
          50: '#f8f9ff'
        }
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0, 0, 0, 0.05)'
      }
    }
  },
  plugins: []
};

export default config;
