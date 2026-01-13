document.getElementById("pharmacyForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const payload = {
    pharmacy_name: form.pharmacy_name.value.trim(),
    contact_name: form.contact_name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    address: form.address.value.trim(),
    message: form.message.value.trim(),
    services:Array.from(
                    form.querySelectorAll('input[name="services[]"]:checked')
                    ).map(cb => cb.value)
  };

  const res = await fetch("/api/pharmacy-signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (res.ok) {
    form.reset();
    alert("Thank you! We’ll contact you shortly.");
  } else {
    alert(data.error || "Something went wrong");
  }
});
