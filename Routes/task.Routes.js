import { Router } from "express";
import * as TaskController from '../Controller/task.Controller.js';
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const taskRoutes = Router();

// All task routes require auth so users see only their tasks
taskRoutes.post('/addTask', adminMiddleware, TaskController.addTask);
taskRoutes.get('/task', TaskController.getTask);
taskRoutes.get('/taskById/:taskId', TaskController.getTaskById);
taskRoutes.post('/updateTask/:taskId', adminMiddleware, TaskController.updateTask);
taskRoutes.delete('/deleteTask/:taskId', adminMiddleware, TaskController.deleteTask);
taskRoutes.get('/getUser', TaskController.getUser);
taskRoutes.get('/taskTitle', TaskController.getTasksTitle);

export default taskRoutes;