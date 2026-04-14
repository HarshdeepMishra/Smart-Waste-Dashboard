/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-green': '#0B3D2E',
        'leaf-green': '#2E7D32',
        'mint': '#A5D6A7',
        'earth-brown': '#5D4037',
        'soft-beige': '#F1F8E9',
      },
    },
  },
  plugins: [],
};
