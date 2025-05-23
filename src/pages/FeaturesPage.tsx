import MainLayout from "@/components/layout/MainLayout";
import BlogList from "@/components/blog/BlogList";
// import { mockArticles } from "@/data/mockArticles"; // Remove mock
import HeroSection from "@/components/layout/HeroSection";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { articleService } from "@/services/articleService";
import type { IArticleFrontEnd } from "@/types/article.types";
import { Loader2, AlertTriangle } from "lucide-react";

interface FeaturedSection {
  category: string;
  articles: IArticleFrontEnd[];
  isLoading: boolean;
  error: string | null;
}

const ARTICLES_PER_FEATURED_CATEGORY = 3;

export default function FeaturesPage() {
  const [featuredSections, setFeaturedSections] = useState<FeaturedSection[]>(
    []
  );
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      setIsLoadingCategories(true);
      setCategoriesError(null);
      setFeaturedSections([]); // Reset on new fetch

      try {
        const categories = await articleService.getUniqueCategories();
        if (categories.length === 0) {
          setIsLoadingCategories(false);
          return; // No categories, nothing to feature
        }

        // Initialize sections with loading state
        const initialSections = categories.map((cat) => ({
          category: cat,
          articles: [],
          isLoading: true,
          error: null,
        }));
        setFeaturedSections(initialSections);
        setIsLoadingCategories(false); // Categories loaded, now load articles for each

        // Fetch articles for each category
        categories.forEach(async (categoryName, index) => {
          try {
            const response = await articleService.getAllArticles({
              category: categoryName,
              limit: ARTICLES_PER_FEATURED_CATEGORY,
            });
            setFeaturedSections((prevSections) =>
              prevSections.map((section, i) =>
                i === index
                  ? {
                      ...section,
                      articles: response.articles || [],
                      isLoading: false,
                    }
                  : section
              )
            );
          } catch (err: any) {
            console.error(
              `Failed to fetch articles for category ${categoryName}:`,
              err
            );
            setFeaturedSections((prevSections) =>
              prevSections.map((section, i) =>
                i === index
                  ? {
                      ...section,
                      error: err.message || "Failed to load articles",
                      isLoading: false,
                    }
                  : section
              )
            );
          }
        });
      } catch (err: any) {
        console.error("Failed to fetch unique categories:", err);
        setCategoriesError(
          err.message ||
            "An unexpected error occurred while fetching categories."
        );
        setIsLoadingCategories(false);
      }
    };

    fetchFeaturedContent();
  }, []);

  return (
    <MainLayout>
      <HeroSection
        title="Featured Topics"
        subtitle="Discover curated articles across our key areas of expertise and interest."
        imageUrl="https://images.unsplash.com/photo-1475085807956-5e76cdaf6639?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <div className="container mx-auto px-4 py-12 md:py-16">
        {isLoadingCategories && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
            <p className="ml-3 text-gray-600 text-lg">
              Loading featured topics...
            </p>
          </div>
        )}

        {categoriesError && !isLoadingCategories && (
          <div className="text-center py-10 text-red-600 bg-red-50 p-6 rounded-lg shadow-md">
            <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-red-500" />
            <p className="text-xl font-semibold">Failed to load categories</p>
            <p className="text-md">{categoriesError}</p>
          </div>
        )}

        {!isLoadingCategories &&
          !categoriesError &&
          featuredSections.length === 0 && (
            <p className="text-center text-gray-500 text-lg py-10">
              No featured topics available at the moment.
            </p>
          )}

        {!isLoadingCategories &&
          !categoriesError &&
          featuredSections.map((section) => {
            if (section.isLoading) {
              return (
                <div key={section.category} className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 pl-2 border-l-4 border-orange-500">
                    {section.category} Highlights
                  </h2>
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-orange-400" />
                    <p className="ml-3 text-gray-500">
                      Loading articles for {section.category}...
                    </p>
                  </div>
                </div>
              );
            }

            if (section.error) {
              return (
                <div key={section.category} className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 pl-2 border-l-4 border-orange-500">
                    {section.category} Highlights
                  </h2>
                  <div className="text-red-500 bg-red-50 p-4 rounded-md">
                    <AlertTriangle className="inline-block mr-2 h-5 w-5" />
                    Error loading articles for {section.category}:{" "}
                    {section.error}
                  </div>
                </div>
              );
            }

            // Only render the section if there are articles to show for it, even after loading and no error.
            if (section.articles.length === 0) {
              return null;
            }

            return (
              <div key={section.category} className="mb-16">
                <BlogList
                  articles={section.articles}
                  listTitle={`${section.category} Highlights`}
                  showPagination={false} // No pagination for featured sections on this page
                />
                <div className="text-center mt-8">
                  <Link
                    to={`/category/${encodeURIComponent(
                      section.category.toLowerCase()
                    )}`}
                    className="text-orange-500 hover:text-orange-600 font-semibold text-lg"
                  >
                    View all in {section.category} &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
      </div>
    </MainLayout>
  );
}
