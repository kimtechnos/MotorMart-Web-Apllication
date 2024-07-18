import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";


const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    const hashedpassword = bcrypt.hashSync(password, 10);
    await prisma.user.create({
      data: {
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        password: hashedpassword,
        // role:role
      },
    });
    res
      .status(201)
      .json({ success: true, message: "user registered successfully" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getAllusers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
export const deleteUser = async (req, res) => {
  // res.send("delete user")
  const id = req.params.id;
  try {
    const deleteUser = await prisma.user.delete({
      where: { id: id },
    });
    res.status(200).json(deleteUser);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
