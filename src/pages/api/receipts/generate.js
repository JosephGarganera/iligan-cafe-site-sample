// src/pages/api/receipts/generate.js
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

export async function POST({ request }) {
  console.log(
    "------- [BACKGROUND EVENT] Receipt Generation Triggered -------",
  );

  try {
    const body = await request.json();
    const { referenceToken, tenantId } = body;

    // 1. Initialize administrative client access
    const supabaseUrl =
      import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
    const serviceRoleKey =
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 2. Fetch transaction payload metrics with explicit column selections
    const { data: ledgerEntry, error: ledgerError } = await adminSupabase
      .from("tenant_ledger")
      .select("id, total_value, created_at, payload_data")
      .eq("reference_token", referenceToken)
      .eq("tenant_id", tenantId)
      .maybeSingle();

    if (ledgerError || !ledgerEntry)
      throw new Error("Transaction logging record not found.");

    const items = ledgerEntry.payload_data || {};
    const grossTotal = parseFloat(ledgerEntry.total_value).toFixed(2);
    const subtotal = parseFloat(items.subtotal_value || 0).toFixed(2);
    const tax = parseFloat(items.tax_value || 0).toFixed(2);
    const dateString = new Date(ledgerEntry.created_at).toLocaleDateString();

    console.log(
      `[GENERATOR COMPILER] Compiling lightweight vector blueprint for Receipt ID: ${ledgerEntry.id}`,
    );

    // 3. Compile high-fidelity vector markup layout (Optimized for 80mm thermal receipt printing grids)
    const svgReceiptMarkup = `
      <svg xmlns="http://w3.org" viewBox="0 0 300 400" width="100%" height="100%">
        <style>
          .txt { font-family: monospace; font-size: 10px; fill: #0f172a; }
          .bold { font-weight: bold; font-size: 12px; }
          .right { text-anchor: end; }
          .line { stroke: #cbd5e1; stroke-width: 1; stroke-dasharray: 4; }
        </style>
        <!-- Background Canvas -->
        <rect width="300" height="400" fill="#ffffff"/>
        
        <!-- Document Branding Header -->
        <text x="150" y="40" class="txt bold" text-anchor="middle">${items.item_name ? "OFFICIAL RECEIPT" : "RECEIPT"}</text>
        <text x="150" y="55" class="txt" text-anchor="middle">TXN: #${ledgerEntry.id.slice(0, 8).toUpperCase()}</text>
        <text x="150" y="68" class="txt" text-anchor="middle">Date: ${dateString}</text>
        
        <line x1="20" y1="85" x2="280" y2="85" class="line" />
        
        <!-- Transaction Line Items Breakdown -->
        <text x="20" y="110" class="txt bold">${items.item_name || "POS Item"}</text>
        <text x="20" y="125" class="txt">QTY: ${items.order_quantity || 1} x ₱${parseFloat(items.unit_price || 0).toFixed(2)}</text>
        <text x="280" y="125" class="txt right">₱${subtotal}</text>
        
        <line x1="20" y1="150" x2="280" y2="150" class="line" />
        
        <!-- Accounting Summary Blocks Matrix -->
        <text x="120" y="180" class="txt">Subtotal:</text>
        <text x="280" y="180" class="txt right">₱${subtotal}</text>
        
        <text x="120" y="195" class="txt">VAT Local Tax (12%):</text>
        <text x="280" y="195" class="txt right">₱${tax}</text>
        
        <text x="120" y="220" class="txt bold">GROSS TOTAL:</text>
        <text x="280" y="220" class="txt bold right">₱${grossTotal}</text>
        
        <!-- Footnotes Security Verification Strings -->
        <line x1="20" y1="250" x2="280" y2="250" class="line" />
        <text x="150" y="280" class="txt" text-anchor="middle" fill="#64748b">Gateway: ${items.payment_channel || "Counter Cash"}</text>
        <text x="150" y="295" class="txt bold" text-anchor="middle" fill="#6366f1">Thank you for your patronage!</text>
      </svg>
    `;

    // 4. Stream binary document arrays straight to your storage vault partition bucket
    const targetStoragePath = `${tenantId}/receipt-${referenceToken}.svg`;

    const { error: uploadError } = await adminSupabase.storage
      .from("tenant_receipts")
      .upload(targetStoragePath, svgReceiptMarkup, {
        contentType: "image/svg+xml",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 5. Update ledger database record with the clean document path link
    await adminSupabase
      .from("tenant_ledger")
      .update({
        payload_data: {
          ...items,
          receipt_asset_url: `/storage/v1/object/public/tenant-receipts/${targetStoragePath}`,
        },
      })
      .eq("reference_token", referenceToken);

    console.log(
      `------- [BACKGROUND EVENT] Invoice Compiled and Uploaded Safely -------`,
    );
    return new Response(
      JSON.stringify({ success: true, url: targetStoragePath }),
      { status: 201 },
    );
  } catch (err) {
    console.error(
      "[RECEIPT BATCH ERROR] Background compilation failed:",
      err.message,
    );
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }
}
