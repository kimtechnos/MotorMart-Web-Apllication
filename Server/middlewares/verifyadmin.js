import jwt from "jsonwebtoken";

const verifyAdmin = (req, res, next) => {
  const accessToken = req.cookies.access_token;
  if (!accessToken)
    return res.status(401).json({ success: false, message: "unauthorized" });

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: "unauthorized" });
    }
    if (decoded.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "not permitted to perform this operation",
      });
    }

    next();
  });
};

export default verifyAdmin;
