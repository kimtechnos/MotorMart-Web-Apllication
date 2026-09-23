import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createContactMessage = async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const subject = String(req.body.subject || "").trim();
  const message = String(req.body.message || "").trim();

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Name, email, and message are required" });
  }

  if (!emailPattern.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a valid email address" });
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
      },
    });

    res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Unable to send message" });
  }
};
