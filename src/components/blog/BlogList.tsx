import { type Article } from "@/data/mockArticles";
import BlogCardPost from "./BlogCardPost"; // Assuming BlogCardPost is in the same directory
import { Button } from "@/components/ui/button";

interface BlogListProps {
  articles: Article[];
  listTitle?: string; // Optional title for the list section
  showPagination?: boolean; // New prop
}

export default function BlogList({
  articles,
  listTitle,
  showPagination = true,
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

  return (
    <section className="py-8">
      {listTitle && (
        <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
          {listTitle}
        </h2>
      )}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <BlogCardPost key={article.id} article={article} />
        ))}
      </div>
      {/* Pagination could be added here later */}

      {showPagination && (
        <div className="mt-12 flex justify-center">
          <Button variant="outline" className="mr-2">
            Previous
          </Button>
          <Button variant="outline">Next</Button>
        </div>
      )}
    </section>
  );
}
