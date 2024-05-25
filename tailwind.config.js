/** @type {import("tailwindcss").Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}', './public/index.html'],
  darkMode: 'media',
  theme: {
    extend: {
      keyframes: {
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'spin-slow': 'spin 1s linear infinite',
      },
      boxShadow: {
        custom: '0 2px 4px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  variants: {},
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.no-drag': {
          '-webkit-app-region': 'no-drag',
        },
      });
    }),
  ],
};
