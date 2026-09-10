// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {}, // Directs Tailwind v4 to handle CSS parsing safely outside of Vite module loops
    autoprefixer: {},
  },
};
