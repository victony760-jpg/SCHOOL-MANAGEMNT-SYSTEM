import Submission from "../models/submission.js";
import { success, error } from "../utils/response.js";
import sendEmail from "../utils/sendEmail.js";

export const submitContact = async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    const submission = await Submission.create({
      type: "contact",
      fullName,
      email,
      phone,
      subject,
      message,
    });

    await sendEmail({
      to: process.env.CONTACT_EMAIL || "victony760@gmail.com",
      replyTo: email,
      subject: subject || `Website message from ${fullName}`,
      html: `
        <h2>New website contact message</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Subject:</strong> ${subject || "General enquiry"}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });
    return success(res, submission, "Message sent successfully", 201);
  } catch (err) {
    return error(res, err.message);
  }
};

export const getContacts = async (req, res) => {
  try {
    const submissions = await Submission.find({ type: "contact" }).sort({
      createdAt: -1,
    });
    return success(res, submissions);
  } catch (err) {
    return error(res, err.message);
  }
};
