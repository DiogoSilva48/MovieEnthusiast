/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        customBlueTitle: '#386071',
        customBlueTable: '#0B749B',
        customBlueTableText: '#536B7A',
        customBlueButtonActive: '#00BAFF',
      },
    },
  },
  plugins: [],
};
