import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const validateInquiryInformation = async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return res
      .status(400)
      .json({ success: false, message: " message  is required" });
  }

  next();
};
