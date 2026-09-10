// src/pages/api/checkout.js
export const prerender = false; // Forces this link to run as a live server action endpoint

export async function POST({ request }) {
  try {
    const transactionDoc = await request.json();

    // Server-side retrieval of your secure hidden environment token key
    const token = import.meta.env.SANITY_WRITE_TOKEN;

    const response = await fetch(`https://sanity.io`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations: [{ create: transactionDoc }] }),
    });

    if (response.ok) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
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
