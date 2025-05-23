import MainLayout from "@/components/layout/MainLayout";
import BlogList from "@/components/blog/BlogList";
import { useSearchParams, useNavigate } from "react-router-dom"; // Import useNavigate
import HeroSection from "@/components/layout/HeroSection";
import { useEffect, useState } from "react";
import { articleService } from "@/services/articleService";
import type { IArticleFrontEnd } from "@/types/article.types";
import { AlertTriangle, Loader2 } from "lucide-react";

const POSTS_PER_PAGE = 9;

export default function PostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate(); // For navigation if needed, though setSearchParams often handles it

  const [articles, setArticles] = useState<IArticleFrontEnd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [totalPages, setTotalPages] = useState(1);

  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      const pageQueryParam = parseInt(searchParams.get("page") || "1", 10);
      setCurrentPage(pageQueryParam);
      const currentSearchTerm = searchParams.get("q") || undefined;

      try {
        const offset = (pageQueryParam - 1) * POSTS_PER_PAGE;
        const response = await articleService.getAllArticles({
          limit: POSTS_PER_PAGE,
          offset,
          searchTerm: currentSearchTerm,
        });
        setArticles(response.articles || []);
        setTotalPages(Math.ceil(response.totalCount / POSTS_PER_PAGE));
        // setTotalItems(response.totalCount);
      } catch (err: any) {
        console.error("Failed to fetch posts:", err);
        setError(
          err.message || "An unexpected error occurred while fetching posts."
        );
        setArticles([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [searchParams]); // Re-fetch when searchParams (page or q) change

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    setSearchParams(newSearchParams);
    // Optional: scroll to top
    window.scrollTo(0, 0);
  };

  const pageTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : "All Blog Posts";

  return (
    <MainLayout>
      <HeroSection
        title={searchQuery ? "Search Results" : "All the news in one place"}
        subtitle={
          searchQuery
            ? `Showing results for "${searchQuery}"`
            : "Explore our latest articles and stories about the latest trends in technology and software development"
        }
        imageUrl="https://images.unsplash.com/photo-1690983322196-14cd17db3dd4?q=80&w=2008&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <div className="bg-slate-50 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {pageTitle}
          </h1>
          {!searchQuery && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our latest articles, insights, and stories. Find content
              on various topics including web development, design, and more.
            </p>
          )}
          {searchQuery && !isLoading && articles.length === 0 && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              No articles found matching your search criteria. Try a different
              term.
            </p>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-16 w-16 animate-spin text-orange-500" />
          <p className="ml-4 text-gray-700 text-xl">Loading articles...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="container mx-auto px-4 py-10 text-center text-red-600 bg-red-50 p-8 rounded-lg shadow-lg">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-2xl font-semibold">Failed to load articles</p>
          <p className="text-lg">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <BlogList
          articles={articles}
          // listTitle={searchQuery ? undefined : "Browse All Posts"} // Optional: can add a title if desired
          showPagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </MainLayout>
  );
}
