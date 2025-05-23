import { Router } from "express";
import { AuthController } from "./auth.controller";
import passport from "@/config/passport.config";
import { authenticateJwt } from "@/middleware/auth.middleware";
import { IUser } from "@/interfaces/user.interface";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth?view=login&error=google_auth_failed`,
  }),
  AuthController.googleCallback
);

// Route to get current authenticated user (protected by JWT)
router.get("/me", authenticateJwt, (req: any, res: any) => {
  // If authenticateJwt passes, req.user will be populated
  const user = req.user as IUser;
  // Send back user information, excluding sensitive data like password_hash or google_id if not needed by client
  const userResponse: Partial<IUser> = {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
  res.status(200).json(userResponse);
});

// Route to update user profile (protected by JWT)
router.put("/profile", authenticateJwt, AuthController.updateUserProfile);

export default router;
