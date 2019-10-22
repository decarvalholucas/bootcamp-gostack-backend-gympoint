import { Router } from "express";

// Controllers
import SessionController from "./app/controllers/SessionController";
import StudentController from "./app/controllers/StudentController";

// Middlewares
import authMiddleware from "./app/middlewares/auth";

const routes = Router();

routes.post("/sessions", SessionController.store);
routes.use(authMiddleware);
routes.get("/students", StudentController.index);
routes.post("/students", StudentController.store);
routes.put("/students", StudentController.update);

export default routes;
