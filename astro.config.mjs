import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindv4 from "@tailwindcss/vite";

export default defineConfig({
  output: "static",

  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  vite: {
    plugins: [tailwindv4()],
  },
});
