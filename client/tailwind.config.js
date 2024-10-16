/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens:{
      'sm': { 'max': '600px' }, 
      'md': { 'min': '600px', 'max': '1023px' }, // Tablet screens
      'lg': { 'min': '1024px' },  // Large screens and up
      'blmd':{'min': '600px','max': '721px' }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      keyframes:{
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}