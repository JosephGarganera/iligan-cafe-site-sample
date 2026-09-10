// src/utils/queries.js
import { createClient } from "@sanity/client";

const authenticatedClient = createClient({
  projectId: "pd1a3die",
  dataset: "production",
  apiVersion: "2026-09-10",
  useCdn: false,
  token: import.meta.env.SANITY_WRITE_TOKEN,
  // FIXED: Instruct Sanity to strictly filter out drafts and stream ONLY published assets
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

    // Explicit GROQ object lookup targeting the active siteSettings profile
    const liveSettings =
      (await authenticatedClient.fetch(
        `*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]`,
      )) || null;

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
