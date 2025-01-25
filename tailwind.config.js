module.exports = {
  mode: "jit",
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      poppins: ["'Poppins'", "sans-serif"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
