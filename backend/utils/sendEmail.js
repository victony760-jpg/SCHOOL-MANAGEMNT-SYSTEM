import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();

  if (!emailUser || !emailPass) {
    const err = new Error("EMAIL_USER and EMAIL_PASS must be configured");
    err.statusCode = 503;
    throw err;
  }

  console.log("✅ NODEMAILER CODE RUNNING");

  try {
    // 1. Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser, // your gmail
        pass: emailPass, // 16-char App Password, not your gmail password
      },
    });

    // 2. Define email options
    const mailOptions = {
      from: `Victony School <${emailUser}>`,
      to: options.to,
      replyTo: options.replyTo || process.env.CONTACT_EMAIL,
      subject: options.subject,
      html: options.html,
    };

    // 3. Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ EMAIL SENT:", info.messageId);
    return { id: info.messageId, ...info }; // return similar to Resend so your controller doesn't break
  } catch (error) {
    console.error("Email delivery failed:", error.message);
    const emailError = new Error(error.message || "Nodemailer email failed");
    emailError.statusCode = 502;
    throw emailError;
  }
};

export default sendEmail;
