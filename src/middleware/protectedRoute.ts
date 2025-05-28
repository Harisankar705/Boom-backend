import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest, IUser } from "../interface/interface";
import User from "../models/User";
import { HydratedDocument } from 'mongoose';

const protect = () => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];


    if (!token) {
       res.status(401).json({ message: "No token provided" });
       return
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
         res.status(401).json({ message: "User not found" });
         return
      }

      req.user = user;
      next();
    } catch (err) {
       res.status(403).json({ message: "Invalid token" });
       return
    }
  };
};


export default protect;