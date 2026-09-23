import { Router } from "express";
import {
  createContactMessage,
  getContactMessages,
} from "../controllers/contact.controllers.js";
import verifyAdmin from "../middlewares/verifyadmin.js";

const router = Router();

router.post("/", createContactMessage);
router.get("/", verifyAdmin, getContactMessages);

export default router;
