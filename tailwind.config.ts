import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // breakpoints
    screens: {
      xsm: { max: "599px" },
      // => @media (max-width: 599px) { ... }
      sm: "600px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "992px",
      // => @media (min-width: 1024px) { ... }

      xl: "1200px",
      // => @media (min-width: 1280px) { ... }
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        flower: "url('/bg-flower-image.webp')",
      },
      animation: {
        widthGrow: "widthGrow 0.5s ease-in-out forwards",
        widthShrink: "widthShrink 0.5s ease-in-out forwards",
        filterShow: "filterShow 0.3s ease-in-out forwards",
        filterHide: "filterHide 0.3s ease-in-out forwards",
        cartShow: "cartShow 0.3s ease-in-out forwards",
        cartHide: "cartHide 0.3s ease-in-out forwards",
      },
      colors: {
        ...colors,
        dark: "rgb(var(--dark) / <alpha-value>)",
        light: "rgb(var(--light) / <alpha-value>)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("daisyui"),
  ],

  // daisyui: {
  //   themes: ["light", "dark"],
  // },

  daisyui: {
    themes: [],
  },
};
export default config;
