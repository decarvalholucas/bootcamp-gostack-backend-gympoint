import { Router } from "express";

/** TESTE */
import User from "./app/models/User";
/** TESTE */

const routes = Router();

routes.get("/users", async (req, res) => {
  const user = await User.findByPk(1);
  res.json(user);
});

export default routes;
