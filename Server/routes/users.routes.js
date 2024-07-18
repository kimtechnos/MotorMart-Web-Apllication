import { Router } from "express";
import {
  createUser,
  getAllusers,
  deleteUser,
} from "../controllers/users.controllers.js";
import { validateUserInformation } from "../middlewares/user.middleware.js";
import verifyAdmin from "../middlewares/verifyadmin.js";

const router = Router();

router.post("/register", validateUserInformation, createUser);
router.get("/", verifyAdmin, getAllusers);
router.delete("/:id", verifyAdmin, deleteUser);

export default router;
