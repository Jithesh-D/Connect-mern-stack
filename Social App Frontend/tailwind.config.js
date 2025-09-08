/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        dark: "#1a1a1a",
        light: "#ffffff",
      },
      textColor: {
        dark: "#ffffff",
        light: "#000000",
      },
    },
  },
  plugins: [],
};
