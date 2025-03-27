/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        secondary: '#5856D6',
        success: '#34C759',
        danger: '#FF3B30',
        warning: '#FF9500',
        background: '#F2F2F7',
        card: '#FFFFFF',
        text: '#000000',
        border: '#C6C6C8',
      },
      fontFamily: {
        sans: ['System', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

