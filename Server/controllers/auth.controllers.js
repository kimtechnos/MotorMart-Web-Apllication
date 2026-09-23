import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const client = new PrismaClient();
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function sessionCookieOptions() {
  const production = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: production,
    sameSite: production ? "none" : "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS,
  };
}

export const session = (req, res) => {
  const { iat, exp, ...user } = req.user || {};
  res.json({ success: true, data: user });
};

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
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
      res
        .cookie("access_token", token, sessionCookieOptions())
        .json({ success: true, data: payload });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid login credentials" });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
