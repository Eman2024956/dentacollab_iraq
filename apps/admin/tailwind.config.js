/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#101C38',
          cyan: '#1FB6D1',
          darkBg: '#040B18',
          darkCard: '#081426',
          darkBorder: '#19314F',
          lightBg: '#F7FAFC',
          lightBorder: '#E2E8F0',
        },
      },
    },
  },
  plugins: [],
};
