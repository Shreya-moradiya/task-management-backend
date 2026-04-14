import { Router } from "express";
import * as UserController from '../Controller/user.Controller.js';

const userRoutes = Router();

userRoutes.get('/getUser', UserController.getUser);
userRoutes.post('/addUser', UserController.addUser);

export default userRoutes;