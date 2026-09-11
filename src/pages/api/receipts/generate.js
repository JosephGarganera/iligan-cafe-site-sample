// src/pages/api/receipts/generate.js
import { createClient } from "@supabase/supabase-js";

export const prerender = false; // Must run on-demand server-side

export async function POST({ request }) {
  console.log(
    "------- [BACKGROUND WORKER] Receipt Generation Engine Triggered -------",
  );

  try {
    const body = await request.json();
    const { referenceToken, tenantId } = body;

    if (!referenceToken || !tenantId) {
      return new Response(
        JSON.stringify({ error: "Missing required execution parameters." }),
        { status: 400 },
      );
    }

    // 1. Initialize Administrative Supabase Client
    const supabaseUrl =
      import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
    const serviceRoleKey =
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 2. Fetch the Source-of-Truth Transaction Ledger Row
    const { data: ledgerRow, error: ledgerError } = await adminSupabase
      .from("tenant_ledger")
      .select("created_at, total_value, payload_data")
      .eq("tenant_id", tenantId)
      .eq("reference_token", referenceToken)
      .maybeSingle();

    if (ledgerError || !ledgerRow) {
      console.error(
        `[WORKER FAULT] Could not resolve ledger record for token: ${referenceToken}`,
      );
      return new Response(
        JSON.stringify({ error: "Ledger transaction reference not found." }),
        { status: 404 },
      );
    }

    // Extract itemization matrices from the secure JSONB dimension block
    const { payload_data, created_at, total_value } = ledgerRow;
    const dateFormatted = new Date(created_at).toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
    });

    // 3. GENERATE DYNAMIC HIGH-CONTRAST STRUCTURED VECTOR SVG
    // Tailored for crystal-clear thermal printing or screen review vectors
    const svgReceipt = `
      <svg xmlns="http://w3.org" viewBox="0 0 400 600" width="100%" height="100%">
        <style>
          .header { font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold; fill: #000000; text-anchor: middle; }
          .meta { font-family: 'Courier New', monospace; font-size: 11px; fill: #555555; }
          .label { font-family: 'Courier New', monospace; font-size: 12px; fill: #000000; }
          .value { font-family: 'Courier New', monospace; font-size: 12px; fill: #000000; text-anchor: end; }
          .line { stroke: #000000; stroke-width: 1; stroke-dasharray: 4; }
          .total { font-family: 'Courier New', monospace; font-size: 15px; font-weight: bold; fill: #000000; }
        </style>
        
        <!-- Background Panel Layer -->
        <rect width="400" height="600" fill="#FFFFFF"/>
        
        <!-- Header Branding Text Vectors -->
        <text x="200" y="50" class="header">${tenantId.toUpperCase()} OFFICIAL RECEIPT</text>
        <text x="200" y="70" class="meta" text-anchor="middle">Powered by OmniPOS SaaS Engine</text>
        
        <!-- Metadata Context Layout -->
        <text x="30" y="110" class="meta">DATE: ${dateFormatted}</text>
        <text x="30" y="130" class="meta">REF: ${referenceToken.slice(0, 18)}...</text>
        <text x="30" y="150" class="meta">CHAN: ${payload_data?.payment_channel || "Counter"}</text>
        
        <line x1="30" y1="170" x2="370" y2="170" class="line" />
        
        <!-- Catalog Item List Headers -->
        <text x="30" y="195" class="label" font-weight="bold">ITEM DESCRIPTION</text>
        <text x="280" y="195" class="label" font-weight="bold">QTY</text>
        <text x="370" y="195" class="value" font-weight="bold">PRICE</text>
        
        <line x1="30" y1="210" x2="370" y2="210" class="line" />
        
        <!-- Dynamic Item Matrix Row Injection -->
        <text x="30" y="240" class="label">${payload_data?.item_name || "Collection Item"}</text>
        <text x="280" y="240" class="label">${payload_data?.order_quantity || 1}</text>
        <text x="370" y="240" class="value">₱${parseFloat(payload_data?.unit_price || 0).toFixed(2)}</text>
        
        <line x1="30" y1="400" x2="370" y2="400" class="line" />
        
        <!-- High-Precision Financial Summary Matrices -->
        <text x="30" y="430" class="label">Subtotal Breakdown</text>
        <text x="370" y="430" class="value">₱${parseFloat(payload_data?.subtotal_value || 0).toFixed(2)}</text>
        
        <text x="30" y="455" class="label">Tax Component (12% VAT)</text>
        <text x="370" y="455" class="value">₱${parseFloat(payload_data?.tax_value || 0).toFixed(2)}</text>
        
        <line x1="30" y1="480" x2="370" y2="480" class="line" />
        
        <text x="30" y="515" class="total">GROSS TOTAL VALUE</text>
        <text x="370" y="515" class="value total">₱${parseFloat(total_value).toFixed(2)}</text>
        
        <!-- Footer Compliance Matrix -->
        <text x="200" y="565" class="meta" text-anchor="middle">Thank you for supporting Local Businesses!</text>
      </svg>
    `.trim();

    // 4. STREAM RAW VECTOR STRAIGHT INTO STORAGE VAULT BUCKETS
    // Storage Path Target Vector Format: tenant-slug/reference-token.svg
    const storageFilePath = `${tenantId}/${referenceToken}.svg`;

    const { error: uploadError } = await adminSupabase.storage
      .from("receipts")
      .upload(storageFilePath, svgReceipt, {
        contentType: "image/svg+xml",
        cacheControl: "31536000",
        upsert: true, // Prevents duplicate failure loops
      });

    if (uploadError) {
      console.error(
        `[STORAGE VAULT CRITICAL ERROR] Upload execution failed: ${uploadError.message}`,
      );
      return new Response(
        JSON.stringify({ error: "Storage upload boundary fault." }),
        { status: 502 },
      );
    }

    console.log(
      `[WORKER SUCCESS] Structural SVG persistent receipt archived cleanly at path: ${storageFilePath}`,
    );
    return new Response(
      JSON.stringify({ success: true, path: storageFilePath }),
      { status: 200 },
    );
  } catch (err) {
    console.error("[WORKER CRITICAL FAULT CATCH]", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
