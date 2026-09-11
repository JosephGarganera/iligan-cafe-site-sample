// src/pages/api/auth/add-staff.js
import { createClient } from "@supabase/supabase-js";

export const POST = async ({ request }) => {
  console.log(
    "------- [BACKEND LOG] /api/auth/add-staff Pipeline Triggered -------",
  );
  try {
    const body = await request.json();
    const { email, password, displayName, assignedRole, tenantId } = body;

    console.log("[BACKEND LOG] Received payload variables:", {
      email,
      displayName,
      assignedRole,
      tenantId,
    });

    // 1. Build a strict, fallback parser to prevent DB not-null constraint failures
    const finalizedDisplayName =
      displayName && displayName.trim() !== ""
        ? displayName
        : email
          ? email.split("@")[0]
          : "Generic Staff";

    const supabaseUrl =
      import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
    const serviceRoleKey =
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log("[BACKEND LOG] Checking environment configs:", {
      urlExists: !!supabaseUrl,
      keyExists: !!serviceRoleKey,
    });

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        "[BACKEND LOG] CRITICAL ERROR: Environment connection tokens missing.",
      );
      return new Response(
        JSON.stringify({
          error: "Missing admin bypass credentials tokens in .env.",
        }),
        { status: 500 },
      );
    }

    // Initialize an admin instance bypassing client authentication gates entirely
    const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    console.log(
      "[BACKEND LOG] Attempting `admin.createUser` execution loop...",
    );

    // 2. Forcefully inject user account straight into Supabase Auth Core via Admin Management API
    const { data: authData, error: authError } =
      await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Forcefully sets email as verified instantly
        user_metadata: {
          tenant_id: tenantId,
          role: assignedRole,
          display_name: finalizedDisplayName,
        },
      });

    if (authError) {
      console.error(
        "[BACKEND LOG] Supabase Auth Core Registration REJECTED:",
        authError.message,
      );
      throw authError;
    }

    const userUuid = authData.user?.id;
    console.log(
      "[BACKEND LOG] Supabase Auth Core SUCCESS. Generated User UUID string:",
      userUuid,
    );

    if (userUuid) {
      console.log(
        "[BACKEND LOG] Attempting public relational `staff_profiles` row injection...",
      );

      // 3. Insert corresponding relational profile metadata row cleanly into public tables
      const { error: profileError } = await adminSupabase
        .from("staff_profiles")
        .insert([
          {
            id: userUuid,
            tenant_id: tenantId,
            assigned_role: assignedRole,
            display_name: finalizedDisplayName, // Patched fallback value securely passed down
          },
        ]);

      if (profileError) {
        console.error(
          "[BACKEND LOG] Public `staff_profiles` Row Insertion REJECTED:",
          profileError.message,
        );
        throw profileError;
      }

      console.log(
        "[BACKEND LOG] Public relational profile row written successfully.",
      );
    }

    console.log(
      "------- [BACKEND LOG] Pipeline Successfully Finished [201 Created] -------",
    );
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    console.error(
      "------- [BACKEND LOG] FATAL PIPELINE EXCEPTION CAUGHT -------",
    );
    console.error("[BACKEND LOG] Error Message:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }
};
