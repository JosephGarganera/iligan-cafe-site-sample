// src/utils/queries.js
import { supabase } from "./supabaseClient";

/**
 * Dynamically resolves everything a tenant needs to render its storefront completely.
 * Feeds data straight down to index.astro with zero upfront caching bottlenecks.
 * @param {string} tenantId - The unique routing slug parsed from Vercel Edge Middleware
 */
export async function getStorefrontData(tenantId) {
  try {
    // 1. Fetch Tenant Profile information to ensure business is active
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", tenantId)
      .single();

    if (tenantError || !tenant) {
      console.error(
        `Tenant resolution failure for id: ${tenantId}`,
        tenantError,
      );
      return { error: "Business instance not found." };
    }

    // IF THE ACCOUNT IS SUSPENDED, HALT PAYLOAD AND RETURN STATUS IMMEDIATELY
    if (tenant.status === "suspended") {
      return {
        isSuspended: true,
        businessName: tenant.business_name,
        subdomain: tenant.subdomain,
      };
    }

    // 2. Fire concurrent requests for theme configurations and product inventories
    const [themeResponse, entitiesResponse] = await Promise.all([
      supabase
        .from("tenant_themes")
        .select("*")
        .eq("tenant_id", tenantId)
        .maybeSingle(), // FIXED: Using maybeSingle() prevents crash if theme row is missing during setup
      supabase
        .from("tenant_entities")
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("is_visible", true),
    ]);

    if (entitiesResponse.error) throw entitiesResponse.error;

    // 3. Extract data safely with unified fallback structural values
    const themeData = themeResponse.data || {};

    return {
      businessName: tenant.business_name,
      businessType: tenant.business_type,
      subdomain: tenant.subdomain,
      layoutMode: themeData.layout_mode || "grid",
      navigationStyle: themeData.navigation_style || "tabs",
      colorTokens: themeData.color_tokens || {
        primary: "#800020",
        bg: "#FAF9F5",
        text: "#1f2937",
      },
      typographyFamily: themeData.typography_family || "sans",
      catalogItems: entitiesResponse.data || [],
    };
  } catch (error) {
    console.error("Fatal multi-tenant payload fetch failure:", error.message);
    return { error: "Internal system data lake recovery error." };
  }
}

/**
 * Fetches transaction metrics securely for an authenticated business owner's private dashboard.
 * Row-Level Security (RLS) automatically ensures no data pollution between businesses.
 * @param {string} tenantId - The unique business token matching the owner's JWT
 */
export async function getTenantDashboardMetrics(tenantId) {
  const { data: logs, error } = await supabase
    .from("tenant_ledger")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Dashboard metrics fetch blocked or failed:", error.message);
    return { metrics: null, ledger: [] };
  }

  // Programmatic, zero-cost accounting math aggregation
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
 * Blocks unauthorized cashiers from accessing full owner-only financials.
 * @param {string} userUuid - The authenticated user's unique identity string from Supabase Auth
 * @param {string} tenantId - The business space the user is attempting to access
 */
export async function verifyUserStaffClearance(userUuid, tenantId) {
  try {
    const { data: profile, error } = await supabase
      .from("staff_profiles")
      .select("assigned_role, tenant_id")
      .eq("id", userUuid)
      .single();

    if (error || !profile) return { authorized: false, role: "none" };

    // Anti-Fraud Check: Ensure staff isn't attempting to read data from a competing business
    if (profile.tenant_id !== tenantId)
      return { authorized: false, role: "none" };

    return {
      authorized: true,
      role: profile.assigned_role, // Returns 'owner' or 'staff'
    };
  } catch (err) {
    return { authorized: false, role: "none" };
  }
}
