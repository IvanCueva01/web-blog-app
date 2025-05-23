import { Request, Response } from "express";
import { ArticleService } from "./article.service";
import {
  ICreateArticleDTO,
  IUpdateArticleDTO,
  IArticle,
} from "@/interfaces/article.interface";
import { IUser } from "@/interfaces/user.interface";

export const ArticleController = {
  async getAllArticles(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const filters = {
        category: req.query.category as string | undefined,
        authorId: req.query.authorId
          ? parseInt(req.query.authorId as string)
          : undefined,
        searchTerm: req.query.q as string | undefined, // For search query
      };

      const { articles, totalCount } = await ArticleService.findAll(
        filters,
        limit,
        offset
      );

      res.status(200).json({
        message: "Articles retrieved successfully",
        data: articles,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      console.error("[ArticleController.getAllArticles] Error:", error);
      res.status(500).json({
        message: "Error retrieving articles",
        error: (error as Error).message,
      });
    }
  },

  async getAllUniqueCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await ArticleService.findAllCategories();
      res.status(200).json({
        message: "Categories retrieved successfully",
        categories,
      });
    } catch (error) {
      console.error("[ArticleController.getAllUniqueCategories] Error:", error);
      res.status(500).json({
        message: "Error retrieving categories",
        error: (error as Error).message,
      });
    }
  },

  async getArticleById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid article ID format" });
        return;
      }
      const article = await ArticleService.findById(id);
      if (!article) {
        res.status(404).json({ message: "Article not found" });
        return;
      }
      res
        .status(200)
        .json({ message: "Article retrieved successfully", data: article });
    } catch (error) {
      console.error("[ArticleController.getArticleById] Error:", error);
      res.status(500).json({
        message: "Error retrieving article",
        error: (error as Error).message,
      });
    }
  },

  async getArticleBySlug(req: Request, res: Response): Promise<void> {
    try {
      const slug = req.params.slug;
      const article = await ArticleService.findBySlug(slug);
      if (!article) {
        res.status(404).json({ message: "Article not found" });
        return;
      }
      res
        .status(200)
        .json({ message: "Article retrieved successfully", data: article });
    } catch (error) {
      console.error("[ArticleController.getArticleBySlug] Error:", error);
      res.status(500).json({
        message: "Error retrieving article",
        error: (error as Error).message,
      });
    }
  },

  async getMyArticles(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as IUser;
      if (!user || !user.id) {
        res
          .status(403)
          .json({ message: "User not authenticated or user ID missing." });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10; // Default to 10, can be overridden
      const offset = (page - 1) * limit;

      // Filters will include the authenticated user's ID
      // and any other query params like searchTerm if we want to support it here
      const filters = {
        authorId: user.id,
        searchTerm: req.query.q as string | undefined,
        // category: req.query.category as string | undefined, // Optionally add category filter for user's own articles
      };

      const { articles, totalCount } = await ArticleService.findAll(
        filters,
        limit,
        offset
      );

      res.status(200).json({
        message: "User's articles retrieved successfully",
        data: articles,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      console.error("[ArticleController.getMyArticles] Error:", error);
      res.status(500).json({
        message: "Error retrieving user's articles",
        error: (error as Error).message,
      });
    }
  },

  async createArticle(req: Request, res: Response): Promise<void> {
    try {
      const articleData = req.body as ICreateArticleDTO;
      const user = req.user as IUser; // From authenticateJwt middleware

      if (!user || !user.id) {
        res
          .status(403)
          .json({ message: "User not authenticated or user ID missing." });
        return;
      }
      // Basic validation (more robust validation can be added with Joi/Zod)
      if (!articleData.title || !articleData.content) {
        res.status(400).json({ message: "Title and content are required." });
        return;
      }

      const newArticle = await ArticleService.create(articleData, user.id);
      res
        .status(201)
        .json({ message: "Article created successfully", data: newArticle });
    } catch (error) {
      console.error("[ArticleController.createArticle] Error:", error);
      res.status(500).json({
        message: "Error creating article",
        error: (error as Error).message,
      });
    }
  },

  async updateArticle(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid article ID format" });
        return;
      }
      const articleData = req.body as IUpdateArticleDTO;
      const user = req.user as IUser;

      if (!user || !user.id) {
        res
          .status(403)
          .json({ message: "User not authenticated or user ID missing." });
        return;
      }

      const updatedArticle = await ArticleService.update(
        id,
        articleData,
        user.id
      );
      if (!updatedArticle) {
        res.status(404).json({ message: "Article not found or update failed" });
        return;
      }
      res.status(200).json({
        message: "Article updated successfully",
        data: updatedArticle,
      });
    } catch (error: any) {
      console.error("[ArticleController.updateArticle] Error:", error);
      if (error.message.startsWith("Forbidden:")) {
        res.status(403).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: "Error updating article", error: error.message });
      }
    }
  },

  async deleteArticle(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid article ID format" });
        return;
      }
      const user = req.user as IUser;

      if (!user || !user.id) {
        res
          .status(403)
          .json({ message: "User not authenticated or user ID missing." });
        return;
      }

      const success = await ArticleService.delete(id, user.id);
      if (!success) {
        res.status(404).json({ message: "Article not found or delete failed" });
        return;
      }
      res.status(200).json({ message: "Article deleted successfully" }); // Or 204 No Content
    } catch (error: any) {
      console.error("[ArticleController.deleteArticle] Error:", error);
      if (error.message.startsWith("Forbidden:")) {
        res.status(403).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: "Error deleting article", error: error.message });
      }
    }
  },
};
