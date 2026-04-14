import { Router } from "express";
import * as AuthController from '../Controller/auth.Controller.js';
const AuthRoutes = Router();

AuthRoutes.post('/register', AuthController.RegisterUser);
AuthRoutes.post('/login', AuthController.loginUser);

export default AuthRoutes;