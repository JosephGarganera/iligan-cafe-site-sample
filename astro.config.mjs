import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  // Enforces dual configuration modes: Static frontend + Secure dynamic server APIs
  output: "static",

  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  // Notice: integrations array is completely empty now! No more old tailwind hooks crashing the setup.
});
