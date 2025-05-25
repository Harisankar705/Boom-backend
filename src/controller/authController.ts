import dotenv from 'dotenv'
dotenv.config()
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { IAuthController, IAuthService } from '../interface/interface';
const client = new OAuth2Client(process.env.AUTH_GOOGLE_ID);
console.log()
export class AuthController implements IAuthController {
  private authService: IAuthService;
  constructor(authService: IAuthService) {
    this.authService = authService;
  }
  async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json(user);
      console.log("registered");
    } catch (err: any) {
      console.error("Registration error ", err);
      res.status(400).json({ message: err.message || "Registration failed" });
    }
  }
  async googleLogin(req: Request, res: Response) {
    try {
      const { token } = req.body;
      if (!token) { res.status(400).json({ success: false, message: "Token is required!" })
        return;}
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.AUTH_GOOGLE_ID, 
      });
      const payload = ticket.getPayload();
      if (!payload) {
         res
          .status(401)
          .json({ success: false, message: "Invalid Google token!" })
          return;
      }
      const { user, accessToken } =
        await this.authService.authenticateGoogleUser(token);
      res.json({ success: true, user, token: accessToken });
    } catch (error) {
      console.error("Google login error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
  
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }
      const { user, token } = await this.authService.login(email, password);
      res.json({ user, token });
    } catch (err: any) {
      console.error("Login error ", err);
      res.status(401).json({ message: err.message || "Invalid credentials" });
    }
  }
}
