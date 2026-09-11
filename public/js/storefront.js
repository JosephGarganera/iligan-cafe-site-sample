/**
 * OmniPOS Platform Storefront Core Client Engine
 * Handles checkout interactions, idempotency orchestration, and atomic response handling.
 * Location: public/js/storefront.js
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 OmniPOS Storefront Client Controller Initialized.");

  const tenantToken = document.body.getAttribute("data-tenant-token");
  if (!tenantToken) {
    console.error(
      "[CRITICAL SYSTEM FAULT] Tenant contextual safety isolation token missing.",
    );
    return;
  }

  // Hook into all active Product Interaction Actions
  document
    .querySelectorAll("[data-action='checkout-trigger']")
    .forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();

        const entityId = button.getAttribute("data-entity-id");
        const quantityInput = document.querySelector(`#qty-${entityId}`);
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

        // FIXED: Safely capture initial text state at the start of the interaction context
        const initialText = button.innerText;

        // FIXED: Clean syntax guard with proper logical boundaries to catch bad inputs
        if (!entityId || isNaN(quantity) || quantity <= 0) {
          button.disabled = true;
          button.innerText = "Invalid Quantity";
          button.classList.add("bg-rose-600", "text-white");

          setTimeout(() => {
            button.disabled = false;
            button.innerText = initialText;
            button.classList.remove("bg-rose-600", "text-white");
          }, 3000);
          return;
        }

        // 1. UI LOCKDOWN STATE (Prevents click-spamming while running async pipelines)
        button.disabled = true;
        button.innerText = "Processing Checkout...";

        // 2. GENERATE CLIENT-SIDE IDEMPOTENCY KEY
        // Fingerprints this specific transaction request so erratic networks don't cause double-charging.
        let clientOrderToken = localStorage.getItem(`pending_tx_${entityId}`);
        if (!clientOrderToken) {
          clientOrderToken = crypto.randomUUID();
          localStorage.setItem(`pending_tx_${entityId}`, clientOrderToken);
        }

        try {
          console.log(
            `[TRANSACTION PIPELINE] Initiating checkout for item: ${entityId} (Qty: ${quantity})`,
          );

          // 3. SECURE PAYLOAD DISPATCH
          const response = await fetch("/api/checkout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              entityId,
              quantity,
              clientOrderToken,
              channelUsed: "Storefront Web Checkout",
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "System rejected transaction.");
          }

          // 4. TRANSACTION RESOLVED SUCCESSFULLY
          console.log(
            `[SUCCESS] Order finalized. Tracking ID: ${result.trackingId}. Total: ₱${result.grossTotal}`,
          );

          // Wipe the specific idempotency token upon absolute execution confirmation
          localStorage.removeItem(`pending_tx_${entityId}`);

          // Trigger Success UI feedback
          button.innerText = `Confirmed! ₱${result.grossTotal}`;
          button.classList.remove("accent-bg");
          button.classList.add("bg-emerald-600", "text-white");
        } catch (error) {
          console.error("[TRANSACTION FAIL]", error.message);

          // User Alert Mapping
          button.innerText = "Error: " + error.message;
          button.classList.remove("accent-bg");
          button.classList.add("bg-rose-600", "text-white");

          // Release lock state context so user can fix and retry cleanly if desired
          setTimeout(() => {
            button.disabled = false;
            button.innerText = initialText;
            button.classList.remove("bg-rose-600", "text-white");
            button.classList.add("accent-bg");
          }, 4000);
        }
      });
    });
});
