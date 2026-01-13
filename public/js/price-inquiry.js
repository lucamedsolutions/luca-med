document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("priceForm");
  const button = form.querySelector("button");
  const messageBox = document.getElementById("priceMessage");


  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const from = form.from.value.trim();
    const to = form.to.value.trim();
    const email = form.email.value.trim();


    // Loading state
    button.disabled = true;
    button.textContent = "Sending…";

    try {
      const res = await fetch("/api/price-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, email })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      // Success UI
      showMessage(
        "Pricing details have been sent to your email. Our introductory rates are $4.50 (≤15 km) and $6.75 (>15 km).",
        "success"
      );

      form.reset();
    } catch (err) {
      showMessage(
        "Something went wrong. Please try again or contact us directly.",
        "error"
      );
    } finally {
      button.disabled = false;
      button.textContent = "Get Delivery Price";
    }
  });

  function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = type; // success | error
  }
});