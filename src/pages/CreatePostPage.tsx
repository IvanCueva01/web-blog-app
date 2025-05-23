import MainLayout from "@/components/layout/MainLayout"; // May not be needed if BlogEditor has its own button
import { ProtectedRoute } from "@/utils/ProtectedRoute";
import {
  articleService,
  type CreateArticlePayload,
} from "@/services/articleService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import HeroSection from "@/components/layout/HeroSection";
import BlogEditor from "@/components/blog/BlogEditor"; // Import BlogEditor
import type { Article as BlogEditorArticleData } from "@/data/mockArticles"; // Type from BlogEditor's perspective

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed from isLoading for clarity with BlogEditor prop
  const [error, setError] = useState<string | null>(null);

  // This function will be passed to BlogEditor's onSubmit prop
  async function handleCreatePostSubmit(
    formData: Partial<BlogEditorArticleData>
  ) {
    setIsSubmitting(true);
    setError(null);

    // Validate required fields from BlogEditor's perspective if not already done inside
    // BlogEditor itself should ideally handle its own basic validations before calling onSubmit
    if (
      !formData.title ||
      !formData.content ||
      !formData.category ||
      !formData.imageLink
    ) {
      setError(
        "Title, content, category, and image URL are required. Please fill them out in the editor."
      );
      setIsSubmitting(false);
      return;
    }

    const payload: CreateArticlePayload = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      image_url: formData.imageLink, // Map imageLink to image_url
      excerpt: formData.excerpt || undefined, // excerpt is optional
      slug: formData.slug || undefined, // slug is optional, backend can generate
      // published_at will be handled by the backend or default to now
    };

    try {
      const newArticle = await articleService.createArticle(payload);
      // Optionally, show a success toast/message here
      navigate(`/posts/${newArticle.slug}`); // Navigate to the new post
    } catch (err: any) {
      console.error("Failed to create article:", err);
      setError(
        err.message || "An unexpected error occurred while creating the post."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ProtectedRoute>
      <HeroSection
        title="Create New Post"
        subtitle="Share your thoughts and ideas with the world."
        imageUrl="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <MainLayout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {" "}
          {error && (
            <div
              className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
              role="alert"
            >
              <strong className="font-bold">
                <AlertTriangle className="inline mr-2 h-5 w-5" />
                Error:{" "}
              </strong>
              <span className="block sm:inline">{error}</span>
              {/* Optional: Add a button to clear error or retry certain actions */}
            </div>
          )}
          <BlogEditor
            onSubmit={handleCreatePostSubmit}
            isSubmitting={isSubmitting}
            // articleToEdit is not passed, so BlogEditor will be in create mode
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
