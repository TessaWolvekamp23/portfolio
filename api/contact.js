/**
 * Transactional Contact Email API Handler
 * Recipient: tessa.wolvekamp@outlook.com
 * Supports: Resend API (recommended) and transactional email providers
 */

function loadEnvFile() {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}

loadEnvFile();

async function handleContactRequest(reqBody) {
  const { name, email, subject, message } = reqBody || {};

  // 1. Validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    return { status: 400, data: { success: false, error: 'Please enter your name.' } };
  }
  if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    return { status: 400, data: { success: false, error: 'Please enter a valid email address.' } };
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return { status: 400, data: { success: false, error: 'Please enter a message.' } };
  }

  const recipient = process.env.CONTACT_EMAIL || 'tessa.wolvekamp@outlook.com';
  const apiKey = process.env.EMAIL_SERVICE_API_KEY || process.env.RESEND_API_KEY;
  const sender = process.env.SENDER_EMAIL || 'Tessa Portfolio <onboarding@resend.dev>';
  const subjectCategory = subject && subject.trim() ? subject.trim() : 'General Inquiry';
  const submissionDate = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Amsterdam', dateStyle: 'full', timeStyle: 'short' });

  // 2. Check for configured service credentials
  if (!apiKey) {
    console.error('Contact Form Error: Neither RESEND_API_KEY nor EMAIL_SERVICE_API_KEY is configured in environment.');
    return {
      status: 503,
      data: {
        success: false,
        error: 'Email service is not yet configured. Please set the RESEND_API_KEY or EMAIL_SERVICE_API_KEY environment variable.'
      }
    };
  }

  // 3. Construct Email Payload
  const emailSubject = `[Portfolio Contact] ${subjectCategory} from ${name.trim()}`;
  
  const textContent = `New message from Tessa Wolvekamp Portfolio Contact Form:

From: ${name.trim()} (${email.trim()})
Subject Category: ${subjectCategory}
Date / Time: ${submissionDate}

Message:
--------------------------------------------------
${message.trim()}
--------------------------------------------------

Reply directly to this email to respond to ${name.trim()}.`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #202419; line-height: 1.6; border: 1px solid #e1b4b8; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #d55566; color: #ffffff; padding: 1.5rem 2rem;">
        <h2 style="margin: 0; font-size: 1.4rem;">New Portfolio Contact Message</h2>
        <p style="margin: 0.3rem 0 0; font-size: 0.9rem; opacity: 0.9;">Tessa Wolvekamp • Portfolio Website</p>
      </div>
      <div style="padding: 2rem; background-color: #fdfbf7;">
        <table style="width: 100%; margin-bottom: 1.5rem; border-collapse: collapse;">
          <tr>
            <td style="padding: 0.5rem 0; font-weight: bold; width: 140px; color: #4e5d3e;">Visitor Name:</td>
            <td style="padding: 0.5rem 0;">${name.trim()}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem 0; font-weight: bold; color: #4e5d3e;">Visitor Email:</td>
            <td style="padding: 0.5rem 0;"><a href="mailto:${email.trim()}" style="color: #d55566;">${email.trim()}</a></td>
          </tr>
          <tr>
            <td style="padding: 0.5rem 0; font-weight: bold; color: #4e5d3e;">Topic / Subject:</td>
            <td style="padding: 0.5rem 0;">${subjectCategory}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem 0; font-weight: bold; color: #4e5d3e;">Submitted At:</td>
            <td style="padding: 0.5rem 0; color: #6b6e65;">${submissionDate}</td>
          </tr>
        </table>
        
        <div style="background-color: #ffffff; border: 1px solid #e1b4b8; border-radius: 8px; padding: 1.25rem; margin-top: 1rem;">
          <h4 style="margin: 0 0 0.75rem; color: #202419; font-size: 1rem;">Message:</h4>
          <p style="margin: 0; white-space: pre-wrap; font-size: 0.95rem; color: #333333;">${message.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>

        <p style="margin-top: 2rem; font-size: 0.85rem; color: #6b6e65; border-top: 1px solid #eee; padding-top: 1rem;">
          💡 You can press <strong>Reply</strong> in your email client to reply directly to <strong>${email.trim()}</strong>.
        </p>
      </div>
    </div>
  `;

  // 4. Send via Resend Transactional API
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email.trim(),
        subject: emailSubject,
        html: htmlContent,
        text: textContent
      })
    });

    const data = await response.json();

    if (response.ok) {
      return { status: 200, data: { success: true, message: 'Thanks! Your message has been sent.', id: data.id } };
    } else {
      console.error('Resend API error:', data);
      return {
        status: response.status || 500,
        data: { success: false, error: data.message || 'Email delivery failed. Please try again later.' }
      };
    }
  } catch (err) {
    console.error('Network error during email dispatch:', err);
    return {
      status: 500,
      data: { success: false, error: 'Network error communicating with the email service. Please try again.' }
    };
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) {}
  }

  const result = await handleContactRequest(body);
  return res.status(result.status).json(result.data);
};

module.exports.handleContactRequest = handleContactRequest;
