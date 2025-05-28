import * as dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { AuthenticatedRequest, IAuthController, IAuthService } from '../interface/interface';

const client = new OAuth2Client(process.env.AUTH_GOOGLE_ID);

export class AuthController implements IAuthController {
  constructor(private authService: IAuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = await this.authService.register(req.body);
      res.status(201).json({ user, token });
    } catch (err: any) {
      console.error("Registration error:", err);
      res.status(400).json({ message: err.message || "Registration failed" });
    }
  }

  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      
      if (!token) {
         res.status(400).json({ success: false, message: "Token is required!" });
         return
      }

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.AUTH_GOOGLE_ID, 
      });

      const payload = ticket.getPayload();
      if (!payload) {
         res.status(401).json({ success: false, message: "Invalid Google token!" });
      }

      const { user, token: accessToken } = await this.authService.authenticateGoogleUser(token);
      console.log(user)
      console.log(token)
    
      res.json({ success: true, user, token: accessToken });
    } catch (error) {
      console.error("Google login error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
         res.status(401).json({ message: "Not authenticated" });
         return
      }

      res.json({ user: req.user });
    } catch (error) {
      console.error("Me endpoint error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
         res.status(400).json({ message: "Email and password are required" });
         return
      }

      const { user, token } = await this.authService.login(email, password);
      res.json({ user, token });
    } catch (err: any) {
      console.error("Login error:", err);
      res.status(401).json({ message: err.message || "Invalid credentials" });
    }
  }
}