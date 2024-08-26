/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'focus'],
      ringColor: ['focus'],
      ringOffsetColor: ['focus'],
      ringOpacity: ['focus'],
      ringWidth: ['focus'],
    },
  },
  plugins: [],
}