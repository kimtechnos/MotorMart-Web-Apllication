import { Router } from "express";
import {
  createUser,
  getAllusers,
  deleteUser,
  getSingleuser,
  updateUser,
} from "../controllers/users.controllers.js";
import { validateUserInformation } from "../middlewares/user.middleware.js";
import verifyAdmin from "../middlewares/verifyadmin.js";
import verifyToken from "../middlewares/verifyToken.middleware.js";

const router = Router();

router.post("/register", validateUserInformation, createUser);
router.get("/", verifyAdmin, getAllusers);
router.patch("/update/:id", verifyToken, updateUser);
router.get("/:id", verifyAdmin, getSingleuser);
router.delete("/:id", verifyAdmin, deleteUser);

export default router;
