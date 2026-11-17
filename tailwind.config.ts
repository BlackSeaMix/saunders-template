import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0E0E10",
        cream: "#F2EFEA",
        brandYellow: "#FF4A2B",
        primary: "#1A1A1E",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        display: ["var(--font-bebas)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
