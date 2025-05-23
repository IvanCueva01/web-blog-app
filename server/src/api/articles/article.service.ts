import pool from "@/config/database";
import {
  IArticle,
  ICreateArticleDTO,
  IUpdateArticleDTO,
  // ArticleStatus, // No longer needed
} from "@/interfaces/article.interface";
// import { IUser } from "@/interfaces/user.interface"; // Not directly used here, author info is built in SQL

// Helper function to generate a slug (basic version)
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]+/g, ""); // Remove all non-word chars except hyphens
};

export const ArticleService = {
  async findAll(
    filters: { category?: string; authorId?: number; searchTerm?: string },
    limit: number,
    offset: number
  ): Promise<{ articles: IArticle[]; totalCount: number }> {
    const baseQuerySelect = `
      SELECT a.*,
             json_build_object('id', u.id, 'username', u.username, 'avatar_url', u.avatar_url) as author
      FROM articles a
      JOIN users u ON a.author_id = u.id
    `;
    const baseQueryCount = `SELECT COUNT(a.id) FROM articles a JOIN users u ON a.author_id = u.id`;

    const whereClauses: string[] = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (filters.category) {
      whereClauses.push(`a.category ILIKE $${paramIndex++}`);
      queryParams.push(`%${filters.category}%`);
    }
    if (filters.authorId) {
      whereClauses.push(`a.author_id = $${paramIndex++}`);
      queryParams.push(filters.authorId);
    }
    if (filters.searchTerm) {
      whereClauses.push(
        `(a.title ILIKE $${paramIndex} OR a.content ILIKE $${paramIndex} OR a.excerpt ILIKE $${paramIndex})`
      );
      queryParams.push(`%${filters.searchTerm}%`);
      paramIndex++;
    }

    let whereString = "";
    if (whereClauses.length > 0) {
      whereString = ` WHERE ${whereClauses.join(" AND ")}`;
    }

    const fullQuerySelect = `${baseQuerySelect}${whereString} ORDER BY a.published_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    const selectQueryParams = [...queryParams, limit, offset];

    const fullQueryCount = `${baseQueryCount}${whereString}`;
    const countQueryParams = [...queryParams];

    const articlesResult = await pool.query(fullQuerySelect, selectQueryParams);
    const totalCountResult = await pool.query(fullQueryCount, countQueryParams);

    return {
      articles: articlesResult.rows as IArticle[],
      totalCount: parseInt(totalCountResult.rows[0].count, 10),
    };
  },

  async findById(id: number): Promise<IArticle | null> {
    const result = await pool.query(
      `SELECT a.*,
              json_build_object('id', u.id, 'username', u.username, 'avatar_url', u.avatar_url) as author
       FROM articles a
       JOIN users u ON a.author_id = u.id
       WHERE a.id = $1`,
      [id]
    );
    return result.rows.length > 0 ? (result.rows[0] as IArticle) : null;
  },

  async findBySlug(slug: string): Promise<IArticle | null> {
    const result = await pool.query(
      `SELECT a.*,
              json_build_object('id', u.id, 'username', u.username, 'avatar_url', u.avatar_url) as author
       FROM articles a
       JOIN users u ON a.author_id = u.id
       WHERE a.slug = $1`,
      [slug]
    );
    return result.rows.length > 0 ? (result.rows[0] as IArticle) : null;
  },

  async create(
    articleData: ICreateArticleDTO,
    authorId: number
  ): Promise<IArticle> {
    const {
      title,
      content,
      excerpt,
      image_url,
      category,
      // status, // Removed
      published_at,
    } = articleData;
    const slug = articleData.slug || generateSlug(title);
    const publishDate = published_at || new Date();

    const insertQuery = `INSERT INTO articles (title, slug, content, excerpt, image_url, category, author_id, published_at)
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;
    const queryValues = [
      title,
      slug,
      content,
      excerpt,
      image_url,
      category,
      authorId,
      publishDate,
    ];

    const result = await pool.query(insertQuery, queryValues);
    const newArticleId = result.rows[0].id;
    return (await this.findById(newArticleId))!;
  },

  async update(
    id: number,
    articleData: IUpdateArticleDTO,
    userId: number
  ): Promise<IArticle | null> {
    const article = await this.findById(id);
    if (!article) return null;
    if (article.author_id !== userId) {
      throw new Error("Forbidden: You can only update your own articles.");
    }

    const fieldsToUpdate: string[] = [];
    const values: any[] = [];
    let queryIndex = 1;

    if (articleData.title !== undefined) {
      fieldsToUpdate.push(`title = $${queryIndex++}`);
      values.push(articleData.title);
      if (articleData.slug === undefined) {
        fieldsToUpdate.push(`slug = $${queryIndex++}`);
        values.push(generateSlug(articleData.title));
      }
    }
    if (articleData.slug !== undefined) {
      fieldsToUpdate.push(`slug = $${queryIndex++}`);
      values.push(articleData.slug);
    }
    if (articleData.content !== undefined) {
      fieldsToUpdate.push(`content = $${queryIndex++}`);
      values.push(articleData.content);
    }
    if (articleData.excerpt !== undefined) {
      fieldsToUpdate.push(`excerpt = $${queryIndex++}`);
      values.push(articleData.excerpt);
    }
    if (articleData.image_url !== undefined) {
      fieldsToUpdate.push(`image_url = $${queryIndex++}`);
      values.push(articleData.image_url);
    }
    if (articleData.category !== undefined) {
      fieldsToUpdate.push(`category = $${queryIndex++}`);
      values.push(articleData.category);
    }
    // Removed status update block
    if (articleData.published_at !== undefined) {
      fieldsToUpdate.push(`published_at = $${queryIndex++}`);
      values.push(articleData.published_at);
    }

    if (fieldsToUpdate.length === 0) {
      return article;
    }

    fieldsToUpdate.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE articles SET ${fieldsToUpdate.join(
      ", "
    )} WHERE id = $${queryIndex} RETURNING id`;

    const result = await pool.query(query, values);
    const updatedArticleId = result.rows[0].id;
    return (await this.findById(updatedArticleId))!;
  },

  async delete(id: number, userId: number): Promise<boolean> {
    const article = await this.findById(id);
    if (!article) return false;
    if (article.author_id !== userId) {
      throw new Error("Forbidden: You can only delete your own articles.");
    }
    const result = await pool.query("DELETE FROM articles WHERE id = $1", [id]);
    return result.rowCount !== null && result.rowCount > 0;
  },
};
