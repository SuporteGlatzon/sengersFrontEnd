/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d4a46',
        'dark-primary': '#0D3E3A',
        secondary: '#ee8e30',
        gradient: '#00413D',
      },
      width: {
        92: '92%',
      },
    },
  },
  plugins: [],
};
