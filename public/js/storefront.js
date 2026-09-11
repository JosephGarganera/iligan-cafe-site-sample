// public/js/storefront.js
document.addEventListener("DOMContentLoaded", () => {
  // 1. Tab Navigation Swapping
  const triggers = document.querySelectorAll(".tab-trigger");
  const panes = document.querySelectorAll(".tab-pane");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const targetId = trigger.getAttribute("data-target");
      triggers.forEach((t) =>
        t.classList.remove(
          "accent-bg",
          "text-white",
          "border-transparent",
          "shadow-md",
        ),
      );
      panes.forEach((p) =>
        p.classList.add("hidden", "opacity-0", "translate-y-2"),
      );

      trigger.classList.add(
        "accent-bg",
        "text-white",
        "border-transparent",
        "shadow-md",
      );
      const activePane = targetId ? document.getElementById(targetId) : null;
      if (activePane) {
        activePane.classList.remove("hidden");
        setTimeout(() => {
          activePane.classList.remove("opacity-0", "translate-y-2");
          activePane.classList.add("opacity-100");
        }, 30);
      }
    });
  });

  // 2. Interactive Product Modals
  document.querySelectorAll("[data-modal-trigger]").forEach((t) => {
    t.addEventListener("click", () => {
      const id = t.getAttribute("data-modal-trigger");
      const m = document.getElementById(`modal-target-${id}`);
      if (m) m.classList.remove("hidden");
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-close-modal");
      const m = document.getElementById(`modal-target-${id}`);
      if (m) m.classList.add("hidden");
    });
  });

  // 3. Multi-Tenant Secure Checkout API Bridge (Exploit Free)
  document.querySelectorAll("[data-checkout-btn]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const entityId = btn.getAttribute("data-checkout-btn");
      const gatewayElement = document.getElementById(`gateway-${entityId}`);
      const channelUsed = gatewayElement ? gatewayElement.value : "Counter";
      const tenantToken =
        document.body.getAttribute("data-tenant-token") || "default-tenant";

      // Disables button interaction instantly to prevent duplicate submission network race loops
      btn.innerText = "Processing Operational Payload...";
      btn.disabled = true;

      // Notice: Price data is COMPLETELY omitted here. We transmit only tracking keys!
      const transactionPayload = {
        tenantId: tenantToken,
        entityId: entityId,
        quantity: 1,
        channelUsed: channelUsed,
      };

      console.log(
        "[FRONTEND SECURE LOG] Transmitting token IDs:",
        transactionPayload,
      );

      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transactionPayload),
        });

        const data = await res.json();

        if (res.status === 201 || data.success) {
          alert(
            `Transaction Registered Securely!\n\nGross Value (With Tax): ₱${data.grossTotal}\nTracking Token: ${data.trackingId}`,
          );
          document
            .getElementById(`modal-target-${entityId}`)
            ?.classList.add("hidden");
        } else {
          alert(
            `Pipeline Rejected: ${data.error || "Unknown system anomaly."}`,
          );
        }
      } catch (err) {
        alert(`Network Operational Layer Fault: ${err.message}`);
      } finally {
        btn.innerText = "Confirm Interaction Workflow";
        btn.disabled = false;
      }
    });
  });
});
