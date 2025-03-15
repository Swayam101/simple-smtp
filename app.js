import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
console.log("process env emai   : ", process.env.EMAIL);

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.post("/send-email", async (req, res) => {
  const { to, subject, from, html, caseId, workerName } = req.body;

  if (!to || !subject || !from) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      html,
      caseId,
      workerName,
    });
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending email", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`SMTP Server running on port ${PORT}`);
});
