import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

export const prerender = false;

const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const history = (submissions.get(ip) || []).filter((t) => now - t < windowMs);
  history.push(now);
  submissions.set(ip, history);
  return history.length > 5;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const data = await request.formData();

  // Honeypot — bots fill hidden fields, humans never do
  if (data.get("_confirm_mail") || data.get("fax")) {
    return new Response(null, { status: 200 });
  }

  // JS fingerprint token — must be present and structurally valid (set by client script)
  const tk = data.get("_tk")?.toString() ?? "";
  if (!tk || !/^\d+\.\d+\.\d+$/.test(tk)) {
    return new Response(null, { status: 200 });
  }

  // Anti-bot: minimum delay between page load and submission (4.5 s)
  const loadedAt = Number(data.get("loadedAt") || 0);
  if (loadedAt && Date.now() - loadedAt < 4500) {
    return new Response(null, { status: 200 });
  }

  if (isRateLimited(clientAddress || "unknown")) {
    return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 });
  }

  // Vérification Turnstile (si configuré)
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = data.get("cf-turnstile-response")?.toString() ?? "";
    if (!token) {
      return new Response(JSON.stringify({ error: "Vérification anti-bot manquante" }), { status: 400 });
    }
    const verif = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: turnstileSecret, response: token }).toString()
    });
    const verifData = await verif.json() as { success: boolean };
    if (!verifData.success) {
      return new Response(JSON.stringify({ error: "Vérification anti-bot échouée" }), { status: 400 });
    }
  }

  const required = ["name", "organization", "email", "phone", "orgType", "need"];
  for (const field of required) {
    const val = data.get(field)?.toString().trim() ?? "";
    const min = field === "need" ? 10 : 1;
    if (!val || val.length < min) {
      return new Response(JSON.stringify({ error: `Champ manquant ou invalide : ${field}` }), { status: 400 });
    }
  }

  const email = data.get("email")?.toString().trim() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: "Email invalide" }), { status: 400 });
  }

  const phone = data.get("phone")?.toString().trim() ?? "";
  const digitsOnly = phone.replace(/[\s\+\-\(\)\.]/g, "");
  if (digitsOnly.length < 7 || digitsOnly.length > 15 || !/^\d+$/.test(digitsOnly)) {
    return new Response(JSON.stringify({ error: "Téléphone invalide" }), { status: 400 });
  }

  const name = data.get("name")?.toString().trim() ?? "";
  const organization = data.get("organization")?.toString().trim() ?? "";
  // Bot signal: same value for name and organization
  if (name.toLowerCase() === organization.toLowerCase()) {
    return new Response(null, { status: 200 });
  }

  const need = data.get("need")?.toString().trim() ?? "";
  // Bot signal: non-Latin scripts (Armenian, Cyrillic, Arabic, CJK…) in a French-language form
  if (/[Ѐ-ӿ԰-֏؀-ۿ一-鿿぀-ヿ]/.test(need)) {
    return new Response(null, { status: 200 });
  }

  const payload = {
    name: data.get("name")?.toString(),
    organization: data.get("organization")?.toString(),
    email: data.get("email")?.toString(),
    phone: data.get("phone")?.toString(),
    orgType: data.get("orgType")?.toString(),
    need: data.get("need")?.toString()
  };

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const port = Number(process.env.SMTP_PORT) || 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_TO,
        replyTo: payload.email,
        subject: `Nouvelle demande de démo – ${payload.organization}`,
        text: [
          `Nom : ${payload.name}`,
          `Organisation : ${payload.organization}`,
          `Email : ${payload.email}`,
          `Téléphone : ${payload.phone}`,
          `Type d'organisation : ${payload.orgType}`,
          `Besoin exprimé : ${payload.need}`
        ].join("\n")
      });
      console.log(`[contact] Email envoyé — ${payload.organization} <${payload.email}>`);
    } catch (err: any) {
      console.error("[contact] Erreur SMTP :", err?.message ?? err);
      return new Response(JSON.stringify({ error: "Erreur d'envoi" }), { status: 500 });
    }
  } else {
    console.log("[contact] SMTP non configuré — demande reçue :", payload);
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
