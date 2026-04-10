/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'adogta-primary': '#4A728F',    
        'adogta-secondary': '#F4A26C',   
        'adogta-background': '#E6DCC8',  
        'adogta-white': '#FFFFFF',       
        'adogta-border': '#CBD5E1',      
      },
    },
  },
  plugins: [],
}