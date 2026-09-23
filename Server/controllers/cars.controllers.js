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
    const yearInt = Number.parseInt(year, 10);
    const priceNumber = Number.parseFloat(price);
    if (Number.isNaN(yearInt) || Number.isNaN(priceNumber)) {
      return res
        .status(400)
        .json({ success: false, message: "Year and price must be numbers" });
    }

    const updatedCar = await prisma.car.update({
      where: { id: id },
      data: {
        make,
        model,
        year: yearInt,
        price: priceNumber,
        description,
        imageUrl,
      },
    });

    res.json({ success: true, data: updatedCar });
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    res.status(500).json({ success: false, message: "Unable to update vehicle" });
  }
};
export const getAllcars = async (req, res) => {
  try {
    const where = {};
    if (req.query.make) {
      where.make = { contains: String(req.query.make), mode: "insensitive" };
    }
    if (req.query.model) {
      where.model = { contains: String(req.query.model), mode: "insensitive" };
    }
    if (req.query.year) {
      const year = Number.parseInt(req.query.year, 10);
      if (!Number.isNaN(year)) {
        where.year = year;
      }
    }
    if (req.query.maxPrice) {
      const maxPrice = Number.parseFloat(req.query.maxPrice);
      if (!Number.isNaN(maxPrice)) {
        where.price = { lte: maxPrice };
      }
    }

    const cars = await prisma.car.findMany({
      where,
      orderBy: [{ make: "asc" }, { model: "asc" }],
    });
    res.status(200).json(cars);
  } catch (e) {
    res.status(500).json({ success: false, message: "Unable to load vehicles" });
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
    res.status(500).json({ success: false, message: "Unable to load vehicle" });
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
    if (e.code === "P2025") {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    res.status(500).json({ success: false, message: "Unable to delete vehicle" });
  }
};
