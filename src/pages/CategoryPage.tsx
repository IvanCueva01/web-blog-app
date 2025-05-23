import MainLayout from "@/components/layout/MainLayout";
import BlogList from "@/components/blog/BlogList";
// import { mockArticles, type Article } from "@/data/mockArticles"; // Remove mock
import HeroSection from "@/components/layout/HeroSection";
import { useParams, useSearchParams } from "react-router-dom"; // Add useSearchParams
import { useEffect, useState } from "react";
import { articleService } from "@/services/articleService"; // Import service
import type { IArticleFrontEnd } from "@/types/article.types"; // Import type
import { Loader2, AlertTriangle } from "lucide-react"; // Import icons

const POSTS_PER_PAGE = 9;
const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function CategoryPage() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [articles, setArticles] = useState<IArticleFrontEnd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [totalPages, setTotalPages] = useState(1);

  const [pageTitle, setPageTitle] = useState("Category Posts");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Explore articles in this category."
  );
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO_IMAGE);

  useEffect(() => {
    if (!categoryName) {
      setError("Category name not provided.");
      setIsLoading(false);
      setArticles([]);
      setPageTitle("Category Not Found");
      setHeroSubtitle("Please select a valid category.");
      return;
    }

    const decodedCategoryName = decodeURIComponent(categoryName);
    const title =
      decodedCategoryName.charAt(0).toUpperCase() +
      decodedCategoryName.slice(1);
    setPageTitle(`${title} Articles`);
    setHeroSubtitle(`Discover all articles related to ${title}.`);

    const fetchCategoryPosts = async () => {
      setIsLoading(true);
      setError(null);
      const pageQueryParam = parseInt(searchParams.get("page") || "1", 10);
      setCurrentPage(pageQueryParam);

      try {
        const offset = (pageQueryParam - 1) * POSTS_PER_PAGE;
        const response = await articleService.getAllArticles({
          category: decodedCategoryName,
          limit: POSTS_PER_PAGE,
          offset,
        });

        setArticles(response.articles || []);
        setTotalPages(Math.ceil(response.totalCount / POSTS_PER_PAGE));

        // Update hero image if articles are found, otherwise use default
        if (
          response.articles &&
          response.articles.length > 0 &&
          response.articles[0].image_url
        ) {
          setHeroImage(response.articles[0].image_url);
        } else {
          setHeroImage(DEFAULT_HERO_IMAGE);
        }
      } catch (err: any) {
        console.error(
          `Failed to fetch posts for category ${decodedCategoryName}:`,
          err
        );
        setError(
          err.message ||
            `An unexpected error occurred while fetching posts for ${decodedCategoryName}.`
        );
        setArticles([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [categoryName, searchParams]);

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    setSearchParams(newSearchParams);
    window.scrollTo(0, 0);
  };

  if (!categoryName) {
    // Should be caught by useEffect, but as a safeguard
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-red-500" />
          <h1 className="text-3xl font-bold text-red-600">
            Category Not Provided
          </h1>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <HeroSection
        title={pageTitle}
        subtitle={heroSubtitle}
        imageUrl={heroImage}
      />
      <div className="bg-slate-50 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          {/* Optional: Additional intro text if needed, title is in Hero */}
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
              <p className="ml-3 text-gray-600 text-lg">Loading articles...</p>
            </div>
          )}
          {error && !isLoading && (
            <div className="text-red-600 bg-red-50 p-6 rounded-lg shadow-md">
              <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-red-500" />
              <p className="text-xl font-semibold">Failed to load articles</p>
              <p className="text-md">{error}</p>
            </div>
          )}
          {!isLoading && !error && articles.length === 0 && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              No articles found for the category "
              {decodeURIComponent(categoryName)}".
            </p>
          )}
        </div>
      </div>

      {!isLoading && !error && articles.length > 0 && (
        <BlogList
          articles={articles}
          // listTitle={`All ${pageTitle}`} // Title is already prominent
          showPagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </MainLayout>
  );
}
