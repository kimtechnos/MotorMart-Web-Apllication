import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const publicUserSelect = {
  id: true,
  fullName: true,
  email: true,
  phoneNumber: true,
  role: true,
};

export const createUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;
    const hashedpassword = bcrypt.hashSync(password, 10);
    await prisma.user.create({
      data: {
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        password: hashedpassword,
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
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: "admin",
        },
      },
      select: publicUserSelect,
    });
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
export const getSingleuser = async (req, res) => {
  const id = req.params.id;
  try {
    const getSingleuser = await prisma.user.findUnique({
      where: { id: id },
      select: publicUserSelect,
    });
    res.status(200).json(getSingleuser);
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
      select: publicUserSelect,
    });
    res.status(200).json(deleteUser);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
export const updateUser = async (req, res) => {
  const id = req.params.id;

  if (!req.user?.id || req.user.id !== id) {
    return res
      .status(403)
      .json({ success: false, message: "You can only update your own account" });
  }

  try {
    const { fullName, email, phoneNumber, password } = req.body;

    const updateData = {
      fullName,
      email,
      phoneNumber,
    };

    if (password) {
      updateData.password = bcrypt.hashSync(password, 10);
    }
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: updateData,
      select: publicUserSelect,
    });

    res.json({ success: true, data: updatedUser });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
