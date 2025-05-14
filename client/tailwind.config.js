/** @type {import('tailwindcss').Config} */
const colors = require('./config/tailwind/colors');

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        itim: ['Itim-Regular'],
      },
      colors,
    },
  },
  plugins: [],
};
