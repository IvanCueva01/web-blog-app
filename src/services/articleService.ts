import apiClient from "@/services/api";
import type { IArticleFrontEnd } from "@/types/article.types";

/**
 * Interface for pagination and filter parameters when fetching articles.
 */
export interface GetArticlesParams {
  limit?: number;
  offset?: number;
  category?: string;
  authorId?: number;
  searchTerm?: string;
  // Add other potential filter/sort options here if backend supports them
}

/**
 * Expected response structure for fetching multiple articles (includes total count for pagination).
 */
interface GetArticlesResponse {
  articles: IArticleFrontEnd[];
  totalCount: number;
}

/**
 * Fetches a list of articles from the backend with optional pagination and filtering.
 * @param params - Optional query parameters for limit, offset, category, etc.
 * @returns A promise that resolves to an object containing the list of articles and total count.
 */
async function getAllArticles(
  params?: GetArticlesParams
): Promise<GetArticlesResponse> {
  try {
    // Define a more specific type for the actual backend response structure
    type BackendApiResponse = {
      message: string;
      data: IArticleFrontEnd[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
      };
    };

    const response = await apiClient.get<BackendApiResponse>("/articles", {
      params, // Axios will automatically serialize this into query string
    });
    // Transform the backend response to the expected GetArticlesResponse structure
    return {
      articles: response.data.data, // Extract articles from response.data.data
      totalCount: response.data.pagination.totalItems, // Extract totalCount from response.data.pagination.totalItems
    };
  } catch (error: any) {
    console.error("Error fetching articles:", error);
    // Rethrow or handle more gracefully depending on application needs
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch articles."
    );
  }
}

/**
 * Fetches a single article by its slug.
 * @param slug - The slug of the article to fetch.
 * @returns A promise that resolves to the article object or null if not found.
 */
async function getArticleBySlug(
  slug: string
): Promise<IArticleFrontEnd | null> {
  try {
    // Define a type for the actual backend response structure for a single article
    // El backend envuelve el artículo en un objeto con "message" y "data"
    type BackendSingleArticleResponse = {
      message: string;
      data: IArticleFrontEnd; // El artículo real está anidado aquí
    };

    const response = await apiClient.get<BackendSingleArticleResponse>(
      `/articles/slug/${slug}`
    );
    // Extraer el artículo de response.data.data para que coincida con IArticleFrontEnd
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null; // Convention: return null if not found
    }
    console.error(`Error fetching article by slug ${slug}:`, error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch article."
    );
  }
}

/**
 * Fetches a single article by its ID.
 * @param id - The ID of the article to fetch.
 * @returns A promise that resolves to the article object or null if not found.
 */
async function getArticleById(id: number): Promise<IArticleFrontEnd | null> {
  try {
    type BackendSingleArticleResponse = {
      message: string;
      data: IArticleFrontEnd;
    };
    const response = await apiClient.get<BackendSingleArticleResponse>(
      `/articles/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error(`Error fetching article by id ${id}:`, error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch article by id."
    );
  }
}

/**
 * Fetches the list of unique article categories from the backend.
 * @returns A promise that resolves to an array of category strings.
 */
async function getUniqueCategories(): Promise<string[]> {
  try {
    type BackendCategoriesResponse = {
      message: string;
      categories: string[];
    };
    const response = await apiClient.get<BackendCategoriesResponse>(
      "/articles/categories"
    );
    return response.data.categories || []; // Return an empty array if categories are null/undefined
  } catch (error: any) {
    console.error("Error fetching unique categories:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch categories."
    );
  }
}

/**
 * Interface for pagination and filter parameters when fetching current user's articles.
 */
export interface GetMyArticlesParams {
  limit?: number;
  offset?: number;
  searchTerm?: string;
}

/**
 * Fetches a list of articles authored by the current authenticated user,
 * with optional pagination and search.
 * @param params - Optional query parameters for limit, offset, searchTerm.
 * @returns A promise that resolves to an object containing the list of articles and total count.
 */
async function getMyArticles(
  params?: GetMyArticlesParams
): Promise<GetArticlesResponse> {
  try {
    type BackendApiResponse = {
      message: string;
      data: IArticleFrontEnd[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
      };
    };

    // Map frontend `searchTerm` to backend `q`
    const apiParams: Record<string, any> = {};
    if (params) {
      if (params.limit !== undefined) apiParams.limit = params.limit;
      if (params.offset !== undefined) apiParams.offset = params.offset;
      if (params.searchTerm !== undefined) apiParams.q = params.searchTerm; // Renaming here
    }

    const response = await apiClient.get<BackendApiResponse>(
      "/articles/my-articles",
      {
        params: apiParams, // Use the mapped params
      }
    );
    return {
      articles: response.data.data,
      totalCount: response.data.pagination.totalItems,
    };
  } catch (error: any) {
    console.error("Error fetching user's articles:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch user's articles."
    );
  }
}

/**
 * Type for the data required to create an article from the frontend.
 * Matches the expected fields for the backend's ICreateArticleDTO.
 */
export type CreateArticlePayload = {
  title: string;
  content: string;
  excerpt?: string; // Optional
  image_url?: string; // Optional
  category?: string; // Optional
  slug?: string; // Optional (backend will generate if not provided or empty)
  published_at?: string; // Optional, backend might default to NOW()
};

/**
 * Creates a new article.
 * Calls the backend POST /articles endpoint.
 * @param articleData - The data for the new article.
 * @returns A promise that resolves to the newly created article.
 */
async function createArticle(
  articleData: CreateArticlePayload
): Promise<IArticleFrontEnd> {
  try {
    // The backend expects the data directly in the body for POST /articles
    // and will return the created article, which should match IArticleFrontEnd
    // after author details are added and timestamps are generated.
    type BackendCreateResponse = {
      message: string;
      data: IArticleFrontEnd; // The created article
    };

    const response = await apiClient.post<BackendCreateResponse>(
      "/articles",
      articleData
    );
    return response.data.data; // The actual article object
  } catch (error: any) {
    console.error("Error creating article:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to create article."
    );
  }
}

/**
 * Type for the data payload when updating an article.
 * All fields are optional.
 */
export type UpdateArticlePayload = Partial<CreateArticlePayload>; // Can reuse CreateArticlePayload and make all fields optional

/**
 * Updates an existing article by its ID.
 * Calls the backend PUT /articles/:id endpoint.
 * @param id - The ID of the article to update.
 * @param articleData - An object containing the fields to update.
 * @returns A promise that resolves to the updated article.
 */
async function updateArticle(
  id: number,
  articleData: UpdateArticlePayload
): Promise<IArticleFrontEnd> {
  try {
    // The backend expects the data in the body for PUT /articles/:id
    // and should return the updated article.
    type BackendUpdateResponse = {
      message: string;
      data: IArticleFrontEnd; // The updated article
    };
    const response = await apiClient.put<BackendUpdateResponse>(
      `/articles/${id}`,
      articleData
    );
    return response.data.data; // The actual updated article object
  } catch (error: any) {
    console.error(`Error updating article with id ${id}:`, error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update article."
    );
  }
}

/**
 * Deletes an article by its ID.
 * Calls the backend DELETE /articles/:id endpoint.
 * @param id - The ID of the article to delete.
 * @returns A promise that resolves when the article is successfully deleted.
 */
async function deleteArticle(id: number): Promise<void> {
  try {
    await apiClient.delete(`/articles/${id}`);
  } catch (error: any) {
    console.error(`Error deleting article with id ${id}:`, error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to delete article."
    );
  }
}

export const articleService = {
  getAllArticles,
  getArticleBySlug,
  getArticleById,
  getUniqueCategories,
  getMyArticles,
  createArticle,
  updateArticle,
  deleteArticle,
};
