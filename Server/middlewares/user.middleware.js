import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

export const validateUserInformation = async (req, res, next) => {
  const { fullName, email, phoneNumber, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ success: false, message: "fullName is required" });
  }
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "email is required" });
  }
  if (!phoneNumber) {
    return res
      .status(400)
      .json({ success: false, message: "phoneNumber is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "password is required" });
  }

  const userWithPhoneNumber = await client.user.findFirst({
    where: { phoneNumber: phoneNumber },
  });

  if (userWithPhoneNumber) {
    return res
      .status(400)
      .json({ success: false, message: "phone number already taken" });
  }

  const userWithEmail = await client.user.findFirst({
    where: { email: email },
  });

  if (userWithEmail) {
    return res
      .status(400)
      .json({ success: false, message: "email already taken" });
  }

  next();
};
