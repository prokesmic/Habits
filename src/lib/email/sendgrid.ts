import sgMail from "@sendgrid/mail";

export function configureSendGrid(apiKey?: string) {
  const key = apiKey ?? process.env.SENDGRID_API_KEY;
  if (key) {
    sgMail.setApiKey(key);
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
  await sgMail.send({
    to,
    from: "team@habittracker.app",
    subject,
    html,
  });
}


