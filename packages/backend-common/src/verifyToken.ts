import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

interface TokenPayload {
  id: string;
}

/**
 * Verify a JWT token and return the decoded payload.
 * @param token - The JWT token to verify.
 * @returns The decoded payload or null if verification fails.
 */

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET as string) as TokenPayload;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
