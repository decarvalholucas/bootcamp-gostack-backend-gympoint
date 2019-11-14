import { Router } from "express";

// Import Controllers
import SessionController from "./app/controllers/SessionController";
import StudentController from "./app/controllers/StudentController";
import PlanController from "./app/controllers/PlanController";

// Import Middlewares
import authMiddleware from "./app/middlewares/auth";

const routes = Router();

// Sessions routes
routes.post("/sessions", SessionController.store);

// authentication required for routes after this middleware
routes.use(authMiddleware);

// Students routes
routes.get("/students", StudentController.index);
routes.post("/students", StudentController.store);
routes.put("/students/:id", StudentController.update);

// Plans routes
routes.get("/plans", PlanController.index);

export default routes;
