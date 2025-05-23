import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import BlogEditor from "@/components/blog/BlogEditor";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import { mockArticles, type Article } from "@/data/mockArticles";
import { ProtectedRoute } from "@/utils/ProtectedRoute";
import HeroSection from "@/components/layout/HeroSection";

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
  const [articleToEdit, setArticleToEdit] = useState<
    Article | null | undefined
  >(undefined); // undefined for loading, null for not found
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const article = mockArticles.find((art) => art.id === postId);
    if (article) {
      // Ensure the current user is the author of the post
      if (currentUser && article.authorId === currentUser.id) {
        setArticleToEdit(article);
      } else {
        setError("You are not authorized to edit this post.");
        setArticleToEdit(null); // Mark as not found or unauthorized
        // Optionally navigate away or show a more prominent error page
      }
    } else {
      setError("Post not found.");
      setArticleToEdit(null); // Mark as not found
    }
  }, [postId, currentUser]);

  const handleEditPost = async (formData: Partial<Article>) => {
    if (!currentUser) {
      setError("You must be logged in to edit a post.");
      return;
    }
    if (!articleToEdit || articleToEdit.authorId !== currentUser.id) {
      setError(
        "You are not authorized to edit this post or the post is not loaded correctly."
      );
      return;
    }
    if (
      !formData.title ||
      !formData.content ||
      !formData.category ||
      !formData.imageLink ||
      !formData.slug
    ) {
      setError(
        "Please fill in all required fields: Title, Slug, Content, Category, and Image URL."
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      const updatedArticle: Article = {
        ...articleToEdit, // Spread existing fields
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        category: formData.category,
        imageLink: formData.imageLink,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + "...",
        updatedDate: new Date().toISOString(), // Update the updatedDate
        // author, authorId, publishDate, id remain the same from articleToEdit
      };

      const articleIndex = mockArticles.findIndex((art) => art.id === postId);
      if (articleIndex !== -1) {
        mockArticles[articleIndex] = updatedArticle;
        console.log("Post updated:", updatedArticle);
        navigate("/my-works");
      } else {
        throw new Error("Failed to find the article to update in mock data.");
      }
    } catch (err) {
      console.error("Failed to update post:", err);
      setError(
        "An unexpected error occurred while updating the post. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (articleToEdit === undefined) {
    // Loading state
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="container mx-auto px-4 py-12 text-center">
            <p className="text-lg text-gray-600">Loading post for editing...</p>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (articleToEdit === null) {
    // Not found or unauthorized
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-lg text-gray-700 mb-6">
              {error || "Could not load the post for editing."}
            </p>
            <Link
              to="/my-works"
              className="text-orange-500 hover:text-orange-700 underline"
            >
              Back to My Works
            </Link>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <HeroSection
        title="Update your thoughts"
        subtitle="Update your post to be more accurate and informative."
        imageUrl="https://images.unsplash.com/photo-1701442876057-0bcbe9317600?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 text-center">
            Edit Post
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <BlogEditor
            articleToEdit={articleToEdit}
            onSubmit={handleEditPost}
            isSubmitting={isSubmitting}
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
