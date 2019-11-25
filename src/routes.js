import { Router } from "express";

// Import Middlewares
import authMiddleware from "./app/middlewares/auth";

// Import Controllers
import SessionController from "./app/controllers/SessionController";
import StudentController from "./app/controllers/StudentController";
import PlanController from "./app/controllers/PlanController";
import EnrollmentController from "./app/controllers/EnrollmentController";
import CheckinController from "./app/controllers/CheckinController";

const routes = Router();

// Sessions routes
routes.post("/sessions", SessionController.store);

// Checkins routes
routes.get("/students/:studentId/checkins", CheckinController.index);
routes.post("/students/:studentId/checkins", CheckinController.store);

// authentication required for routes after this middleware
routes.use(authMiddleware);

// Students routes
routes.get("/students", StudentController.index);
routes.post("/students", StudentController.store);
routes.put("/students/:id", StudentController.update);

// Plans routes
routes.get("/plans", PlanController.index);
routes.post("/plans", PlanController.store);
routes.put("/plans/:id", PlanController.update);
routes.delete("/plans/:id", PlanController.delete);

// Enrollments routes
routes.get("/enrollments", EnrollmentController.index);
routes.post("/enrollments", EnrollmentController.store);
routes.put("/enrollments/:enrollmentId", EnrollmentController.update);
routes.delete("/enrollments/:enrollmentId", EnrollmentController.delete);

export default routes;
