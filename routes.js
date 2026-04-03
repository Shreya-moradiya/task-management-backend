import { Router } from "express";
import AuthRoutes from "./Routes/auth.Routes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import taskRoutes from "./Routes/task.Routes.js";

const routes = Router();

routes.use('/auth', AuthRoutes);
routes.use('/api', authMiddleware, taskRoutes);

export default routes;