import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/layout/HeroSection";
import { Separator } from "@/components/ui/separator";
import BlogCardPost from "@/components/blog/BlogCardPost";
import type { IArticleFrontEnd } from "@/types/article.types";
import { articleService } from "@/services/articleService";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react"; // Added useState, useEffect

export default function HomePage() {
  const [articles, setArticles] = useState<IArticleFrontEnd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Make sure to use the correct service import and method call
        const response = await articleService.getAllArticles({ limit: 6 });
        setArticles(response.articles || []);
      } catch (err: any) {
        setError(
          err.message || "An unexpected error occurred while fetching posts."
        );
        setArticles([]); // Clear articles on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestArticles();
  }, []); // Empty dependency array to run once on mount

  return (
    <MainLayout>
      <HeroSection
        title="Welcome to our blog"
        subtitle="Blogging about the latest trends in technology and software development"
        imageUrl="https://images.unsplash.com/photo-1523657895111-376b5d07a55a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <section className="py-8 md:py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
            Latest Posts
          </h2>

          {isLoading && (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-red-600">
              <AlertTriangle className="h-12 w-12 mb-2" />
              <p className="text-lg">{error}</p>
            </div>
          )}

          {!isLoading && !error && articles && articles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <BlogCardPost key={article.id} article={article} />
              ))}
            </div>
          )}

          {!isLoading && !error && (!articles || articles.length === 0) && (
            <p className="text-center text-gray-600 text-lg min-h-[200px] flex items-center justify-center">
              No posts available at the moment.
            </p>
          )}
          <Separator className="my-8 md:my-12" />
          <div className="text-center mt-8 md:mt-12">
            <h3 className="text-2xl font-semibold mb-4">More to Explore</h3>
            <p className="text-gray-600 mb-6">
              Check out our categories or sign up for the newsletter!
            </p>
            <Link
              to="/posts"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
