import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "pd1a3die", // Replace with your actual project ID from sanity.io/manage
  dataset: "production", // Default free tier dataset
  apiVersion: "2026-09-10", // API version locked to today's workspace environment
  useCdn: true, // True ensures it pulls from fast, free edge-cached CDN nodes
});
