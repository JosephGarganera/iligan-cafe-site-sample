// src/utils/queries.js
import { supabase } from "./supabaseClient";

export async function getStorefrontData(tenantId) {
  try {
    if (!tenantId) return { error: "No tenant context provided." };

    console.log(
      `[QUERIES DATA] Initiating secure multi-match lookup for tenant context: "${tenantId}"`,
    );

    // 1. Resolve the primary tenant profile using either the subdomain text string or full URL path
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("id, business_name, business_type, subdomain, status")
      .or(`subdomain.eq.${tenantId},subdomain.eq.${tenantId}.iligancafes.com`)
      .maybeSingle();

    if (tenantError || !tenant) {
      console.error(
        `[QUERIES DB ERROR] Failed to resolve tenant partition records:`,
        tenantError,
      );
      return { error: "Tenant not found inside database registries." };
    }

    if (tenant.status === "suspended") {
      return { isSuspended: true, businessName: tenant.business_name };
    }

    // 2. Query matching themes and product catalogs concurrently
    const [themeResponse, entitiesResponse] = await Promise.all([
      supabase
        .from("tenant_themes")
        .select("layout_mode, color_tokens, typography_family")
        .eq("tenant_id", tenant.id)
        .maybeSingle(),
      supabase
        .from("tenant_entities")
        .select("id, title, description, price, imageurl, category, metadata")

        // SAFE CONTEXT MATCHING: Filter records by matching the exact tenant identifier string row
        .eq("tenant_id", tenant.id)

        .eq("is_visible", true)
        .eq("is_deleted", false),
    ]);

    const themeData = themeResponse.data || {};

    // 3. Remap database fields to match what ProductCard.astro expects
    const standardizedItems = (entitiesResponse.data || []).map((item) => ({
      id: item.id,
      name: item.title,
      description: item.description,
      price: item.price,

      // FIXED: Provides BOTH casings to clear the component destructuring trap!
      imageUrl: item.imageurl,
      imageurl: item.imageurl,

      category: item.category,
      metadata: item.metadata || {},
    }));

    return {
      success: true,
      businessName: tenant.business_name,
      businessType: tenant.business_type,
      layoutMode: themeData.layout_mode || "grid",
      colorTokens: themeData.color_tokens || {
        primary: "#800020",
        bg: "#FAF9F5",
        text: "#1f2937",
      },
      typographyFamily: themeData.typography_family || "sans",
      catalogItems: standardizedItems,
    };
  } catch (error) {
    console.error("Fatal data extraction layer drop:", error.message);
    return { error: error.message };
  }
}

/**
 * Fetches transaction metrics securely for an authenticated business owner's private dashboard.
 * ENTERPRISE OPTIMIZATION: Projects explicit transaction columns for rapid BI rendering data matrices.
 * @param {string} tenantId - The unique business token matching the owner's JWT
 */
export async function getTenantDashboardMetrics(tenantId) {
  const { data: logs, error } = await supabase
    .from("tenant_ledger")
    .select(
      "id, total_value, interaction_type, payment_status, reference_token, created_at",
    ) // Explicit projections
    .eq("tenant_id", tenantId)
    .eq("is_deleted", false) // Filter gate blocks soft-deleted rows from distorting analytics figures
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Dashboard metrics fetch blocked or failed:", error.message);
    return { metrics: null, ledger: [] };
  }

  // Programmatic, zero-cost accounting aggregation computing
  const totalRevenue = logs.reduce(
    (sum, entry) => sum + parseFloat(entry.total_value || 0),
    0,
  );
  const totalInteractions = logs.length;

  return {
    metrics: {
      totalRevenue: totalRevenue.toFixed(2),
      totalInteractions,
    },
    ledger: logs,
  };
}

/**
 * Verifies an authenticated user's permission layer inside a specific tenant partition.
 * @param {string} userUuid - The authenticated user's unique identity string from Supabase Auth
 * @param {string} tenantId - The business space the user is attempting to access
 */
export async function verifyUserStaffClearance(userUuid, tenantId) {
  try {
    const { data: profile, error } = await supabase
      .from("staff_profiles")
      .select("assigned_role, tenant_id") // Explicit projections
      .eq("id", userUuid)
      .single();

    if (error || !profile) return { authorized: false, role: "none" };

    if (profile.tenant_id !== tenantId)
      return { authorized: false, role: "none" };

    return {
      authorized: true,
      role: profile.assigned_role,
    };
  } catch (err) {
    return { authorized: false, role: "none" };
  }
}
