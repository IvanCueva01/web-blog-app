import { Router } from "express";
import { AuthController } from "./auth.controller";
import passport from "@/config/passport.config";

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

export default router;
