import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

  if (!emailUser || !emailPass) {
    const err = new Error("EMAIL_USER and EMAIL_PASS must be configured");
    err.statusCode = 503;
    throw err;
  }

  // 1. Create transporter - FIXED FOR RENDER
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // don't use "service: gmail" on Render. It forces IPv6
    port: 465,
    secure: true, // true for 465
    family: 4, // <-- THIS IS THE MAIN FIX. Forces IPv4. Stops ENETUNREACH
    auth: {
      user: emailUser,
      pass: emailPass, // MUST be Gmail App Password, not login password
    },
    connectionTimeout: 20000, // 20s
    greetingTimeout: 20000,
    socketTimeout: 20000,
  });

  // 2. Define email options
  const mailOptions = {
    from: `"Victony School" <${emailUser}>`,
    to: options.to,
    replyTo: options.replyTo || emailUser,
    subject: options.subject,
    html: options.html,
  };

  // 3. Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.log("EMAIL ERROR:", error.message);
    throw error; // so we can catch it in the route
  }
};

export default sendEmail;
