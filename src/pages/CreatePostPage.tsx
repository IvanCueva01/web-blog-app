import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import BlogEditor from "@/components/blog/BlogEditor";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { mockArticles, type Article } from "@/data/mockArticles";
import { ProtectedRoute } from "@/utils/ProtectedRoute"; // Assuming you have this component
import { v4 as uuidv4 } from "uuid";
import HeroSection from "@/components/layout/HeroSection";

// Function to generate a simple slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word chars with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

export default function CreatePostPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePost = async (formData: Partial<Article>) => {
    if (!currentUser) {
      setError("You must be logged in to create a post.");
      return;
    }
    // Validate required fields from BlogEditor
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newArticle: Article = {
        id: uuidv4(),
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title), // Slug is now required from BlogEditor
        content: formData.content,
        category: formData.category,
        imageLink: formData.imageLink,
        author: currentUser.name,
        authorId: currentUser.id,
        authorImageLink: currentUser.avatar || undefined,
        publishDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        excerpt: formData.excerpt || formData.content.substring(0, 150) + "...",
      };

      // In a real app, you would send this to your backend API
      mockArticles.unshift(newArticle); // Add to the beginning of the array

      console.log("New post created:", newArticle);
      navigate("/my-works");
    } catch (err) {
      console.error("Failed to create post:", err);
      setError(
        "An unexpected error occurred while creating the post. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <HeroSection
        title="Share your thoughts"
        subtitle="Create a new post to share with the world."
        imageUrl="https://images.unsplash.com/photo-1701442876057-0bcbe9317600?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10 text-center">
            Create New Post
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <BlogEditor
            onSubmit={handleCreatePost}
            isSubmitting={isSubmitting}
            // articleToEdit is not passed, so BlogEditor will be in create mode
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
