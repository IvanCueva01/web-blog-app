/**
 * Represents the public profile information of an article author.
 */
export interface AuthorProfile {
  id: number;
  username: string;
  avatar_url?: string | null;
}

/**
 * Represents an article object as expected by the frontend.
 * Dates are typically strings when received from API, can be converted to Date objects as needed.
 */
export interface IArticleFrontEnd {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image_url?: string; // Corresponds to image_url in backend
  category?: string;
  author_id: number; // Foreign key
  author?: AuthorProfile; // Nested author details
  published_at?: string | null; // e.g., "2024-01-15T10:30:00.000Z"
  created_at: string; // e.g., "2024-01-15T10:30:00.000Z"
  updated_at: string; // e.g., "2024-01-15T10:30:00.000Z"
  // Any other frontend-specific fields or transformations can be added here.
}
