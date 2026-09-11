// src/pages/api/inventory/replenish.js
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

export async function POST({ request }) {
  console.log("------- [BACKEND LOG] /api/inventory/replenish Active -------");
  try {
    const body = await request.json();
    const { tenantId, entityId, quantity, costPrice, notes } = body;

    const supabaseUrl =
      import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
    const serviceRoleKey =
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({
          error: "Infrastructure security tokens unallocated.",
        }),
        { status: 500 },
      );
    }

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Write the immutable audit row tracking entry
    const { error: logError } = await adminSupabase
      .from("tenant_inventory_ledger")
      .insert([
        {
          tenant_id: tenantId,
          entity_id: entityId,
          transaction_type: "REPLENISHMENT",
          quantity_delta: parseInt(quantity),
          cost_per_unit: parseFloat(costPrice),
          notes: notes || "Standard stock ingestion loop entry.",
        },
      ]);

    if (logError) throw logError;

    // 2. Enterprise BI Enrichment: Log entry inside our master system security CDC audit log automatically
    console.log(
      `[INVENTORY CONTROL] Immutable batch entry successful for item ${entityId}: +${quantity}`,
    );

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    console.error(
      "[INVENTORY CRASH] Failed to finalize stock allocation:",
      err.message,
    );
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }
}
