/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#8B9AAD',
      },
    },
  },
  
   plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
}