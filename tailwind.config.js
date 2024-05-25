/** @type {import("tailwindcss").Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}', './public/index.html'],
  darkMode: 'media',
  theme: {
    extend: {
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
