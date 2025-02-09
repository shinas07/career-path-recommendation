/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: '#0B1120', // Deep blue-black
          'background-light': '#1A2333',
        },
        backgroundImage: {
          'dot-pattern': `radial-gradient(
            circle at center,
            #ffffff 0.5px,
            transparent 0.5px
          )`,
        },
        backgroundSize: {
          'dot-pattern': '24px 24px',
        },
      },
    },
    plugins: [],
  }