import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindv4 from "@tailwindcss/vite";

export default defineConfig({
  output: "static",

  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  vite: {
    // FIXED: Enforce strict directory isolation boundaries to shield backend folders
    optimizeDeps: {
      exclude: ["iligan-cafe-site-sample", ".sanity", "node_modules"],
    },
    build: {
      rollupOptions: {
        external: ["iligan-cafe-site-sample"],
      },
    },
    plugins: [tailwindv4()],
  },
});
