import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
}

interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
  headers: Request['headers'];
}

const protect = (roles: string[] = []) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
       res.status(401).json({ message: 'No token provided' });
       return
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err || !decoded || typeof decoded === 'string') {
         res.status(403).json({ message: 'Invalid token' });
         return
      }

      req.user = decoded as DecodedToken;

      

      next();
    });
  };
};

export default protect;
