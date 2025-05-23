import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "@/interfaces/user.interface"; // Changed to aliased path

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d"; // Token expiration time (e.g., 1 day)

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
  process.exit(1);
}

/**
 * Generates a JWT for a given user.
 * @param user The user object (or just the user ID) to include in the token payload.
 * @returns The generated JWT string.
 */
export const generateToken = (user: Pick<IUser, "id" | "email">): string => {
  const payload = {
    sub: user.id, // Standard subject claim (user ID)
    email: user.email,
    // You can add other claims like roles or permissions here if needed
  };
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifies a JWT.
 * @param token The JWT string to verify.
 * @returns The decoded token payload if verification is successful, otherwise throws an error.
 */
export const verifyToken = (token: string): string | jwt.JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET!);
  } catch (error) {
    console.error("Invalid token:", error);
    throw new Error("Invalid or expired token."); // Or handle specific jwt errors
  }
};
