// src/utils/queries.js
import { createClient } from "@sanity/client";

// Create an authenticated client instance with explicit credentials to bypass data locks
const authenticatedClient = createClient({
  projectId: "pd1a3die",
  dataset: "production",
  apiVersion: "2026-09-10",
  useCdn: false, // CDN must be disabled to pull your freshly published changes instantly

  // FIXED: Using our secure environment token proxy mapping natively on the server layer
  token: import.meta.env.SANITY_WRITE_TOKEN,
});

export async function fetchStoreData() {
  try {
    // Fetch data arrays independently using the authenticated proxy client channels
    const items =
      (await authenticatedClient.fetch(
        `*[_type == "menuItem" && isAvailable == true] | order(isFeatured desc, orderPriority desc)`,
      )) || [];
    const activeStaff =
      (await authenticatedClient.fetch(
        `*[_type == "staffMember" && isOnShift == true]`,
      )) || [];
    const settingsArray =
      (await authenticatedClient.fetch(`*[_type == "siteSettings"]`)) || [];

    const liveSettings = settingsArray.length > 0 ? settingsArray[0] : null;

    const themeSettings = {
      title: liveSettings?.title || "Chedings Copycat Cafe",
      tagline:
        liveSettings?.tagline ||
        "Brewing Community & Great Coffee in the heart of Iligan",
      badgeText: liveSettings?.badgeText || "Proudly Serving Iligan City",
      heroDescription: liveSettings?.heroDescription || "",
      seasonalTheme: liveSettings?.seasonalTheme || "summer",
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
