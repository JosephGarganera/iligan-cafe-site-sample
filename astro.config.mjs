import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "static",

  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  // Restored to pure, clean standard configs! No more overlapping compiler exclusions.
});
