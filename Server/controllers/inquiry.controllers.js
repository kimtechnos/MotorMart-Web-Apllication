import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createInquiry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { make, model, message } = req.body;

    const car = await prisma.car.findFirst({
      where: {
        make: make,
        model: model,
      },
    });

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        userId: userId,
        carId: car.id,
        message: message,
      },
    });

    res.status(201).json({ success: true, data: inquiry });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        car: {
          select: {
            make: true,
            model: true,
          },
        },
      },
    });

    res.status(200).json({ success: true, data: inquiries });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
