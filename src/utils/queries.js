// src/utils/queries.js
import { createClient } from "@sanity/client";

const authenticatedClient = createClient({
  projectId: "pd1a3die",
  dataset: "production",
  apiVersion: "2026-09-10",

  // CRITICAL CACHE BUSTER: Must be false to completely bypass Sanity's edge cache memory
  useCdn: false,

  token: import.meta.env.SANITY_WRITE_TOKEN,
  perspective: "published",
});

export async function fetchStoreData() {
  try {
    const items =
      (await authenticatedClient.fetch(
        `*[_type == "menuItem" && isAvailable == true] | order(isFeatured desc, orderPriority desc)`,
      )) || [];
    const activeStaff =
      (await authenticatedClient.fetch(
        `*[_type == "staffMember" && isOnShift == true]`,
      )) || [];

    // STRICT FILTER HOOK: Fetch the absolute latest modified siteSettings profile document explicitly
    const settingsArray =
      (await authenticatedClient.fetch(
        `*[_type == "siteSettings"] | order(_updatedAt desc)`,
      )) || [];
    const liveSettings = settingsArray.length > 0 ? settingsArray[0] : null;

    console.log(
      "[DEBUG DATA LOOKUP] Detected Active Seasonal Theme Variable:",
      liveSettings?.seasonalTheme,
    );

    const themeSettings = {
      title: liveSettings?.title || "Chedings Copycat Cafe",
      tagline:
        liveSettings?.tagline ||
        "Brewing Community & Great Coffee in the heart of Iligan",
      badgeText: liveSettings?.badgeText || "Proudly Serving Iligan City",
      heroDescription: liveSettings?.heroDescription || "",
      seasonalTheme: liveSettings?.seasonalTheme || "summer", // Verified data token mapping
      shadowIntensity: liveSettings?.shadowIntensity || "shadow-xl",
      borderRadius: liveSettings?.borderRadius || "rounded-3xl",
    };

    return { items, activeStaff, themeSettings };
  } catch (error) {
    console.error("Authenticated Sanity Database Query Exception:", error);
    return {
      items: [],
      activeStaff: [],
      themeSettings: {
        title: "Chedings Copycat Cafe",
        tagline: "Brewing Community & Great Coffee in the heart of Iligan",
        badgeText: "Proudly Serving Iligan City",
        seasonalTheme: "summer",
        shadowIntensity: "shadow-xl",
        borderRadius: "rounded-3xl",
      },
    };
  }
}
