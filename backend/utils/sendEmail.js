import { Resend } from "resend";

const sendEmail = async (options) => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    const err = new Error("RESEND_API_KEY must be configured");
    err.statusCode = 503;
    throw err;
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL?.trim() ||
        "Victony School <onboarding@resend.dev>",
      to: [options.to],
      replyTo: options.replyTo || process.env.CONTACT_EMAIL,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      const resendError = new Error(error.message || "Resend email failed");
      resendError.statusCode = 502;
      throw resendError;
    }

    return data;
  } catch (error) {
    console.error("Email delivery failed:", error.message);
    throw error;
  }
};

export default sendEmail;
