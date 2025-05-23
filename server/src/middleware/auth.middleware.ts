import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { IUser } from "@/interfaces/user.interface"; // Adjust path as necessary

/**
 * Middleware to authenticate requests using JWT.
 * If authentication is successful, the user object is attached to req.user.
 * Otherwise, a 401 Unauthorized error is sent.
 */
export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: IUser | false, info: any) => {
      if (err) {
        console.error("[authenticateJwt] Error:", err);
        return res
          .status(500)
          .json({ message: "Authentication error", error: err.message });
      }
      if (!user) {
        let message = "Unauthorized";
        if (info && info.message) {
          message = info.message;
        }
        // Distinguish between token not provided, expired, or user not found
        if (info && info.name === "JsonWebTokenError") {
          message = "Invalid token.";
        } else if (info && info.name === "TokenExpiredError") {
          message = "Token expired.";
        }
        return res.status(401).json({ message });
      }
      req.user = user; // Attach user to request object
      return next();
    }
  )(req, res, next);
};
