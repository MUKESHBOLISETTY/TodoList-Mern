/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '5': '5px',
        '10': '10px',
        '20': '20px'
      },
      width: {
        '30%': '30%',
        '45%': '45%',
        '90%': '90%',
        '95%': '95%',
      },
      height: {
        '90%': '90%',
        '95%': '95%',
      },
      fontFamily: {
        popinThin: ['Poppins', 'sans-serif'],
        notoSans: ['Noto Sans', 'sans-serif'],
        kaushan: ["Kaushan Script", 'cursive'],
        comicnue: ["Comic Neue", 'cursive']
      },
      backgroundColor: {
        customPink : '#f36a71'
      },
    },
  },
  plugins: [],
}