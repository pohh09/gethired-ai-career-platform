import nodemailer from "nodemailer";
import { Resend } from "resend";

const DEFAULT_RECEIVER_EMAIL = "poojadaki09@gmail.com";

/**
 * Creates and returns a configured nodemailer transporter if SMTP credentials are provided
 */
function getEmailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;
  const service = process.env.EMAIL_SERVICE; // e.g. "gmail"

  if (service && user && pass) {
    return nodemailer.createTransport({
      service,
      auth: { user, pass },
    });
  }

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return null;
}

/**
 * Formats a clean category label from the feedback type
 */
function formatFeedbackType(type = "suggestion") {
  const typeMap = {
    bug: "Bug Report",
    suggestion: "Feature Suggestion",
    question: "Question",
    other: "General Feedback",
  };
  return typeMap[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Sends an email notification whenever a user submits feedback
 */
export async function sendFeedbackEmail({
  type = "suggestion",
  message = "",
  authorName = "Anonymous User",
  email = "",
  pageUrl = "",
  userId = null,
}) {
  const recipientEmail =
    process.env.FEEDBACK_RECEIVER_EMAIL ||
    process.env.ADMIN_EMAIL ||
    DEFAULT_RECEIVER_EMAIL;

  const formattedType = formatFeedbackType(type);
  const submissionTime = new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  });

  // Subject as requested: GetHired Feedback — [Feedback Type]
  const subject = `GetHired Feedback — ${formattedType}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 24px 12px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08); }
          .header { background: linear-gradient(135deg, #0284c7, #2563eb); padding: 28px 24px; color: #ffffff; }
          .header h2 { margin: 0 0 6px 0; font-size: 22px; font-weight: 800; }
          .header p { margin: 0; font-size: 13px; opacity: 0.92; }
          .content { padding: 24px; }
          .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 800; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
          .message-box { background: #f8fafc; border-left: 4px solid #0284c7; padding: 18px; border-radius: 8px; font-size: 15px; line-height: 1.65; white-space: pre-wrap; margin: 16px 0; color: #0f172a; border-top: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
          .meta-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
          .meta-table td { padding: 10px 4px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
          .meta-label { color: #64748b; font-weight: 600; width: 150px; }
          .meta-value { color: #0f172a; font-weight: 500; word-break: break-word; }
          .footer { background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🚀 New User Feedback Received</h2>
            <p>GetHired AI Career Platform</p>
          </div>
          <div class="content">
            <span class="badge">${formattedType}</span>
            <div class="message-box">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
            <table class="meta-table">
              <tr>
                <td class="meta-label">User Name:</td>
                <td class="meta-value">${authorName || "Anonymous"}</td>
              </tr>
              <tr>
                <td class="meta-label">User Email:</td>
                <td class="meta-value">${email ? `<a href="mailto:${email}">${email}</a>` : "Not provided"}</td>
              </tr>
              <tr>
                <td class="meta-label">Feedback Type:</td>
                <td class="meta-value"><strong>${formattedType}</strong></td>
              </tr>
              <tr>
                <td class="meta-label">Submission Date/Time:</td>
                <td class="meta-value">${submissionTime}</td>
              </tr>
              ${userId ? `<tr><td class="meta-label">User ID:</td><td class="meta-value"><code>${userId}</code></td></tr>` : ""}
              ${pageUrl ? `<tr><td class="meta-label">Submitted From:</td><td class="meta-value">${pageUrl}</td></tr>` : ""}
            </table>
          </div>
          <div class="footer">
            Delivered to ${recipientEmail} via GetHired Feedback Service
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
GetHired Feedback — ${formattedType}
==================================================

User Name:            ${authorName || "Anonymous"}
User Email:           ${email || "Not provided"}
Feedback Type:        ${formattedType}
Submission Date/Time: ${submissionTime}
${userId ? `User ID:              ${userId}\n` : ""}${pageUrl ? `Submitted From Page:  ${pageUrl}\n` : ""}
--------------------------------------------------
Feedback Message:
${message}
==================================================
  `.trim();

  // 1. Try Resend if RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail =
        process.env.RESEND_FROM ||
        process.env.SMTP_FROM ||
        "GetHired Feedback <onboarding@resend.dev>";

      const resendResponse = await resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        replyTo: email && email.includes("@") ? email : undefined,
        subject,
        text: textContent,
        html: htmlContent,
      });

      if (resendResponse.error) {
        console.warn("[Email Service - Resend Error]:", resendResponse.error);
      } else {
        console.log(
          `[Email Service - Resend] Feedback email delivered to ${recipientEmail} (ID: ${resendResponse.data?.id})`
        );
        return { success: true, messageId: resendResponse.data?.id, provider: "resend" };
      }
    } catch (resendErr) {
      console.warn("[Email Service - Resend Exception]:", resendErr.message);
    }
  }

  // 2. Try Nodemailer if SMTP / Gmail credentials are configured
  const transporter = getEmailTransporter();
  if (transporter) {
    try {
      const fromSender =
        process.env.SMTP_FROM ||
        process.env.SMTP_USER ||
        '"GetHired Feedback" <no-reply@gethired.ai>';

      const info = await transporter.sendMail({
        from: fromSender,
        to: recipientEmail,
        replyTo: email && email.includes("@") ? email : undefined,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(
        `[Email Service - SMTP] Feedback email delivered to ${recipientEmail} (Message ID: ${info.messageId})`
      );
      return { success: true, messageId: info.messageId, provider: "smtp" };
    } catch (smtpErr) {
      console.warn("[Email Service - SMTP Error]:", smtpErr.message);
    }
  }

  // 3. Fallback: Log full feedback payload when no live email credentials are set in environment
  console.log(`[Email Service - Local Logging] Feedback queued for ${recipientEmail}:`);
  console.log(textContent);

  return { success: true, simulated: true };
}
