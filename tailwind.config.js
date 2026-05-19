/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    
    extend: {
      screens: {
        'md2': '872px'
      },
      fontSize: {
        'title': ['clamp(3rem, 14vw, 9rem)'],
        'heading-1': ['clamp(2.5rem, 6.5vw, 10rem)'],
        'heading-2': ['clamp(2.4rem, 8vw, 10rem)'],
        'heading-3': ['clamp(2rem, 5vw, 2.75rem)'], 
        'special': ['clamp(2rem, 4vw, 3.25rem)'],
        'works-title': ['clamp(1.25rem, 2vw, 1.5rem)'],
        'body-1': ['clamp(1.1rem, 2vw, 1.3rem)'], 
        'body-2': ['clamp(1rem, 1.5vw, 1.5rem)'],
        'body-3': '1.1rem',
        'body-4': ['clamp(0.75rem, 3vw, 1rem)'],
      },
      letterSpacing: {
        'headings': '-0.03em'
      },
      fontFamily: {
        'general': ['GeneralSans-Variable', 'sans-serif'],
        'grotesk': ['CabinetGrotesk-Variable', 'sans-serif'],
      },
      colors: {
        transparent: 'transparent',

        // Neutral / Primary
        'primary-100': '#FAFAFA',
        'primary-200': '#F2F2F2',
        'primary-300': '#E4E4E7',
        'primary-400': '#D4D4D8',

        // Secondary / Electric Blue
        'secondary-100': '#EEF0FF',
        'secondary-200': '#D7DBFF',
        'secondary-300': '#B3BAFF',
        'secondary-400': '#8D97FF',
        'secondary-500': '#5C69FF',
        'secondary-600': '#2F3EFF',
        'secondary-700': '#1014FF',

        // Accent / Dark
        'accent-100': '#4B4B57',
        'accent-200': '#2A2A35',
        'accent-300': '#1A1A22',
        'accent-400': '#0E0E0C',
      }
    }
  },
  plugins: [],
}