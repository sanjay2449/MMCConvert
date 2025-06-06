// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // adjust based on your file structure
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar'), // <-- Add this line
  ],
}
