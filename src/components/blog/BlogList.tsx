import { type Article } from "@/data/mockArticles";
import BlogCardPost from "./BlogCardPost"; // Assuming BlogCardPost is in the same directory
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface BlogListProps {
  articles: Article[];
  listTitle?: string; // Optional title for the list section
  showPagination?: boolean; // New prop
  postsPerPage?: number; // Allow customization of posts per page
}

const DEFAULT_POSTS_PER_PAGE = 9; // Default if not provided

export default function BlogList({
  articles,
  listTitle,
  showPagination = true,
  postsPerPage = DEFAULT_POSTS_PER_PAGE, // Use prop or default
}: BlogListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 if the articles array changes (e.g., due to filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [articles]); // Dependency is the articles array itself

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No articles found.</p>
        {listTitle && (
          <p className="text-gray-400 text-sm">Related to: {listTitle}</p>
        )}
      </div>
    );
  }

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = articles.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(articles.length / postsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <section className="py-8">
      {listTitle && (
        <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
          {listTitle}
        </h2>
      )}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentPosts.map((article) => {
          // Display currentPosts, not all articles
          return <BlogCardPost key={article.id} article={article} />;
        })}
      </div>

      {showPagination && articles.length > postsPerPage && (
        <div className="mt-12 pb-12 flex justify-center items-center space-x-4">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {totalPages > 1 &&
            Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => setCurrentPage(index + 1)}
                className={`${
                  currentPage === index + 1
                    ? "bg-orange-500 text-white hover:bg-orange-500 hover:text-white"
                    : "hover:bg-orange-500 hover:text-white"
                }`}
              >
                {index + 1}
              </Button>
            ))}
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}
