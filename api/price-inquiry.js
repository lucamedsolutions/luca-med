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

  const { from, to, email } = req.body;

  // Backend validation
  if (!from || !to || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  // Save inquiry
  const { error } = await supabase
    .from("price_inquiries")
    .insert({
      from_address: from,
      to_address: to,
      email
    });

  if (error) {
    return res.status(500).json({ error: "Database error" });
  }

  // Send introductory pricing email
//   try {
//     await resend.emails.send({
//       from: `Luca Med Solutions <${process.env.FROM_EMAIL}>`,
//       to: email,
//       subject: "Introductory Delivery Pricing – Luca Med Solutions",
//       html: `
//         <p>Thank you for contacting <strong>Luca Med Solutions</strong>.</p>

//         <p>We are currently offering <strong>introductory delivery rates</strong> for pharmacies:</p>

//         <ul>
//           <li><strong>$4.50</strong> for deliveries up to 15 km</li>
//           <li><strong>$6.75</strong> for deliveries over 15 km</li>
//         </ul>

//         <p>Our deliveries are PHIPA-compliant, secure, and handled by trained drivers.</p>

//         <p>Reply to this email if you’d like to get started or have questions.</p>

//         <br />
//         <p>— Luca Med Solutions</p>
//       `
//     });
//   } catch (emailError) {
//     // Email failure should not block submission
//     console.error("Email failed:", emailError);
//   }

  return res.status(200).json({ success: true });
}