import MainLayout from "@/components/layout/MainLayout";
import BlogList from "@/components/blog/BlogList";
import { mockArticles, type Article } from "@/data/mockArticles";
import { useSearchParams } from "react-router-dom"; // To handle potential search queries
import HeroSection from "@/components/layout/HeroSection";

export default function PostsPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

  // Filter articles based on search query if present
  const filteredArticles = searchQuery
    ? mockArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockArticles;

  const pageTitle = searchQuery
    ? `Search Results for "${searchQuery}"`
    : "All Blog Posts";

  return (
    <MainLayout>
      <HeroSection
        title="All the news in one place"
        subtitle="Explore our latest articles and stories about the latest trends in technology and software development"
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
          {searchQuery && filteredArticles.length === 0 && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              No articles found matching your search criteria. Try a different
              term.
            </p>
          )}
        </div>
      </div>

      {/* Pass all articles or filtered articles to BlogList */}
      {/* The BlogList component itself has a container, so we don't need one here if BlogList uses its own full-width section */}
      <BlogList articles={filteredArticles} />
    </MainLayout>
  );
}
