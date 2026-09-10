// src/utils/queries.js
import { sanityClient } from "./sanity.js";

export async function fetchStoreData() {
  try {
    // 1. Fetch active data objects independently from the database lake
    const items =
      (await sanityClient.fetch(
        `*[_type == "menuItem" && isAvailable == true] | order(isFeatured desc, orderPriority desc)`,
      )) || [];
    const activeStaff =
      (await sanityClient.fetch(
        `*[_type == "staffMember" && isOnShift == true]`,
      )) || [];

    // 2. Fetch the settings collection list array
    const settingsArray =
      (await sanityClient.fetch(`*[_type == "siteSettings"]`)) || [];

    // 3. FIXED: Extract the absolute first entry index [0] to unwrap the object from its array container!
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
    console.error("Sanity Database Query Exception:", error);
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
