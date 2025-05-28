import express, { Router } from 'express';
import { AuthService } from '../services/authService';
import { AuthController } from '../controller/authController';
import { AuthRepository } from '../repositories/authRepository';
import protect from "../middleware/protectedRoute";

const authRouter: Router = express.Router();
const authRepository=new AuthRepository()
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

authRouter.post('/register', authController.register.bind(authController));
authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/google', authController.googleLogin.bind(authController));
authRouter.get('/me', protect(),authController.me.bind(authController));

export default authRouter;
