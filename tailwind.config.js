/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        lightmodegray: "#f6f6f6", // for light mode
        darkmodegray: "#171717", // for dark mode
      },
    },
  },
  plugins: [],
};

// colors: {
//   primary: "#030014",
//   secondary: "#151312",
//   light: {
//     100: "#D6C7FF",
//     200: "#A8B5DB",
//     300: "#9CA4AB",
//   },
//   dark: {
//     100: "#221F3D",
//     200: "#0F0D23",
//   },
//   accent: "#AB8BFF",
// },
