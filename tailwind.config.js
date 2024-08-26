/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        reddish: {
          50: '#fff5f5',
          100: '#e11d48',
          200: '#fdb4b4',
          300: '#fb8989',
          400: '#f85d5d',
          500: '#f43232', // You can replace this with #9f1239 or any other red shades
          600: '#d30a0a',
          700: '#b20808',
          800: '#900606',
          900: '#700404',
        },
      },
    },
  },
  plugins: [],
}

