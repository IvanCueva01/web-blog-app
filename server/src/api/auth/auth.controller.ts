import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { comparePassword } from "@/utils/password.utils";
import { generateToken } from "@/utils/jwt.utils";
import { IUser } from "@/interfaces/user.interface";

export const AuthController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        res
          .status(400)
          .json({ message: "Username, email, and password are required" });
        return;
      }

      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser) {
        res.status(409).json({ message: "Email already in use" });
        return;
      }

      const newUser = await AuthService.upsertUser({
        username,
        email,
        password,
      });

      // Exclude password_hash from the response
      const userResponse: Partial<IUser> = { ...newUser };
      delete userResponse.password_hash;

      res.status(201).json({
        message: "User registered successfully",
        user: userResponse,
      });
    } catch (error) {
      console.error("[AuthController.register] Error:", error);
      res.status(500).json({
        message: "Error registering user",
        error: (error as Error).message,
      });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      const user = await AuthService.findUserByEmail(email);
      if (!user || !user.password_hash) {
        // User not found or no password_hash (e.g. OAuth user trying local login)
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      const isPasswordValid = await comparePassword(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      if (!user.id) {
        // Should not happen if user is found and has password_hash
        console.error(
          "[AuthController.login] User ID is missing for a successfully authenticated user:",
          user
        );
        res
          .status(500)
          .json({ message: "An unexpected error occurred during login." });
        return;
      }

      const token = generateToken({ id: user.id, email: user.email });

      // Exclude password_hash from the response
      const userResponse: Partial<IUser> = { ...user };
      delete userResponse.password_hash;

      res.status(200).json({
        message: "Login successful",
        token,
        user: userResponse,
      });
    } catch (error) {
      console.error("[AuthController.login] Error:", error);
      res
        .status(500)
        .json({ message: "Error logging in", error: (error as Error).message });
    }
  },

  googleCallback(req: Request, res: Response): void {
    // Successful authentication, Passport adds user to req.user.
    // We generate a JWT and redirect to the frontend or send user data.
    if (!req.user) {
      console.error(
        "[AuthController.googleCallback] User not found in request after Google auth."
      );
      // Redirect to frontend login page with error query param
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      res.redirect(`${clientUrl}/auth?view=login&error=google_auth_failed`);
      return;
    }

    const user = req.user as IUser;
    if (!user.id || !user.email) {
      console.error(
        "[AuthController.googleCallback] User ID or email is missing after Google auth:",
        user
      );
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      res.redirect(`${clientUrl}/auth?view=login&error=google_auth_incomplete`);
      return;
    }

    const token = generateToken({ id: user.id, email: user.email });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    // More secure: Redirect to a dedicated frontend page that handles the token
    res.redirect(`${clientUrl}/auth/handle-token?token=${token}`);

    // Alternative: Send token and user data in response (if client makes AJAX call to this endpoint directly)
    // const userResponse: Partial<IUser> = { ...user };
    // delete userResponse.password_hash;
    // delete userResponse.google_id;
    // res.status(200).json({
    //   message: "Google login successful",
    //   token,
    //   user: userResponse,
    // });
  },

  async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as IUser).id;
      const { username, avatar_url } = req.body;

      if (!userId) {
        // This should not happen if authenticateJwt middleware is working correctly
        res.status(401).json({ message: "Unauthorized. User ID not found." });
        return;
      }

      // Prepare data for update - only include fields that are present in the request
      const updateData: Partial<IUser> = { id: userId };
      if (username !== undefined) {
        updateData.username = username;
      }
      if (avatar_url !== undefined) {
        updateData.avatar_url = avatar_url;
      }

      // Check if there's anything to update
      if (Object.keys(updateData).length <= 1 && updateData.id) {
        // only id means no actual data to update
        // Optionally, you could return the current user data or a specific message
        // For now, let's assume client sends at least one field to update
        // Or fetch current user and return if no actual changes.
        // Let's proceed assuming the service handles no-change updates gracefully or we expect actual changes.
      }

      const updatedUser = await AuthService.upsertUser(updateData);

      // Exclude password_hash from the response
      const userResponse: Partial<IUser> = { ...updatedUser };
      delete userResponse.password_hash;
      delete userResponse.google_id;

      res.status(200).json({
        message: "Profile updated successfully",
        user: userResponse,
      });
    } catch (error) {
      console.error("[AuthController.updateUserProfile] Error:", error);
      // Consider more specific error handling, e.g., for duplicate username if a unique constraint exists
      res.status(500).json({
        message: "Error updating profile",
        error: (error as Error).message,
      });
    }
  },
};
