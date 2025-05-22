import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/layout/HeroSection";
import { mockArticles } from "@/data/mockArticles";
import { Link } from "react-router-dom";
import BlogCardPost from "@/components/blog/BlogCardPost";
// import BlogList from "@/components/blog/BlogList"; // Example for later

export default function HomePage() {
  const displayedArticles = mockArticles.slice(0, 6);

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

        {displayedArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedArticles.map((article) => (
              <BlogCardPost key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
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
