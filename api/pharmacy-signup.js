import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pharmacy_name, contact_name, email, phone, address, message, services } = req.body;

  if (!pharmacy_name || !contact_name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { error } = await supabase.from("pharmacy_signups").insert({
    pharmacy_name,
    contact_name,
    email,
    phone,
    address,
    message,
    services
  });

  if (error) {
    return res.status(500).json({ error: "Database error" });
  }

  // Thank-you email
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: [email],
      subject: "Thanks for signing up – Luca Med Solutions",
      html: `
        <p>Hi ${contact_name},</p>
        <p>Thank you for signing up with <strong>Luca Med Solutions</strong>.</p>
        <p>Our team will contact you shortly to get you onboarded.</p>
        <p>— Luca Med Solutions</p>
      `
    });
  } catch (e) {
    console.error("Email failed", e);
  }

  return res.status(200).json({ success: true });
}
