import type { IArticleFrontEnd } from "@/types/article.types"; // Import IArticleFrontEnd
import BlogCardPost from "./BlogCardPost";
import { Button } from "@/components/ui/button";

interface BlogListProps {
  articles: IArticleFrontEnd[]; // Use IArticleFrontEnd, these are already the current page's articles
  listTitle?: string;
  showPagination?: boolean;
  currentPage?: number; // New: Current active page
  totalPages?: number; // New: Total available pages
  onPageChange?: (page: number) => void; // New: Callback to change page
}

export default function BlogList({
  articles,
  listTitle,
  showPagination = true,
  // postsPerPage, // Removed from destructuring for now
  currentPage = 1, // Default to 1 if not provided
  totalPages = 1, // Default to 1 if not provided
  onPageChange,
}: BlogListProps) {
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

  const handleNextPage = () => {
    if (onPageChange && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (onPageChange && currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    if (onPageChange) {
      onPageChange(pageNumber);
    }
  };

  return (
    <section className="py-8">
      {listTitle && (
        <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
          {listTitle}
        </h2>
      )}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => {
          return <BlogCardPost key={article.id} article={article} />;
        })}
      </div>

      {showPagination && totalPages > 1 && (
        <div className="mt-12 pb-12 flex justify-center items-center space-x-2 md:space-x-4">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base"
          >
            Previous
          </Button>
          {/* Simplified pagination: show a few page numbers around current page, plus first/last */}
          {/* For a more complex pagination (e.g. with ellipses), a dedicated component or library might be better */}
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter((page) => {
              // Basic filtering to avoid too many buttons
              if (totalPages <= 7) return true; // Show all if 7 or less pages
              const pageWindow = 2; // How many pages to show around current, and first/last
              return (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - pageWindow &&
                  page <= currentPage + pageWindow)
              );
            })
            .map((pageNumber, index, arr) => {
              // Add ellipsis logic (very basic example)
              const prevPageNumber = arr[index - 1];
              if (
                prevPageNumber &&
                pageNumber > prevPageNumber + 1 &&
                totalPages > 7
              ) {
                return (
                  <>
                    <span
                      key={`ellipsis-start-${pageNumber}`}
                      className="px-2 py-2 text-gray-500"
                    >
                      ...
                    </span>
                    <Button
                      key={pageNumber}
                      variant="outline"
                      onClick={() => handlePageClick(pageNumber)}
                      className={`px-3 py-2 md:px-4 md:py-2 text-sm md:text-base ${
                        currentPage === pageNumber
                          ? "bg-orange-500 text-white hover:bg-orange-500 hover:text-white"
                          : "hover:bg-orange-500 hover:text-white"
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  </>
                );
              }
              return (
                <Button
                  key={pageNumber}
                  variant="outline"
                  onClick={() => handlePageClick(pageNumber)}
                  className={`px-3 py-2 md:px-4 md:py-2 text-sm md:text-base ${
                    currentPage === pageNumber
                      ? "bg-orange-500 text-white hover:bg-orange-500 hover:text-white"
                      : "hover:bg-orange-500 hover:text-white"
                  }`}
                >
                  {pageNumber}
                </Button>
              );
            })}
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base"
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}
