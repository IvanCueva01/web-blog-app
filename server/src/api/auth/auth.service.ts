import pool from "@/config/database"; // Adjusted path to DB config
import { IUser } from "@/interfaces/user.interface"; // Adjusted path to User interface
import { hashPassword } from "@/utils/password.utils"; // Adjusted path to password utils
import { Profile as GoogleProfile } from "passport-google-oauth20"; // Import GoogleProfile type

export const AuthService = {
  /**
   * Finds a user by their email address.
   * @param email The email address of the user to find.
   * @returns A promise that resolves to the user object or null if not found.
   */
  async findUserByEmail(email: string): Promise<IUser | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      return result.rows[0] as IUser;
    }
    return null;
  },

  async findUserByGoogleId(googleId: string): Promise<IUser | null> {
    const result = await pool.query(
      "SELECT * FROM users WHERE google_id = $1",
      [googleId]
    );
    if (result.rows.length > 0) {
      return result.rows[0] as IUser;
    }
    return null;
  },

  /**
   * Creates or updates a user in the database.
   * If password is provided, it will be hashed. Existing password remains if not provided.
   * Can create a user with local credentials, Google ID, or both.
   */
  async upsertUser(
    userData: Partial<IUser> & { password?: string }
  ): Promise<IUser> {
    const { id, username, email, password, google_id, avatar_url } = userData;
    let hashedPassword = userData.password_hash; // Keep existing if not re-setting

    if (password) {
      hashedPassword = await hashPassword(password);
    }

    if (id) {
      // Update existing user
      // Construct query dynamically based on provided fields
      const fieldsToUpdate: string[] = [];
      const values: any[] = [];
      let queryIndex = 1;

      if (username !== undefined) {
        fieldsToUpdate.push(`username = $${queryIndex++}`);
        values.push(username);
      }
      if (email !== undefined) {
        fieldsToUpdate.push(`email = $${queryIndex++}`);
        values.push(email);
      }
      if (hashedPassword !== undefined) {
        fieldsToUpdate.push(`password_hash = $${queryIndex++}`);
        values.push(hashedPassword);
      }
      if (google_id !== undefined) {
        fieldsToUpdate.push(`google_id = $${queryIndex++}`);
        values.push(google_id);
      }
      if (avatar_url !== undefined) {
        fieldsToUpdate.push(`avatar_url = $${queryIndex++}`);
        values.push(avatar_url);
      }

      fieldsToUpdate.push(`updated_at = NOW()`); // Always update timestamp

      if (fieldsToUpdate.length === 1) {
        // Only updated_at, means no actual data change passed
        const currentUserState = await pool.query(
          "SELECT * FROM users WHERE id = $1",
          [id]
        );
        return currentUserState.rows[0] as IUser;
      }

      values.push(id); // For the WHERE clause
      const updateQuery = `UPDATE users SET ${fieldsToUpdate.join(
        ", "
      )} WHERE id = $${queryIndex} RETURNING *`;
      const result = await pool.query(updateQuery, values);
      return result.rows[0] as IUser;
    } else {
      // Create new user
      const result = await pool.query(
        "INSERT INTO users (username, email, password_hash, google_id, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [username, email, hashedPassword, google_id, avatar_url]
      );
      return result.rows[0] as IUser;
    }
  },

  /**
   * Finds an existing user by Google ID or email, or creates a new one if not found.
   */
  async findOrCreateUserByGoogleProfile(
    profile: GoogleProfile
  ): Promise<IUser> {
    if (!profile.emails || profile.emails.length === 0) {
      throw new Error("No email found in Google profile");
    }
    const email = profile.emails[0].value;
    const googleId = profile.id;

    let user = await this.findUserByGoogleId(googleId);
    if (user) return user;

    user = await this.findUserByEmail(email);
    if (user) {
      // User exists with this email but not linked to this Google ID yet.
      // Link them by updating their google_id and potentially avatar.
      return this.upsertUser({
        id: user.id,
        google_id: googleId,
        avatar_url:
          profile.photos && profile.photos.length > 0
            ? profile.photos[0].value
            : user.avatar_url,
        // Optionally update username if current one is generic and Google's is better
        username: user.username.startsWith("user")
          ? profile.displayName
          : user.username,
      });
    }

    // User does not exist, create a new one
    const username = profile.displayName || email.split("@")[0];
    const avatarUrl =
      profile.photos && profile.photos.length > 0
        ? profile.photos[0].value
        : undefined;

    return this.upsertUser({
      username,
      email,
      google_id: googleId,
      avatar_url: avatarUrl,
    });
  },
};
