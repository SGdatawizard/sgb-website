/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'sg-dark': '#02393A',
        'sg-amber': '#FFAE55',
        'sg-amber-light': '#fff5e6',
        'sg-amber-dark': '#b87520',
        'sg-dark-light': '#e6f0f0',
        'sg-dark-xlight': '#f2f8f8',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'baskerville': ['Libre Baskerville', 'serif'],
        'opensans': ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
