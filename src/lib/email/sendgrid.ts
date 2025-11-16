// TODO: Install @sendgrid/mail package when SendGrid is needed
// import sgMail from "@sendgrid/mail";

export function configureSendGrid(apiKey?: string) {
  const key = apiKey ?? process.env.SENDGRID_API_KEY;
  if (key && process.env.NODE_ENV === "development") {
    console.warn("[SendGrid] Configured but package not installed.");
  }
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SENDGRID_API_KEY) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("[DEV] Email (not sent):", { to, subject });
      return;
    }
    throw new Error("SENDGRID_API_KEY not configured");
  }
  // Placeholder: In production, would use SendGrid
  // eslint-disable-next-line no-console
  console.log("[SendGrid] Would send email:", { to, subject, htmlLength: html.length });
}


