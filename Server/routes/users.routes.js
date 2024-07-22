import { Router } from "express";
import {
  createUser,
  getAllusers,
  deleteUser,
  getSingleuser,
} from "../controllers/users.controllers.js";
import { validateUserInformation } from "../middlewares/user.middleware.js";
import verifyAdmin from "../middlewares/verifyadmin.js";

const router = Router();

router.post("/register", validateUserInformation, createUser);
router.get("/", verifyAdmin, getAllusers);
router.get("/:id", verifyAdmin, getSingleuser);
router.delete("/:id", verifyAdmin, deleteUser);

export default router;
