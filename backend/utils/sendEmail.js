import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();
  if (!emailUser || !emailPass) {
    const err = new Error("EMAIL_USER and EMAIL_PASS must be configured");
    err.statusCode = 503;
    throw err;
  }

  // 1. Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  // 2. Define email options
  const mailOptions = {
    from: `"Victony School" <${emailUser}>`,
    to: options.to,
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
  };

  // 3. Send email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
