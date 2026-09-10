// src/pages/api/auth/register-tenant.js
import { supabase } from "../../../utils/supabaseClient";

export const POST = async ({ request }) => {
  try {
    const { email, password, businessName, slug, businessType } =
      await request.json();

    // 1. Create the Master Tenant Row entry configuration
    const { error: tenantError } = await supabase.from("tenants").insert([
      {
        id: slug,
        business_name: businessName,
        business_type: businessType,
        subdomain: `${slug}.iligancafes.com`,
      },
    ]);

    if (tenantError) throw tenantError;

    // 2. Auto-initialize default styling system settings
    await supabase.from("tenant_themes").insert([
      {
        tenant_id: slug,
        layout_mode: "grid",
        color_tokens: { primary: "#3b82f6", bg: "#ffffff", text: "#1f2937" },
      },
    ]);

    // 3. Register the human administrator user account explicitly tagged to this tenant ID string
    const { data: userData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          tenant_id: slug, // This critical metadata injects deep row isolation keys
          role: "manager",
        },
      },
    });

    if (authError) throw authError;

    return new Response(
      JSON.stringify({ success: true, userId: userData.user?.id }),
      { status: 201 },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
