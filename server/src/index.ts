import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { testDatabaseConnection } from "@/config/database"; // Changed to aliased path
import authRoutes from "@/api/auth/auth.routes"; // Changed to aliased path
import articleRoutes from "@/api/articles/article.routes"; // Import article routes
import passport from "@/config/passport.config"; // Import configured passport

// Load environment variables
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Allow requests from your frontend
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads

// Initialize Passport
app.use(passport.initialize());

// API Routes
app.use("/api/auth", authRoutes); // Use auth routes with /api/auth prefix
app.use("/api/articles", articleRoutes); // Use article routes with /api/articles prefix

// Simple route for testing
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the Blog App Backend! TypeScript server is running.");
});

const startServer = async () => {
  // Test database connection before starting the server
  await testDatabaseConnection();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();
