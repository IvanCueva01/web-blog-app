import MainLayout from "@/components/layout/MainLayout";
import BlogList from "@/components/blog/BlogList";
import { mockArticles } from "@/data/mockArticles";
import HeroSection from "@/components/layout/HeroSection"; // Optional: if you want a hero for this page too
import { Link } from "react-router-dom";

export default function FeaturesPage() {
  // 1. Get unique categories from all articles
  const allCategories = mockArticles.map((article) => article.category);
  const uniqueCategories = [...new Set(allCategories)];

  return (
    <MainLayout>
      <HeroSection
        title="Featured Topics"
        subtitle="Discover curated articles across our key areas of expertise and interest."
        imageUrl="https://images.unsplash.com/photo-1475085807956-5e76cdaf6639?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <div className="container mx-auto px-4 py-12 md:py-16">
        {uniqueCategories.map((category) => {
          // 2. Filter articles for the current category
          const articlesInCategory = mockArticles.filter(
            (article) => article.category === category
          );

          // Optional: Limit the number of articles shown per category on this page
          const articlesToShow = articlesInCategory.slice(0, 3); // Show first 3

          if (articlesToShow.length > 0) {
            return (
              <div key={category} className="mb-16">
                <BlogList
                  articles={articlesToShow}
                  listTitle={`${category} Highlights`}
                  showPagination={false}
                />
                {/* You could add a "View all [Category] posts" link here */}
                <div className="text-center mt-8">
                  <Link
                    to={`/category/${category.toLowerCase()}`}
                    className="text-orange-500 hover:text-orange-600 font-semibold"
                  >
                    View all in {category} &rarr;
                  </Link>
                </div>
              </div>
            );
          }
          return null; // Don't render a section if no articles for that category
        })}

        {uniqueCategories.length === 0 && (
          <p className="text-center text-gray-500 text-lg">
            No featured categories available at the moment.
          </p>
        )}
      </div>
    </MainLayout>
  );
}
