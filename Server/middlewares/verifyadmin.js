import jwt from "jsonwebtoken";

const verifyAdmin = (req, res, next) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Access token missing" });
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid access token",
      });
    }

    if (!decoded || decoded.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden - Admin role required" });
    }
    req.user = decoded;
    next();
  });
};

export default verifyAdmin;
