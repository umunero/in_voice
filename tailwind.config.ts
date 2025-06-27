import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  important: true,
  // Tailwind CSS problem:  
  // - By default, the content array includes:  
  //   "./src/app/**/*.{js,ts,jsx,tsx,mdx}"  
  //   "./src/page/**/*.{js,ts,jsx,tsx,mdx}"  
  //   "./src/components/**/*.{js,ts,jsx,tsx,mdx}"  
  // - If additional folders exist under "src" and use Tailwind, there are two solutions:  
  //   1. Set content to ["./src/**/*.{js,ts,jsx,tsx,mdx}"] (covers all subfolders).  
  //   2. Keep the default array and add specific folder paths manually.  
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: 'rgb(var(--primary-color) / <alpha-value>)',
          light: 'rgb(var(--primary-color-light) / <alpha-value>)',
          dark: 'rgb(var(--primary-color-dark) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
export default config;
