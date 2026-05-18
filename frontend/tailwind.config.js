/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { blue: "#1E3A8A", teal: "#0891B2" },
      },
    },
  },
  plugins: [],
};
