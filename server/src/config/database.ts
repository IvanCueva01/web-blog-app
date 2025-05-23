import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Error: DATABASE_URL environment variable is not set.");
  process.exit(1); // Exit if DATABASE_URL is not found
}

const pool = new Pool({
  connectionString: databaseUrl,
  // You can add SSL configuration here if your PostgreSQL server requires it
  // ssl: {
  //   rejectUnauthorized: false, // Adjust as needed for your environment (e.g., for Heroku, self-signed certs)
  // },
});

export const testDatabaseConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log("Successfully connected to the PostgreSQL database.");
    const res = await client.query("SELECT NOW()");
    console.log("PostgreSQL current time:", res.rows[0].now);
    client.release();
  } catch (error) {
    console.error("Error connecting to the PostgreSQL database:", error);
    process.exit(1);
  }
};

export default pool;
