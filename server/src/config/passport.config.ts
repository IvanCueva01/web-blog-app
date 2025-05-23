import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";
import { AuthService } from "@/api/auth/auth.service"; // Ensure this path is correct

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SERVER_URL = process.env.SERVER_URL;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !SERVER_URL) {
  console.error(
    "FATAL ERROR: Google OAuth environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SERVER_URL) are not defined in .env file"
  );
  // process.exit(1); // Consider if this should halt server startup if Google OAuth is critical
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      callbackURL: `${SERVER_URL}/api/auth/google/callback`,
      // scope: ['profile', 'email'], // scope is no longer needed here, as it will be requested by the client
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any, info?: any) => void
    ) => {
      try {
        const user = await AuthService.findOrCreateUserByGoogleProfile(profile);
        return done(null, user);
      } catch (error) {
        console.error("[Passport Google Strategy] Error:", error);
        return done(error, false);
      }
    }
  )
);

// Passport session serialization/deserialization (optional if not using sessions with JWT)
// Since we are likely aiming for stateless JWT auth, session management via passport might not be strictly needed
// after the initial OAuth handshake. The JWT will carry the user's identity.

passport.serializeUser((user: any, done) => {
  done(null, user.id); // Or user.email, or the whole user object if small
});

passport.deserializeUser(async (id: string, done) => {
  try {
    // Fetch user by id/email from your database
    const user = await AuthService.findUserByEmail(id); // Or findUserById(id) if you serialize by ID
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
