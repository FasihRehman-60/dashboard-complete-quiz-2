import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/contact", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const formattedMessage = `
      📩 New Contact Form Submission

      🧑 Name: ${name}
      📧 Email: ${email}
      📞 Phone: ${phone || "Not provided"}
      📝 Subject: ${subject || "No subject"}

      💬 Message:
      ${message}
    `;

    await transporter.sendMail({
      from: process.env.EMAIL,
      replyTo: email,
      to: process.env.EMAIL,
      subject: `Contact Form — ${subject || "New Inquiry"} from ${name}`,
      text: formattedMessage,
    });

    res.status(200).json({ message: "Message sent successfully!" });

  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ message: "Failed to send message." });
  }
});

export default router;
