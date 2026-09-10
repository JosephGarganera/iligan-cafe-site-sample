import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindv4 from "@tailwindcss/vite"; // Import the native v4 compiler engine plugin

export default defineConfig({
  output: "static",

  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  // Wire Tailwind v4 straight into Astro's core Vite bundler pipeline
  vite: {
    plugins: [tailwindv4()],
  },
});
