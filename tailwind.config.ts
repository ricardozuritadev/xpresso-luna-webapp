import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  // @ts-expect-error – safelist sí es válido aunque no esté tipado explícitamente
  safelist: ["data-[state=checked]:bg-chart-2"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
