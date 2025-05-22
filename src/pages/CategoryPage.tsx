import MainLayout from "@/components/layout/MainLayout";
import BlogList from "@/components/blog/BlogList";
import { mockArticles, type Article } from "@/data/mockArticles";
import HeroSection from "@/components/layout/HeroSection";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [pageTitle, setPageTitle] = useState("Category Posts");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Explore articles in this category."
  );

  useEffect(() => {
    if (categoryName) {
      const decodedCategoryName = decodeURIComponent(categoryName);
      const categoryArticles = mockArticles.filter(
        (article) =>
          article.category.toLowerCase() === decodedCategoryName.toLowerCase()
      );
      setArticles(categoryArticles);
      // Capitalize first letter of category for title
      const title =
        decodedCategoryName.charAt(0).toUpperCase() +
        decodedCategoryName.slice(1);
      setPageTitle(`${title} Articles`);
      setHeroSubtitle(`Discover all articles related to ${title}.`);
    } else {
      setArticles([]); // Handle case where categoryName might be undefined
      setPageTitle("Category Not Found");
      setHeroSubtitle("Please select a valid category.");
    }
  }, [categoryName]);

  // Determine a relevant hero image - this is a placeholder, you might want more specific logic
  const heroImage =
    articles.length > 0 && articles[0].imageLink
      ? articles[0].imageLink
      : "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Default category image

  return (
    <MainLayout>
      <HeroSection
        title={pageTitle}
        subtitle={heroSubtitle}
        imageUrl={heroImage}
      />
      <div className="bg-slate-50 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          {/* The title is already in the HeroSection, but you could add more introductory text here if needed */}
          {articles.length === 0 && categoryName && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              No articles found for the category "
              {decodeURIComponent(categoryName)}".
            </p>
          )}
        </div>
      </div>
      {/* showPagination will default to true, which is what we want here */}
      <BlogList articles={articles} listTitle={`All ${pageTitle}`} />
    </MainLayout>
  );
}
