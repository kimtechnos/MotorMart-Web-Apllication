import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const client = new PrismaClient();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await client.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid login credentials" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (passwordMatch) {
      const payload = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      res.cookie("access_token", token).json({ success: true, data: payload });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid login credentials" });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
