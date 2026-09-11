// src/pages/api/inventory/replenish.js
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

export async function POST({ request, locals }) {
  console.log("------- [BACKEND LOG] /api/inventory/replenish Invoked -------");

  try {
    const body = await request.json();
    const tenantId = locals.tenantId || body.tenantId;
    const { entityId, quantityDelta, transactionType, notes } = body;

    // 1. Structural Sanity Validations
    if (!entityId || !quantityDelta || !transactionType) {
      return new Response(
        JSON.stringify({ error: "Missing required ledger parameters." }),
        { status: 400 },
      );
    }

    if (parseInt(quantityDelta) === 0) {
      return new Response(
        JSON.stringify({
          error: "Delta increment matrix value cannot be zero.",
        }),
        { status: 400 },
      );
    }

    // 2. Initialize Administrative Supabase Client
    const adminSupabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    // Verify entity existence and alignment to tenant context boundary
    const { data: entityVerified } = await adminSupabase
      .from("tenant_entities")
      .select("id, price")
      .eq("id", entityId)
      .eq("tenant_id", tenantId)
      .maybeSingle();

    if (!entityVerified) {
      return new Response(
        JSON.stringify({ error: "Target entity isolation boundary mismatch." }),
        { status: 422 },
      );
    }

    // 3. Inject Immutable Record into Ledger
    const { error: ledgerError } = await adminSupabase
      .from("tenant_inventory_ledger")
      .insert([
        {
          tenant_id: tenantId,
          entity_id: entityId,
          transaction_type: transactionType.toUpperCase(), // 'REPLENISHMENT', 'DAMAGE', 'AUDIT'
          quantity_delta: parseInt(quantityDelta),
          cost_per_unit: entityVerified.price,
          notes: notes || `Manual supervisor adjustment payload`,
        },
      ]);

    if (ledgerError) {
      console.error(
        "[LEDGER FAULT] Failed to append historical event:",
        ledgerError.message,
      );
      return new Response(
        JSON.stringify({ error: "Database transaction logging failure." }),
        { status: 500 },
      );
    }

    // 4. Query the Live Aggregated Stock Balance View to pass back the updated real-time state
    const { data: liveBalance } = await adminSupabase
      .from("vw_tenant_inventory_balances")
      .select("current_stock")
      .eq("tenant_id", tenantId)
      .eq("entity_id", entityId)
      .maybeSingle();

    console.log(
      `[INVENTORY ENGINE] Delta recorded successfully. New live stock balance: ${liveBalance?.current_stock}`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        entityId,
        newBalance: liveBalance?.current_stock || 0,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[CRITICAL INVENTORY FAULT]", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
