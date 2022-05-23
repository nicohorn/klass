const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        img1: "url('/boxfuncional.jpg')",
        img2: "url('/mesitaluzflotante.jpg')",
        img3: "url('/mesitaluzzinnia.jpg')",
        img4: "url('/respaldarsimple.jpg')",
        img5: "url('/respaldarplus.jpg')",
      },
    },
  },
  plugins: [],
};
