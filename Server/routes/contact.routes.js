import { Router } from "express";
import { createContactMessage } from "../controllers/contact.controllers.js";

const router = Router();

router.post("/", createContactMessage);

export default router;
