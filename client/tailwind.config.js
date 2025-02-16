/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'transparent_blue':"rgba(72, 84, 114, 0.315)",
        'transparent_tone':"rgba(36, 39, 53, 0.521)",
      },
      screens:{
      'sm': { 'max': '600px' }, 
      'md': { 'min': '600px', 'max': '1023px' }, // Tablet screens
      'lg': { 'min': '1024px' },  // Large screens and up
      'blmd':{'min': '600px','max': '721px' }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        slideRight: 'slideRight 0.5s  ease-out',
        slideLeft: 'slideRight 0.5s  ease-out forwards',
        'scale-up': 'scale-up 0.5s ease-out forwards',
      },
      keyframes:{
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)',
                    dispaly:'hidden'
                  },
        },
        'scale-up': {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      }
    },
  },
  plugins: [
  ],
}