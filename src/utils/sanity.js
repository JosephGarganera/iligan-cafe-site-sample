import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "pd1a3die", // Your live Sanity token (100% lowercase/numbers)
  dataset: "production", // Free tier production channel
  apiVersion: "2026-09-10", // Environment configuration date
  useCdn: false, // 'false' guarantees that changes hit the site instantly!
});
