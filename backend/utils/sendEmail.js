import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

  if (!emailUser || !emailPass) {
    const err = new Error("EMAIL_USER and EMAIL_PASS must be configured");
    err.statusCode = 503;
    throw err;
  }

  console.log("✅ NODEMAILER CODE RUNNING");

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      family: 4,
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: `Victony School <${emailUser}>`,
      to: options.to,
      replyTo: options.replyTo || process.env.CONTACT_EMAIL,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ EMAIL SENT:", info.messageId);
    return { id: info.messageId, ...info };
  } catch (error) {
    console.error("Email delivery failed:", error.message);
    const emailError = new Error(error.message || "Nodemailer email failed");
    emailError.statusCode = 502;
    throw emailError;
  }
};

export default sendEmail;
