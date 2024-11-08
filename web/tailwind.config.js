/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          // available options: https://daisyui.com/docs/themes/#-4
          // optional colors: https://daisyui.com/docs/colors/#-2
          primary: "#039BE5",
          "primary-content": "#FFFFFF",
          secondary: "#E9F8FF",
          accent: "#FFC700",
          neutral: "#000000",
          "base-100": "#ffffff",

          "--rounded-btn": "0.25rem",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
