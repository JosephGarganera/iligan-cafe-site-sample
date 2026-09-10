import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "pd1a3die", // Your authenticated Sanity Project ID
  dataset: "production", // Free tier production channel
  apiVersion: "2026-09-10", // Environment configuration date
  useCdn: false, // FIXED: False forces immediate bypass of stale image caches!
});
