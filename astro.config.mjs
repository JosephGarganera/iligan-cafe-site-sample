import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel"; // 1. Import the newly installed Vercel adapter mapping node

export default defineConfig({
  // Enforces dual configuration modes: Statically pre-builds frontend pages by default,
  // but spins up dynamic secure cloud environments for server API routes!
  output: "static",

  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  integrations: [tailwind()],
});
