import { IUser } from "./user.interface"; // Assuming user interface is in the same directory or adjust path

// No longer needed as status is removed
// export enum ArticleStatus {
//   DRAFT = "draft",
//   PUBLISHED = "published",
//   ARCHIVED = "archived",
// }

export interface IArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  category?: string;
  author_id: number; // Foreign key to users table
  author?: Pick<IUser, "id" | "username" | "avatar_url">; // Nested author object
  // status: ArticleStatus; // Removed
  published_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

// For creating articles, some fields are optional or generated
export interface ICreateArticleDTO {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  category?: string;
  // status?: ArticleStatus; // Removed
  published_at?: Date | string; // Allow string for client flexibility, convert in service
}

// For updating articles, all fields are optional, and ID is required
export interface IUpdateArticleDTO {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  image_url?: string;
  category?: string;
  // status?: ArticleStatus; // Removed
  published_at?: Date | string | null;
}
