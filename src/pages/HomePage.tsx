import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/layout/HeroSection";
import { Link } from "react-router-dom";
import BlogCardPost from "@/components/blog/BlogCardPost";
import { useEffect, useState } from "react"; // Import useEffect and useState
import { articleService } from "@/services/articleService"; // Import articleService
import type { IArticleFrontEnd } from "@/types/article.types"; // Import IArticleFrontEnd
import { AlertTriangle, Loader2 } from "lucide-react"; // For loading/error display
// import BlogList from "@/components/blog/BlogList"; // Example for later

export default function HomePage() {
  const [articles, setArticles] = useState<IArticleFrontEnd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await articleService.getAllArticles({ limit: 6 });
        console.log(
          "[HomePage Effect] Fetched response.articles:",
          response.articles
        );
        setArticles(response.articles || []);
      } catch (err: any) {
        console.error(
          "[HomePage Effect] Failed to fetch latest articles:",
          err
        );
        setError(
          err.message || "An unexpected error occurred while fetching posts."
        );
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  console.log("[HomePage Render] State:", { isLoading, error, articles });

  return (
    <MainLayout>
      <HeroSection
        title="Welcome to our blog"
        subtitle="Blogging about the latest trends in technology and software development"
        imageUrl="https://images.unsplash.com/photo-1523657895111-376b5d07a55a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
          Latest Posts
        </h2>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
            <p className="ml-3 text-gray-600 text-lg">Loading posts...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-10 text-red-600 bg-red-50 p-6 rounded-lg shadow-md">
            <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-red-500" />
            <p className="text-xl font-semibold">Failed to load posts</p>
            <p className="text-md">{error}</p>
          </div>
        )}

        {!isLoading && !error && articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <BlogCardPost key={article.id} article={article} />
            ))}
          </div>
        ) : null}

        {!isLoading && !error && articles.length === 0 && (
          <p className="text-center text-gray-500 py-10 text-lg">
            No posts available at the moment.
          </p>
        )}

        {/* You could add a "View More Posts" button here later */}
        <div className="text-center mt-12">
          <Link
            to="/posts"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
