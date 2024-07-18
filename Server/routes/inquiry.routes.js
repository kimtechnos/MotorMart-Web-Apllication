import { Router } from "express";

import { createInquiry } from "../controllers/inquiry.controllers.js";
import verifyToken from "../middlewares/verifyToken.middleware.js";
import verifyAdmin from "../middlewares/verifyadmin.js";
import { getAllInquiries } from "../controllers/inquiry.controllers.js";
const router = Router();

router.post("/", verifyToken, createInquiry);
router.get("/", verifyAdmin, getAllInquiries);
export default router;
