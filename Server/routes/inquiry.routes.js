import { Router } from "express";

import {
  createInquiry,
  getAllInquiries,
  getMyInquiries,
} from "../controllers/inquiry.controllers.js";
import verifyToken from "../middlewares/verifyToken.middleware.js";
import verifyAdmin from "../middlewares/verifyadmin.js";
import { validateInquiryInformation } from "../middlewares/inquiry.middleware.js";
const router = Router();

router.post("/", validateInquiryInformation, verifyToken, createInquiry);
router.get("/mine", verifyToken, getMyInquiries);
router.get("/", verifyAdmin, getAllInquiries);
export default router;
