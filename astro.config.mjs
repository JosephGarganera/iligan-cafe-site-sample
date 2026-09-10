import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Astro v7 native configuration leveraging Tailwind v4 Vite compiler
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
