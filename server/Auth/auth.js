import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ error: "No token provided or invalid header format" });
      }

      const token = authHeader.split(" ")[1];
      const key = process.env.JWT_KEY;
      const decodedToken = jwt.verify(token, key);

      if (roles.length && !roles.includes(decodedToken.user.role)) {
        return res.status(403).json({ error: "Access denied" });
      }
      next();
    } catch (error) {
      return res.status(401).send({ error: "Invalid or expired token" });
    }
  };
};
