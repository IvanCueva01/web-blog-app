import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import dotenv from "dotenv";
import { AuthService } from "@/api/auth/auth.service"; // Ensure this path is correct
import { IUser } from "@/interfaces/user.interface"; // IUser might be needed for JWT payload typing

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SERVER_URL = process.env.SERVER_URL;
const JWT_SECRET = process.env.JWT_SECRET; // Already used in jwt.utils, ensure it's here for clarity

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !SERVER_URL) {
  console.error(
    "FATAL ERROR: Google OAuth environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SERVER_URL) are not defined in .env file"
  );
  // process.exit(1); // Consider if this should halt server startup if Google OAuth is critical
}
if (!JWT_SECRET) {
  console.error(
    "FATAL ERROR: JWT_SECRET is not defined in .env file for Passport JWT Strategy"
  );
  process.exit(1); // JWT is critical, exit if not set
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

// JWT Strategy Configuration
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts JWT from 'Authorization: Bearer <token>' header
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(
    jwtOptions,
    async (
      jwtPayload: any,
      done: (error: any, user?: any, info?: any) => void
    ) => {
      try {
        // jwtPayload will contain the decoded JWT payload (e.g., user id, email)
        // We used 'sub' for user id and 'email' in our generateToken function
        if (!jwtPayload.sub) {
          return done(null, false, {
            message: "Invalid token: Missing user identifier.",
          });
        }
        // Find the user in DB based on ID from JWT payload
        // Assuming AuthService.findUserById exists or findUserByEmail can be used if email is unique and in payload
        const user = await AuthService.findUserByEmail(jwtPayload.email); // Or findUserById(jwtPayload.sub) if you implement it

        if (user) {
          return done(null, user); // User found, authentication successful
        } else {
          return done(null, false, { message: "User not found." }); // User not found in DB
        }
      } catch (error) {
        console.error("[Passport JwtStrategy] Error:", error);
        return done(error, false);
      }
    }
  )
);

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
