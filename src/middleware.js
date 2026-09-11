// src/middleware.js
import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";

/**
 * Enterprise Custom Domain & Subdomain Proxy Broker
 * Runs at Vercel's Global Edge Network proxy layer.
 * Bypasses database RLS lookups via service role cache projections to maximize throughput speeds.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const hostname = context.request.headers.get("host") || "";

  // 1. Establish core target structural infrastructure domains
  const baseDomain = "omnipos.io";
  const localDomain = "localhost:4321";

  let detectedRoutingKey = "";
  let isCustomDomainRoute = false;

  // 2. Parse out and resolve incoming host parsing categories cleanly
  if (hostname.includes(baseDomain)) {
    // Standard production subdomain channel (e.g., "cristina-crafts.storefront.net")
    detectedRoutingKey = hostname
      .replace(`.${baseDomain}`, "")
      .trim()
      .toLowerCase();
  } else if (hostname.includes(localDomain) || hostname.includes("127.0.0.1")) {
    // FIXED: High-precision extraction parser looking for ?tenant= strings on your local server port
    detectedRoutingKey = url.searchParams.get("tenant") || "cristina-crafts"; // Set your active testing slug as the default fallback!
    detectedRoutingKey = detectedRoutingKey.trim().toLowerCase();
  } else {
    // Independent Apex Client Custom Domain! (e.g., "cristinacrafts.com")
    detectedRoutingKey = hostname.trim().toLowerCase();
    isCustomDomainRoute = true;
  }

  // Early exit optimization: Skip lookups for system asset folders or API endpoints
  if (
    url.pathname.startsWith("/_astro") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.includes(".")
  ) {
    return next();
  }

  try {
    // 3. Initialize High-Performance Edge Admin Connection
    const supabaseUrl =
      import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
    const serviceRoleKey =
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      context.locals.tenantId = "default-tenant";
      return next();
    }

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    let matchedTenantId = null;

    // 4. EXPLICIT SELECTION PROJECTION: Query minimum required bytes to optimize network speeds
    if (isCustomDomainRoute) {
      const { data } = await adminSupabase
        .from("tenants")
        .select("id")
        .eq("custom_domain", detectedRoutingKey)
        .maybeSingle();
      matchedTenantId = data?.id;
    } else {
      const { data } = await adminSupabase
        .from("tenants")
        .select("id")
        .or(`subdomain.eq.${detectedRoutingKey},id.eq.${detectedRoutingKey}`)
        .maybeSingle();
      matchedTenantId = data?.id;
    }

    // 5. Inject globally scoped context identifier key into server locals
    context.locals.tenantId = matchedTenantId || "default-tenant";
  } catch (error) {
    console.error(
      "[EDGE PROXY FAILURE] Domain mapping execution crash:",
      error.message,
    );
    context.locals.tenantId = "default-tenant";
  }

  return next();
});
