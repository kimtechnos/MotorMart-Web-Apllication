import { Router } from "express";
import { createUser } from "../controllers/users.controllers.js";
import { validateUserInformation } from "../middlewares/user.middleware.js";

const router = Router();

router.post("/register", validateUserInformation, createUser);

export default router;
