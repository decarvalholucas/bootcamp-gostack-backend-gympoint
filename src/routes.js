import { Router } from "express";

// Controllers
import SessionController from "./app/controllers/SessionController";
import StudentController from "./app/controllers/StudentController";

// Middlewares
import authMiddleware from "./app/middlewares/auth";

const routes = Router();

routes.post("/sessions", SessionController.store);
routes.use(authMiddleware);
routes.post("/students", StudentController.store);

export default routes;
