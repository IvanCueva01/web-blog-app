import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import BlogEditor from "@/components/blog/BlogEditor";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { ProtectedRoute } from "@/utils/ProtectedRoute";
import HeroSection from "@/components/layout/HeroSection";
import {
  articleService,
  type UpdateArticlePayload,
} from "@/services/articleService";
import { Loader2, AlertTriangle } from "lucide-react";
import type { IArticleFrontEnd } from "@/types/article.types"; // Main frontend type
import type { Article as BlogEditorArticleData } from "@/data/mockArticles"; // Type from BlogEditor

// Function to generate a simple slug (can be reused or moved to utils)
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function EditPostPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const [articleToEdit, setArticleToEdit] = useState<IArticleFrontEnd | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async () => {
    if (!postId) {
      setError("Article ID not found in URL.");
      setIsLoadingData(false);
      return;
    }
    const numericPostId = parseInt(postId, 10);
    if (isNaN(numericPostId)) {
      setError("Invalid Article ID format.");
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    try {
      const fetchedArticle = await articleService.getArticleById(numericPostId);
      if (fetchedArticle) {
        setArticleToEdit(fetchedArticle);
      } else {
        setError("Article not found or you don't have permission to edit it.");
      }
    } catch (err: any) {
      console.error("Failed to fetch article for editing:", err);
      setError(
        err.message ||
          "An unexpected error occurred while fetching the article."
      );
    } finally {
      setIsLoadingData(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  async function handleUpdatePostSubmit(
    formData: Partial<BlogEditorArticleData>
  ) {
    if (!articleToEdit) {
      setError("No article loaded to update.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    // Basic validation - BlogEditor should ideally handle its own required fields
    if (
      !formData.title ||
      !formData.content ||
      !formData.category ||
      !formData.imageLink
    ) {
      setError("Title, content, category, and image URL are required.");
      setIsSubmitting(false);
      return;
    }

    const payload: UpdateArticlePayload = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      image_url: formData.imageLink, // Map from BlogEditor's field name
      excerpt: formData.excerpt || undefined,
      slug: formData.slug || undefined,
      // published_at could be updated if your DTO and service support it
    };

    try {
      const updatedArticle = await articleService.updateArticle(
        articleToEdit.id,
        payload
      );
      // Optionally, show a success toast/message here
      navigate(`/posts/${updatedArticle.slug}`); // Navigate to the updated post
    } catch (err: any) {
      console.error("Failed to update article:", err);
      setError(
        err.message || "An unexpected error occurred while updating the post."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const mapToBlogEditorData = (
    article: IArticleFrontEnd | null
  ): BlogEditorArticleData | null => {
    if (!article) return null;

    const authorUsername = article.author
      ? article.author.username
      : "Unknown Author";
    const authorId = article.author
      ? article.author.id.toString()
      : "unknown-author-id";
    const authorAvatar =
      article.author && article.author.avatar_url
        ? article.author.avatar_url
        : undefined;

    return {
      id: article.id.toString(),
      title: article.title,
      content: article.content,
      category: article.category || "",
      imageLink: article.image_url || "",
      slug: article.slug || "",
      excerpt: article.excerpt || "",
      author: authorUsername,
      authorId: authorId,
      publishDate: article.published_at || new Date().toISOString(),
      updatedDate: article.updated_at || new Date().toISOString(),
      authorImageLink: authorAvatar,
    };
  };

  const editorInitialData = mapToBlogEditorData(articleToEdit);

  if (isLoadingData) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto text-orange-500" />
          <p className="text-lg text-gray-600 mt-4">Loading article data...</p>
        </div>
      </MainLayout>
    );
  }

  if (error && !articleToEdit) {
    // If there was an error fetching and no article data
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-red-500" />
          <h1 className="text-3xl font-bold text-red-600">
            Error Loading Article
          </h1>
          <p className="text-lg text-gray-600 mt-4">{error}</p>
          <button
            onClick={() => navigate("/my-works")}
            className="mt-6 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            Back to My Works
          </button>
        </div>
      </MainLayout>
    );
  }

  if (!articleToEdit && !isLoadingData) {
    // Fallback if no article and not loading (e.g. not found after load attempt)
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-gray-400" />
          <h1 className="text-3xl font-bold text-gray-700">
            Article Not Found
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            The article you are trying to edit could not be found.
          </p>
          <button
            onClick={() => navigate("/my-works")}
            className="mt-6 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            Back to My Works
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <ProtectedRoute>
      <HeroSection
        title={`Edit Article: ${articleToEdit?.title || ""}`}
        subtitle="Refine your masterpiece and update its details."
        imageUrl={
          articleToEdit?.image_url ||
          "https://images.unsplash.com/photo-1455390587152-4da1c67def48?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
      />
      <MainLayout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {error &&
            !isSubmitting && ( // Show submission errors separately
              <div
                className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <strong className="font-bold">
                  <AlertTriangle className="inline mr-2 h-5 w-5" />
                  Error:{" "}
                </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

          {editorInitialData && (
            <BlogEditor
              articleToEdit={editorInitialData} // Pass mapped data
              onSubmit={handleUpdatePostSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
