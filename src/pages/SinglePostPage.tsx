import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
// import { mockArticles, type Article } from "@/data/mockArticles"; // Remove mock
import type { IArticleFrontEnd } from "@/types/article.types"; // Import IArticleFrontEnd
import { articleService } from "@/services/articleService"; // Import articleService
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Loader2, AlertTriangle } from "lucide-react"; // Added Loader2, AlertTriangle
import HeroSection from "@/components/layout/HeroSection";

// Helper function to get author initials (ensure it handles undefined authorName)
const getAuthorInitials = (authorName?: string): string => {
  if (!authorName || typeof authorName !== "string") return "AU";
  const nameParts = authorName.trim().split(/[ .]+/);
  if (nameParts.length > 1 && nameParts[0] && nameParts[nameParts.length - 1]) {
    return `${nameParts[0][0]}${
      nameParts[nameParts.length - 1][0]
    }`.toUpperCase();
  } else if (nameParts.length === 1 && nameParts[0].length > 1) {
    return nameParts[0].substring(0, 2).toUpperCase();
  } else if (nameParts.length === 1 && nameParts[0].length === 1) {
    return nameParts[0].toUpperCase();
  }
  return "AU";
};

const formatDate = (
  dateString?: string | null,
  options?: Intl.DateTimeFormatOptions
) => {
  if (!dateString) return "Date not available";
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(
    "en-US",
    options || defaultOptions
  );
};

export default function SinglePostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<IArticleFrontEnd | null | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [recentPosts, setRecentPosts] = useState<IArticleFrontEnd[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false); // Optional: for recent posts loader

  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true); // State for categories loading

  useEffect(() => {
    const fetchArticleDetailsAndCategories = async () => {
      // Fetch Categories (can be done in parallel or sequentially)
      setIsLoadingCategories(true);
      try {
        const categories = await articleService.getUniqueCategories();
        setUniqueCategories(categories);
      } catch (catError) {
        console.error("Failed to fetch unique categories:", catError);
        setUniqueCategories([]); // Set to empty on error or handle differently
      } finally {
        setIsLoadingCategories(false);
      }

      // Fetch Article Details (existing logic)
      if (!slug) {
        setError("Article slug is missing.");
        setIsLoading(false);
        setArticle(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const fetchedArticle = await articleService.getArticleBySlug(slug);
        setArticle(fetchedArticle);

        if (fetchedArticle) {
          // Fetch recent posts (excluding the current one)
          setIsLoadingRecent(true);
          try {
            const recentResponse = await articleService.getAllArticles({
              limit: 4, // Get 3 recent + current one just in case it appears, then filter
            });
            setRecentPosts(
              (recentResponse.articles || [])
                .filter((p) => p.slug !== slug)
                .slice(0, 3)
            );
          } catch (recentError) {
            console.error("Failed to fetch recent posts:", recentError);
          } finally {
            setIsLoadingRecent(false);
          }
        }
      } catch (err: any) {
        console.error(`Failed to fetch article by slug ${slug}:`, err);
        setError(
          err.message || "An unexpected error occurred while fetching the post."
        );
        setArticle(null); // Explicitly set to null on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleDetailsAndCategories();
  }, [slug]);

  if (isLoading || article === undefined) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-orange-500" />
          <p className="mt-4 text-lg text-gray-600">Loading post...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || article === null) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-red-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
            {error ? "Error Loading Post" : "Post Not Found"}
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            {error || "Sorry, we couldn't find the post you were looking for."}
          </p>
          <Link
            to="/posts"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Back to All Posts
          </Link>
        </div>
      </MainLayout>
    );
  }

  // At this point, article is guaranteed to be IArticleFrontEnd
  console.log(
    "[SinglePostPage Render] Final article state before main render:",
    article
  );
  const authorName = article.author?.username;
  const authorInitials = getAuthorInitials(authorName);
  const authorAvatarUrl = article.author?.avatar_url;

  return (
    <MainLayout>
      <HeroSection title={article.title} imageUrl={article.image_url} />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="lg:flex lg:space-x-12">
          {/* Main Content Column */}
          <article className="lg:w-2/3 xl:w-3/4 space-y-8">
            <header className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                {article.author && (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-10 w-10">
                      {authorAvatarUrl ? (
                        <AvatarImage
                          src={authorAvatarUrl}
                          alt={authorName || "Author"}
                        />
                      ) : null}
                      <AvatarFallback>{authorInitials}</AvatarFallback>
                    </Avatar>
                    <span>{authorName}</span>
                  </div>
                )}
                {article.author && <span>&bull;</span>}
                <div className="flex items-center space-x-1">
                  <CalendarDays size={16} />
                  <span>Published: {formatDate(article.published_at)}</span>
                </div>
                {article.published_at !== article.updated_at &&
                  article.updated_at && (
                    <>
                      <span>&bull;</span>
                      <div className="flex items-center space-x-1">
                        <CalendarDays size={16} />
                        <span>Updated: {formatDate(article.updated_at)}</span>
                      </div>
                    </>
                  )}
              </div>
            </header>

            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
              />
            )}

            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-img:rounded-xl prose-headings:text-gray-800 prose-a:text-orange-600 hover:prose-a:text-orange-700"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Join the Conversation
              </h3>
              <p className="text-gray-600">Comments are coming soon!</p>
            </div>
          </article>

          {/* Sidebar Column */}
          <aside className="lg:w-1/3 xl:w-1/4 mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-8 p-6 bg-slate-50 rounded-lg shadow">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Categories
                </h2>
                {isLoadingCategories && (
                  <p className="text-sm text-gray-500">Loading categories...</p>
                )}
                {!isLoadingCategories && uniqueCategories.length === 0 && (
                  <p className="text-sm text-gray-500">No categories found.</p>
                )}
                {!isLoadingCategories && uniqueCategories.length > 0 && (
                  <ul className="space-y-2">
                    {uniqueCategories.map((category) => (
                      <li key={category}>
                        <Link
                          to={`/category/${encodeURIComponent(
                            category.toLowerCase()
                          )}`}
                          className="text-gray-700 hover:text-orange-600 hover:underline transition-colors block py-1"
                        >
                          {category}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Recent Posts
                </h2>
                {isLoadingRecent && (
                  <p className="text-sm text-gray-500">Loading recent...</p>
                )}
                {!isLoadingRecent && recentPosts.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No recent posts found.
                  </p>
                )}
                {!isLoadingRecent && recentPosts.length > 0 && (
                  <ul className="space-y-4">
                    {recentPosts.map((post) => (
                      <li key={post.id} className="flex space-x-3">
                        {post.image_url && (
                          <Link
                            to={`/posts/${post.slug}`}
                            className="flex-shrink-0"
                          >
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="w-20 h-20 object-cover rounded-md hover:opacity-80 transition-opacity"
                            />
                          </Link>
                        )}
                        {!post.image_url && (
                          <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center">
                            <span className="text-xs text-gray-400">
                              No Image
                            </span>
                          </div>
                        )}
                        <div className="flex-grow">
                          <h3 className="text-sm font-semibold leading-tight mb-1">
                            <Link
                              to={`/posts/${post.slug}`}
                              className="text-gray-800 hover:text-orange-600 transition-colors"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          {post.author && (
                            <p className="text-xs text-gray-500 mb-1">
                              By {post.author.username} &bull;{" "}
                              {formatDate(post.published_at, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          )}
                          {post.excerpt && (
                            <p className="text-xs text-gray-600 leading-snug">
                              {post.excerpt.length > 60
                                ? `${post.excerpt.substring(0, 60)}...`
                                : post.excerpt}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
