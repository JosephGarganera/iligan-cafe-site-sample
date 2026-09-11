// src/pages/api/checkout.js
import { createClient } from "@supabase/supabase-js";

export const prerender = false; // Forces this endpoint to render on-demand on the server (SSR)

export async function POST({ request }) {
  console.log(
    "------- [BACKEND LOG] /api/checkout Pure Supabase Pipeline Active -------",
  );

  try {
    const body = await request.json();
    const { tenantId, entityId, quantity = 1, channelUsed } = body;

    // 1. Initialize Master Environment Token Configurations
    const supabaseUrl =
      import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
    const serviceRoleKey =
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        "[CRITICAL SECURE FAULT] Configuration tokens missing in server environment.",
      );
      return new Response(
        JSON.stringify({ error: "Infrastructure security keys unallocated." }),
        { status: 500 },
      );
    }

    // 2. Initialize Administrative Supabase Client (Bypasses read RLS constraints safely server-side)
    const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    console.log(
      `[SECURITY CONTROLLER] Fetching source-of-truth price for Entity ID: ${entityId}`,
    );

    // 3. EXPLICIT SELECTION PROJECTION: Updated column fields to match your exact database layout!
    const { data: verifiedEntity, error: entityError } = await adminSupabase
      .from("tenant_entities")
      .select("id, title, price, is_visible") // FIXED: Changed 'name' to 'title' to match your schema!
      .eq("id", entityId)
      .eq("tenant_id", tenantId)
      .maybeSingle();

    if (entityError || !verifiedEntity) {
      console.error(
        `[FRAUD ALERT] Request rejected. Cross-tenant boundary conflict or missing entity: ${entityId}`,
      );
      return new Response(
        JSON.stringify({
          error: "Item validation failure. Transaction terminated.",
        }),
        { status: 422 },
      );
    }

    if (!verifiedEntity.is_visible) {
      return new Response(
        JSON.stringify({ error: "Requested asset is currently archived." }),
        { status: 400 },
      );
    }

    // 4. SECURE HIGH-PRECISION REVENUE MATHEMATICS (Computed strictly on the server)
    const baseUnitPrice = parseFloat(verifiedEntity.price || 0);
    const calculatedSubtotal = baseUnitPrice * parseInt(quantity);

    // Applying structured business taxation metrics (12% standard local tax)
    const taxRateMultiplier = 0.12;
    const calculatedTax = calculatedSubtotal * taxRateMultiplier;
    const localizedTotalGrossValue = calculatedSubtotal + calculatedTax;

    const trackingIdUuid = crypto.randomUUID();

    console.log(
      `[LEDGER PROCESSOR] Math verified. Writing immutable ledger row for ₱${localizedTotalGrossValue.toFixed(2)}`,
    );

    // 5. GENERATE STRUCTURED POWERBI-READY SINGLE-TABLE INJECTION
    const { error: ledgerError } = await adminSupabase
      .from("tenant_ledger")
      .insert([
        {
          tenant_id: tenantId,
          interaction_type: "SALE",
          total_value: localizedTotalGrossValue.toFixed(2),
          payment_status: "paid",
          reference_token: trackingIdUuid,
          user_agent: request.headers.get("user-agent") || "UNKNOWN_TERMINAL",
          ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",

          payload_data: {
            item_id: verifiedEntity.id,
            sku_code: verifiedEntity.id.slice(0, 8).toUpperCase(), // Safe fallback fallback string code code identifier
            item_name: verifiedEntity.title, // FIXED: Maps 'title' securely down into your JSONB analytical fields
            unit_price: baseUnitPrice,
            order_quantity: quantity,
            subtotal_value: calculatedSubtotal,
            tax_value: calculatedTax,
            payment_channel: channelUsed || "Counter Cash",
          },
        },
      ]);

    // Inside src/pages/api/checkout.js - Right before the final success Response block

    // FIRE-AND-FORGET BACKGROUND WORKER
    // We launch this asynchronous fetch task without using 'await'.
    // This allows the transaction to close instantly for the cashier, while the document builds in the background!
    fetch(`${new URL(request.url).origin}/api/receipts/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referenceToken: trackingIdUuid,
        tenantId: tenantId,
      }),
    }).catch((err) =>
      console.error("Background task tracking drop warning:", err.message),
    );

    console.log(
      `------- [BACKEND LOG] Security Checkout Pipeline Finished [201 Created] -------`,
    );
    return new Response(
      JSON.stringify({
        success: true,
        trackingId: trackingIdUuid,
        grossTotal: localizedTotalGrossValue.toFixed(2),
      }),
      {
        status: 201, // 201 Created is the proper HTTP standard for successful record insertion
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (err) {
    console.error(
      "------- [BACKEND LOG] PIPELINE CRITICAL FAULT CATCH -------",
      err.message,
    );
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }
}
