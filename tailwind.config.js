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
    colors: {
      primary: "#090f0f",
      white: "#e9e9e9",
      black: "#131313",
      green: {
        50: "#f1fcf2",
        100: "#dff9e4",
        200: "#c1f1cb",
        300: "#90e5a2",
        400: "#59cf72",
        500: "#32b54e",
        600: "#228d39",
        700: "#207533",
        800: "#1e5d2c",
        900: "#1a4d26",
      },
      red: {
        50: "#ffefee",
        100: "#ffdcda",
        200: "#ffbfbb",
        300: "#ff928b",
        400: "#ff5549",
        500: "#ff2011",
        600: "#ff1000",
        700: "#e70f00",
        800: "#be0c00",
        900: "#1f0200",
      },
      gray: {
        50: "#f7f7f7",
        100: "#e3e3e3",
        200: "#c8c8c8",
        300: "#a4a4a4",
        400: "#808080",
        500: "#666666",
        600: "#515151",
        700: "#434343",
        800: "#383838",
        900: "#313131",
      },
      amber: {
        50: "#fff8ec",
        100: "#fff0d2",
        200: "#ffdca4",
        300: "#ffc26b",
        400: "#ff9d2f",
        500: "#ff7e07",
        600: "#f96100",
        700: "#cc4700",
        800: "#a33909",
        900: "#83310b",
      },
    },
    plugins: [],
  },
};
