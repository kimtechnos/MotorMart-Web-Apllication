import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCar = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const ownerId = req.user.id;
    const { make, model, year, price, description, imageUrl } = req.body;
    const yearInt = parseInt(year, 10);
    if (isNaN(yearInt)) {
      return res
        .status(400)
        .json({ success: false, message: "invalid year provided" });
    }

    console.log("Received request to create car with data:", req.body);

    // Create new car
    await prisma.car.create({
      data: {
        make: make,
        model: model,
        year: yearInt,
        price: parseFloat(price),
        description: description,
        imageUrl: imageUrl,
        ownerId: ownerId,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Car created successfully" });
  } catch (e) {
    console.error("Error creating car:", e.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updatecar = async (req, res) => {
  const id = req.params.id;

  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { make, model, year, price, description, imageUrl } = req.body;

    const updatedCar = await prisma.car.update({
      where: { id: id },
      data: {
        make,
        model,
        year,
        price,
        description,
        imageUrl,
      },
    });

    res.json({ success: true, data: updatedCar });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
export const getAllcars = async (req, res) => {
  try {
    const users = await prisma.car.findMany();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getSingleCar = async (req, res) => {
  const id = req.params.id;
  try {
    const car = await prisma.car.findUnique({
      where: { id: id },
    });

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    res.status(200).json(car);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const deletecar = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    await prisma.inquiry.deleteMany({
      where: { carId: id },
    });

    const deletedCar = await prisma.car.delete({
      where: { id },
    });

    res.status(200).json({ success: true, data: deletedCar });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
