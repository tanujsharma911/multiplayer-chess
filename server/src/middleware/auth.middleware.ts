import type { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(403).json({
        status: "error",
        message: "Forbidden :: Missing access token",
      });
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    if (!decoded) {
      return res.status(403).json({
        status: "error",
        message: "Forbidden :: Invalid access token can't decode it",
      });
    }

    req.user = decoded as { userId: string; email: string };

    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized :: Invalid or expired token",
    });
  }
};
