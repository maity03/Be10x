import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

const jwtMiddleware = (req, res, next) => {
  let token;
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default jwtMiddleware;
