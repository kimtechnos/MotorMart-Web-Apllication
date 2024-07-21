import { Router } from "express";
import verifyAdmin from "../middlewares/verifyadmin.js";
import {
  createCar,
  updatecar,
  deletecar,
  getAllcars,
  getSingleCar,
} from "../controllers/cars.controllers.js";

const router = Router();

router.post("/add", verifyAdmin, createCar);
router.get("/", getAllcars);
router.get("/:id", getSingleCar);
router.patch("/:id", verifyAdmin, updatecar);
router.delete("/:id", verifyAdmin, deletecar);

export default router;
