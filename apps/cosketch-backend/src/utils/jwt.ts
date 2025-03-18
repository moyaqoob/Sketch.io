import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

interface TokenPayload {
  username: string;
}

export const generateToken = (username: string): string => {
  return jwt.sign({ username }, JWT_SECRET as string, { expiresIn: "1d" });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET as string) as TokenPayload;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
