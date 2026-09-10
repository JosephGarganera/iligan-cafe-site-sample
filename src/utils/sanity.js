import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "pd1a3die",
  dataset: "production",
  apiVersion: "2026-09-10",
  useCdn: false, // Must be false for real-time transactional writes

  // FIXED: Binding your secure API editor token directly to the engine core
  token: "SANITY_WRITE_TOKEN",
});
