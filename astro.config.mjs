import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwind from "@astrojs/tailwind"; // Import the official stable integration

export default defineConfig({
  output: "static",

  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  // Enforces clean utility mapping loops for Tailwind classes
  integrations: [tailwind()],
});
