// src/middleware.js
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const hostname = url.hostname; // e.g., "://iligancafes.com" or "localhost"

  let tenantId = "the-tavern"; // Default fallback for local testing sandbox

  // 1. Production Rule: Parse subdomains if running on your primary SaaS platform domain
  // Assumes production hub url format is: *.iligancafes.com
  if (hostname.includes("iligancafes.com") && !hostname.startsWith("www.")) {
    // Extract the primary prefix segment before the first dot
    tenantId = hostname.split(".")[0];
  }

  // 2. Local Testing Sandbox Rule: Parse search parameter overrides
  // Allows testing any store locally via: http://localhost:4321/?tenant=prime-fitness
  else if (url.searchParams.has("tenant")) {
    tenantId = url.searchParams.get("tenant");
  }

  // 3. Inject the resolved tenant ID directly into Astro's request lifecycle
  context.locals.tenantId = tenantId;

  // 4. Force Vercel to bust edge caches for real-time transactional synchronization
  const response = await next();
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  );
  response.headers.set("Surrogate-Control", "no-store");

  return response;
});
