import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        flower: "url('/bg-flower-image.jpg')",
      },
      animation: {
        widthGrow: "widthGrow 0.5s ease-in-out forwards",
        widthShrink: "widthShrink 0.5s ease-in-out forwards",
        filterShow: "filterShow 0.3s ease-in-out forwards",
        filterHide: "filterHide 0.3s ease-in-out forwards",
        cartShow: "cartShow 0.3s ease-in-out forwards",
        cartHide: "cartHide 0.3s ease-in-out forwards",
      },
    },
    colors: {
      ...colors,
      "primary": "#fb7185",
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
export default config;
