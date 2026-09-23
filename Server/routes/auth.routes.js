import { Router } from "express";
import { login, session, sessionCookieOptions } from "../controllers/auth.controllers.js";
import verifyToken from "../middlewares/verifyToken.middleware.js";
const router = Router();

router.post("/login", login);
router.get("/session", verifyToken, session);
router.post("/logout", (req, res) => {
  res.clearCookie("access_token", sessionCookieOptions());
  return res.json({ success: true, message: "Logout successful" });
});
export default router;
