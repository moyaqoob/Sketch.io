import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
}

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }
  return secret;
}

/**
 * Generate a JWT token for user authentication.
 * @param id - The user ID to encode in the token.
 * @returns The generated JWT token.
 */
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, jwtSecret(), { expiresIn: "1d" });
};

/**
 * Decode a JWT token without verifying.
 * @param token - The JWT token to decode.
 * @returns The decoded payload or null if invalid.
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    // console.error("JWT Decoding Error:", error);
    return null;
  }
};
