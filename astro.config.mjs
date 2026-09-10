import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindv4 from "@tailwindcss/vite";

export default defineConfig({
  output: "static",

  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  vite: {
    // 1. Forces the compiler to output highly detailed debugging tracks
    logLevel: "info",

    plugins: [
      tailwindv4(),

      // 2. DIAGNOSTIC INTERCEPTOR LOG: Prints files right before the Tailwind engine reads them!
      {
        name: "vite-diagnostic-logger",
        transform(code, id) {
          // Track custom files we created to pinpoint empty or malformed targets
          if (id.includes("src/") && !id.includes("node_modules")) {
            console.log(`[Vite Build Scan Debug] Processing file node: ${id}`);

            // Check for empty or malformed configurations
            if (!code || code.trim() === "") {
              console.warn(
                `[🚨 DIAGNOSTIC CRITICAL WARNING] Found an completely EMPTY code file target: ${id}`,
              );
            }
          }
          return null; // Passes the file down safely to Tailwind without changing it
        },
      },
    ],
  },
});
