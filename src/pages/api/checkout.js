// src/pages/api/checkout.js
export const prerender = false; // Forces this endpoint to render on-demand on the server

export async function POST({ request }) {
  // Ensure your write token is processed inside a fresh request context wrapper
  try {
    const transactionDoc = await request.json();
    const token = import.meta.env.SANITY_WRITE_TOKEN;

    const response = await fetch(`https://sanity.io`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache", // Bypasses internal fetch proxy layers
      },
      body: JSON.stringify({ mutations: [{ create: transactionDoc }] }),
    });

    if (response.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }
    return new Response(JSON.stringify({ error: "Sanity write rejection" }), {
      status: 500,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
