import { Router } from "express";
import { ArticleController } from "./article.controller";
import { authenticateJwt } from "@/middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", ArticleController.getAllArticles); // Get all published articles (with pagination & filters)
router.get("/slug/:slug", ArticleController.getArticleBySlug); // Get a single article by its slug
router.get("/:id", ArticleController.getArticleById); // Get a single article by its ID

// Protected routes (require JWT authentication)
router.post("/", authenticateJwt, ArticleController.createArticle);
router.put("/:id", authenticateJwt, ArticleController.updateArticle);
router.delete("/:id", authenticateJwt, ArticleController.deleteArticle);

export default router;
