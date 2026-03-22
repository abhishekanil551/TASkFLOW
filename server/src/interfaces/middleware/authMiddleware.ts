import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    if(!token){
      return res.status(401).json({message: "Unauthorized"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as{
      id: string;
    }

    (req as any).userId = decoded.id;

    next();

  }catch{
    return res.status(401).json({message: "Invalid token"});
  }
};
