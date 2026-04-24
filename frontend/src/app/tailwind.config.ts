import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#FFF6F8",
          primary: "#F3E2D5",
          secondary: "#D8A7B1",
          accent: "#C38D9E",
          border: "#E4D0C0",
        },
        text: {
          primary: "#2D2D2D",
          secondary: "#6B6B6B",
          muted: "#A8A8A8",
        },
        neutral: {
          white: "#FFFFFF",
          soft: "#FAF3F5",
          border: "#F1E4E8",
        },
        luxury: {
          gold: "#C6A769",
        },
      },
    },
  },
};

export default config;