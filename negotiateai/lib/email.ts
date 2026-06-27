/**
 * Sends the access code to the buyer via Resend (https://resend.com).
 * Uses the REST API directly so there's no extra dependency to install.
 */

export async function sendCodeEmail(to: string, code: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");

  const from = process.env.EMAIL_FROM || "NegotiateAI <onboarding@resend.dev>";
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://negotiateai.app";

  const subject = "Your NegotiateAI access code";
  const text = `Thanks for your purchase!

Your access code is:

  ${code}

Open ${appUrl}, paste this code on the unlock step, and your full analysis
appears instantly. The code works once.

— NegotiateAI`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#0a0a0b;font-family:Inter,Arial,sans-serif;color:#e7e7ea;padding:32px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table role="presentation" width="100%" style="max-width:480px;background:#141416;border:1px solid #26262b;border-radius:16px;overflow:hidden">
          <tr><td style="padding:32px 32px 8px">
            <p style="margin:0;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#22c55e">NegotiateAI</p>
            <h1 style="margin:12px 0 4px;font-size:22px;color:#fff">You're all set 🎉</h1>
            <p style="margin:0;font-size:15px;line-height:1.6;color:#a1a1aa">Thanks for your purchase. Here's your single-use access code:</p>
          </td></tr>
          <tr><td style="padding:20px 32px">
            <div style="font-family:'Courier New',monospace;font-size:22px;font-weight:700;letter-spacing:2px;color:#fff;background:#0a0a0b;border:1px solid #26262b;border-radius:12px;padding:18px;text-align:center">${code}</div>
          </td></tr>
          <tr><td style="padding:0 32px 28px">
            <a href="${appUrl}" style="display:inline-block;background:#22c55e;color:#04130a;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:10px">Open NegotiateAI &amp; paste your code</a>
            <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#71717a">Paste the code on the unlock step to reveal your full analysis instantly. It works once.</p>
          </td></tr>
        </table>
        <p style="margin:18px 0 0;font-size:12px;color:#52525b">© NegotiateAI · Not financial advice</p>
      </td></tr>
    </table>
  </body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text, html }),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend error (${res.status}): ${detail}`);
  }
}
