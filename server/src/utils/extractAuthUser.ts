import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { AuthUser } from "../types/user.js";

dotenv.config();

export const extractAuthUser = (accessToken: string): AuthUser | null => {
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as jwt.Secret
    );

    return decoded as AuthUser;
  } catch (error) {
    console.error("❌ Failed to extract user from token:", error);
    return null;
  }
};
