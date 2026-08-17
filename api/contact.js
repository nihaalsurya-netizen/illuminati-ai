const { Resend } = require('resend');

/* Vercel serverless function — contact form handler.

   Replaces Netlify Forms (data-netlify="true"), which has no Vercel equivalent.
   Emails every submission to OWNER_EMAIL via Resend and sends the sender an
   acknowledgement. Honeypot field ("bot-field") silently drops bot submissions. */

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    // Honeypot — bots fill hidden fields, humans don't. Return 200 so the bot
    // thinks it succeeded and doesn't retry.
    if ((body['bot-field'] || '').trim()) {
      console.log('Honeypot triggered — dropping submission');
      return res.status(200).json({ ok: true });
    }

    const fullName = (body['full-name'] || '').trim();
    const email    = (body.email || '').trim();
    const phone    = (body.phone || '').trim();
    const company  = (body.company || '').trim();
    const interest = (body.interest || '').trim();
    const budget   = (body.budget || '').trim();
    const message  = (body.message || '').trim();
    const referral = (body.referral || '').trim();

    // Validate required fields
    if (fullName.length < 2) {
      return res.status(400).json({ error: 'Full name is required', field: 'full-name' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required', field: 'email' });
    }
    if (phone.replace(/\D/g, '').length < 10) {
      return res.status(400).json({ error: 'A valid phone number is required', field: 'phone' });
    }
    if (!interest) {
      return res.status(400).json({ error: 'Please select what you are interested in', field: 'interest' });
    }
    if (message.length < 10) {
      return res.status(400).json({ error: 'Please tell us a bit more about your project', field: 'message' });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not set — cannot send contact email');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const ownerEmail = process.env.OWNER_EMAIL || 'illuminati.ai@illuminatiai.tech';

    const istDateTime = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const sendOwnerEmail = () => resend.emails.send({
      from: 'Illuminati AI Website <contact@illuminatiai.tech>',
      to: ownerEmail,
      replyTo: email,
      subject: `New Enquiry: ${interest} — ${fullName}`,
      html: ownerEmailHtml({
        fullName, email, phone, company, interest, budget, message, referral, istDateTime
      })
    });

    const sendAckEmail = () => resend.emails.send({
      from: 'Illuminati AI <contact@illuminatiai.tech>',
      to: email,
      replyTo: 'illuminati.ai@illuminatiai.tech',
      subject: 'We received your message — Illuminati AI',
      html: ackEmailHtml({ fullName, interest })
    });

    // Owner email is the one that must land. Acknowledgement is best-effort.
    const results = await Promise.allSettled([sendOwnerEmail(), sendAckEmail()]);

    const ownerResult = results[0];
    const ownerFailed =
      ownerResult.status === 'rejected' ||
      (ownerResult.value && ownerResult.value.error);

    if (ownerFailed) {
      const reason = ownerResult.status === 'rejected'
        ? (ownerResult.reason && ownerResult.reason.message)
        : JSON.stringify(ownerResult.value.error);
      console.error('Contact form — owner email failed:', reason);
      return res.status(500).json({ error: 'Could not send your message. Please email us directly.' });
    }

    if (results[1].status === 'rejected' || (results[1].value && results[1].value.error)) {
      console.warn('Contact form — acknowledgement email failed (non-fatal)');
    }

    console.log(`Contact form submission from ${fullName} <${email}> — interest: ${interest}`);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact form error:', error && error.message);
    return res.status(500).json({ error: 'Something went wrong. Please email us directly.' });
  }
};

// ── Email HTML templates ──────────────────────────────────────────────────────

function ownerEmailHtml({ fullName, email, phone, company, interest, budget, message, referral, istDateTime }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Website Enquiry</title></head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(20,20,40,0.08);">
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#D4A437 0%,#E0B958 100%);padding:28px 24px;color:#0a0a0a;">
              <div style="font-size:13px;letter-spacing:0.24em;text-transform:uppercase;font-weight:600;">New Website Enquiry</div>
              <div style="margin-top:10px;font-size:26px;font-weight:800;">${escapeHtml(fullName)}</div>
              <div style="margin-top:4px;font-size:14px;opacity:0.85;">${escapeHtml(interest)}</div>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 4px;">
              <div style="font-size:11px;letter-spacing:0.18em;color:#8a8a8a;text-transform:uppercase;margin-bottom:10px;">Contact</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;color:#1a1a1a;">
                ${row('Name', escapeHtml(fullName))}
                ${row('Email', `<a href="mailto:${escapeAttr(email)}" style="color:#0a66c2;text-decoration:none;">${escapeHtml(email)}</a>`)}
                ${row('Phone', `<a href="tel:${escapeAttr(phone.replace(/\s/g, ''))}" style="color:#0a66c2;text-decoration:none;">${escapeHtml(phone)}</a>`)}
                ${row('Company', escapeHtml(company || '—'), true)}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 4px;">
              <div style="font-size:11px;letter-spacing:0.18em;color:#8a8a8a;text-transform:uppercase;margin-bottom:10px;">Enquiry</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;color:#1a1a1a;">
                ${row('Interested in', `<strong>${escapeHtml(interest)}</strong>`)}
                ${row('Budget', escapeHtml(budget || '—'))}
                ${row('Heard via', escapeHtml(referral || '—'))}
                ${row('Received (IST)', escapeHtml(istDateTime), true)}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 8px;">
              <div style="font-size:11px;letter-spacing:0.18em;color:#8a8a8a;text-transform:uppercase;margin-bottom:10px;">Message</div>
              <div style="background:#f8f8fb;border-left:3px solid #D4A437;border-radius:6px;padding:16px 18px;font-size:14px;line-height:1.65;color:#2a2a2a;white-space:pre-wrap;">${escapeHtml(message)}</div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:24px 32px 36px;">
              <a href="mailto:${escapeAttr(email)}"
                 style="display:inline-block;padding:13px 28px;background:#1a1a1a;color:#D4A437;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;letter-spacing:0.06em;">
                Reply to ${escapeHtml(fullName.split(' ')[0])} &rarr;
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-size:11px;color:#8a8a8a;letter-spacing:0.06em;">Illuminati AI · contact form</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ackEmailHtml({ fullName, interest }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>We received your message</title></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;color:#e8e8e8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#131313;border:1px solid rgba(212,164,55,0.25);border-radius:12px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:36px 32px 24px;border-bottom:1px solid rgba(212,164,55,0.15);">
              <div style="font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:700;letter-spacing:0.08em;color:#D4A437;">ILLUMINATI AI</div>
              <div style="margin-top:6px;font-size:11px;letter-spacing:0.24em;color:rgba(232,232,232,0.55);text-transform:uppercase;">Message Received</div>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 32px 8px;">
              <h1 style="margin:0 0 12px;font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:30px;color:#ffffff;line-height:1.2;">
                Thank you, ${escapeHtml(fullName.split(' ')[0])}.
              </h1>
              <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:rgba(232,232,232,0.78);">
                We've received your enquiry about <strong style="color:#D4A437;">${escapeHtml(interest)}</strong> and will get back to you within one business day.
              </p>
              <p style="margin:0;font-size:15px;line-height:1.65;color:rgba(232,232,232,0.78);">
                In the meantime, feel free to reply to this email if you'd like to add anything.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:36px 32px;border-top:1px solid rgba(212,164,55,0.12);">
              <p style="margin:0 0 6px;font-size:12px;color:rgba(232,232,232,0.55);">
                <a href="mailto:illuminati.ai@illuminatiai.tech" style="color:#D4A437;text-decoration:none;">illuminati.ai@illuminatiai.tech</a>
                &nbsp;·&nbsp;
                <a href="tel:+919326294784" style="color:#D4A437;text-decoration:none;">+91 93262 94784</a>
              </p>
              <p style="margin:0;font-size:11px;color:rgba(232,232,232,0.4);letter-spacing:0.08em;">
                Illuminati AI · Mumbai, India
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function row(label, value, last) {
  const borderStyle = last ? '' : 'border-bottom:1px solid #ececf2;';
  return `
    <tr>
      <td style="padding:10px 0;${borderStyle}">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="color:#8a8a8a;width:34%;">${label}</td>
            <td align="right" style="color:#1a1a1a;">${value}</td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  return String(str == null ? '' : str).replace(/"/g, '%22');
}
