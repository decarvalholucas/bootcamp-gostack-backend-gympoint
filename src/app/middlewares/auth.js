import jwt from "jsonwebtoken";
import { promisify } from "util";
import authConfig from "../../config/auth";

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ erro: "Token not privided" });
  }

  const [, token] = authorization.split(" ");

  try {
    const payloadDecoded = await promisify(jwt.verify)(
      token,
      authConfig.secret
    );
    req.userId = payloadDecoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid Token" });
  }
};
