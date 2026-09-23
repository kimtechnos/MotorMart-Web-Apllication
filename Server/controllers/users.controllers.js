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
  const id = req.params.id;
  try {
    const [cars, inquiries] = await Promise.all([
      prisma.car.count({ where: { ownerId: id } }),
      prisma.inquiry.count({ where: { userId: id } }),
    ]);

    if (cars > 0 || inquiries > 0) {
      return res.status(409).json({
        success: false,
        message:
          "This account still has cars or inquiries and cannot be deleted",
      });
    }

    const deletedUser = await prisma.user.delete({
      where: { id: id },
      select: publicUserSelect,
    });
    res.status(200).json(deletedUser);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(500).json({ success: false, message: "Unable to delete user" });
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
