/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'adogta-primary': '#78350F',        
        'adogta-secondary': '#F59E0B',      
        'adogta-background': '#FEF3C7',     
        'adogta-white': '#FFFFFF',          
        'adogta-border': '#FDE68A',         
        'adogta-notification': '#E8F3F0',   
        'adogta-error': '#FEF2F0',          
      },
    },
  },
  plugins: [],
}
