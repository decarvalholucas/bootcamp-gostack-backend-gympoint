// Import Node Modules
import jwt from "jsonwebtoken";
import { promisify } from "util";

// Import application modules
import authConfig from "../config/auth";

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ erro: "Token not privided" });
  }

  const [, token] = authorization.split(" ");

  try {
    await promisify(jwt.verify)(token, authConfig.secret);
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid Token" });
  }
};
