/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        itim: ['Itim-Regular'],
      },
      colors: {
        themeMain: '#FF8770',
        themeBg: '#fde1da',
        themeText: '#362013',
        themeBtn: '#FFBA93',
        themeBtnPressed: '#c59071',        
        themeShadow: '#fa6b5e46',
        themeShadowLight: '#fd8479c8',
        themeInput: '#fff4f3',
        themeActive: '#FFBA93',
        success: '#6cc594' ,
        danger:'#e2514c'
      },
    },
  },
  plugins: [],
};
