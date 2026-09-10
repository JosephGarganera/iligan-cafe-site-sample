// src/pages/api/auth/login.js
import { supabase } from "../../../utils/supabaseClient";

export const POST = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    // 1. Execute Supabase Core Auth Authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // 2. Extract the assigned tenant identifier tagged inside the user metadata payload
    const tenantId = data.user?.user_metadata?.tenant_id;

    if (!tenantId) {
      return new Response(
        JSON.stringify({
          error:
            "User profile has no assigned tenant identity configuration tag.",
        }),
        { status: 403 },
      );
    }

    // Return the authenticated session reference payload to the browser client application
    return new Response(
      JSON.stringify({
        success: true,
        tenantId,
        session: data.session,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 401,
    });
  }
};
