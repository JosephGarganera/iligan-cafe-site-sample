// src/utils/queries.js
import { sanityClient } from "./sanity.js";

export async function fetchStoreData() {
  try {
    const items =
      (await sanityClient.fetch(
        `*[_type == "menuItem" && isAvailable == true] | order(isFeatured desc, orderPriority desc)`,
      )) || [];
    const activeStaff =
      (await sanityClient.fetch(
        `*[_type == "staffMember" && isOnShift == true]`,
      )) || [];
    const settingsArray =
      (await sanityClient.fetch(`*[_type == "siteSettings"]`)) || [];

    const liveSettings = settingsArray[0] || null;

    const themeSettings = {
      title: liveSettings?.title || "Chedings Copycat Cafe",
      tagline:
        liveSettings?.tagline ||
        "Brewing Community & Great Coffee in the heart of Iligan",
      badgeText: liveSettings?.badgeText || "Proudly Serving Iligan City",
      heroDescription: liveSettings?.heroDescription || "",
      seasonalTheme: liveSettings?.seasonalTheme || "summer", // NEW: Seasonal mapping token
      shadowIntensity: liveSettings?.shadowIntensity || "shadow-xl",
      borderRadius: liveSettings?.borderRadius || "rounded-3xl",
    };

    return { items, activeStaff, themeSettings };
  } catch (error) {
    console.error("Sanity Database Query Exception:", error);
    return {
      items: [],
      activeStaff: [],
      themeSettings: {
        title: "Chedings Copycat Cafe",
        tagline: "Brewing Community",
        modeSelection: "light",
        shadowIntensity: "shadow-xl",
        borderRadius: "rounded-3xl",
      },
    };
  }
}
