import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const validateCarsInformation = async (req, res, next) => {
  const { make, model, year, price, description, imageUrl } = req.body;

  if (!make) {
    return res
      .status(400)
      .json({ success: false, message: "Make is required" });
  }
  if (!model) {
    return res
      .status(400)
      .json({ success: false, message: "Model is required" });
  }
  if (!year) {
    return res
      .status(400)
      .json({ success: false, message: "Year is required" });
  }
  if (!price) {
    return res
      .status(400)
      .json({ success: false, message: "Price is required" });
  }
  if (!description) {
    return res
      .status(400)
      .json({ success: false, message: "Description is required" });
  }
  if (!imageUrl) {
    return res
      .status(400)
      .json({ success: false, message: "Image URL is required" });
  }

  const yearInt = parseInt(year, 10);
  if (isNaN(yearInt)) {
    return res
      .status(400)
      .json({ success: false, message: "Year must be a valid number" });
  }

  // Check for existing car
  const existingCar = await prisma.car.findFirst({
    where: {
      make: make,
      model: model,
      year: yearInt,
    },
  });

  if (existingCar) {
    return res
      .status(400)
      .json({ success: false, message: "Car already exists" });
  }

  next();
};
