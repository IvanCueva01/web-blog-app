export interface IUser {
  id?: number;
  username: string;
  email: string;
  password_hash?: string; // Optional because it might not be present for OAuth users or when fetching user data
  google_id?: string; // Optional, for Google OAuth
  avatar_url?: string;
  created_at?: Date;
  updated_at?: Date;
}
