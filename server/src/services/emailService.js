import nodemailer from "nodemailer";

/**
 * Creates and returns a configured nodemailer transporter
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

  // Fallback: If no SMTP credentials, return null so we log nicely
  return null;
}

/**
 * Sends an email notification whenever a user submits feedback
 */
export async function sendFeedbackEmail({
  type = "suggestion",
  message = "",
  authorName = "GetHired User",
  email = "",
  pageUrl = "",
  userId = null,
}) {
  const recipientEmail =
    process.env.FEEDBACK_RECEIVER_EMAIL ||
    process.env.ADMIN_EMAIL ||
    process.env.SMTP_USER ||
    "pohh09@gethired.ai";

  const typeLabels = {
    bug: "🐛 Bug Report",
    suggestion: "💡 Feature Suggestion",
    question: "❓ Question",
    other: "💬 General Feedback",
  };

  const formattedType = typeLabels[type] || `💬 ${type.toUpperCase()}`;
  const subject = `[GetHired Feedback] ${formattedType} from ${authorName}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #0284c7, #2563eb); padding: 24px; color: #ffffff; }
          .header h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 800; }
          .header p { margin: 0; font-size: 13px; opacity: 0.9; }
          .content { padding: 24px; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; background: #eff6ff; color: #1d4ed8; margin-bottom: 16px; }
          .message-box { background: #f1f5f9; border-left: 4px solid #0284c7; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin: 16px 0; color: #0f172a; }
          .meta-table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
          .meta-table td { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
          .meta-label { color: #64748b; font-weight: 600; width: 140px; }
          .meta-value { color: #0f172a; font-weight: 500; }
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
                <td class="meta-label">Submitted By:</td>
                <td class="meta-value">${authorName} ${email ? `(&lt;${email}&gt;)` : ""}</td>
              </tr>
              ${email ? `<tr><td class="meta-label">Contact Email:</td><td class="meta-value"><a href="mailto:${email}">${email}</a></td></tr>` : ""}
              ${pageUrl ? `<tr><td class="meta-label">Submitted From Page:</td><td class="meta-value">${pageUrl}</td></tr>` : ""}
              ${userId ? `<tr><td class="meta-label">User ID:</td><td class="meta-value"><code>${userId}</code></td></tr>` : ""}
              <tr>
                <td class="meta-label">Timestamp:</td>
                <td class="meta-value">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          <div class="footer">
            Sent automatically by GetHired Feedback Service
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
=== NEW GETHIRED FEEDBACK ===
Type: ${formattedType}
From: ${authorName} ${email ? `(${email})` : ""}
Page: ${pageUrl || "N/A"}
Time: ${new Date().toLocaleString()}

Message:
${message}
============================
  `.trim();

  try {
    const transporter = getEmailTransporter();

    if (transporter) {
      const fromSender = process.env.SMTP_FROM || process.env.SMTP_USER || '"GetHired Feedback" <no-reply@gethired.ai>';
      const info = await transporter.sendMail({
        from: fromSender,
        to: recipientEmail,
        replyTo: email || undefined,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[Email Service] Feedback email sent to ${recipientEmail} (Message ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log(`[Email Service - Simulated] SMTP not configured. Feedback will be logged:`);
      console.log(`To: ${recipientEmail}\nSubject: ${subject}\n\n${textContent}`);
      return { success: true, simulated: true };
    }
  } catch (error) {
    console.error("[Email Service Error] Failed to send feedback email:", error.message);
    return { success: false, error: error.message };
  }
}
