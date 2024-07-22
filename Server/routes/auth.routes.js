import { Router } from "express";
import { login } from "../controllers/auth.controllers.js";
const router = Router();

router.post("/login", login);
router.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  return res.json({ success: true, message: "Logout successful" });
});
export default router;
