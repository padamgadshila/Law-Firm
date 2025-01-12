import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const key = process.env.JWT_KEY;
  const token = jwt.sign(
    {
      user,
    },
    key,
    { expiresIn: "5h" }
  );
  return token;
};

export default generateToken;
