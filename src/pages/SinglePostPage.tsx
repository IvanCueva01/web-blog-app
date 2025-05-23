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
      } catch (err: any) {
        console.error(`Failed to fetch article by slug ${slug}:`, err);
        setError(
          err.message || "An unexpected error occurred while fetching the post."
        );
        setArticle(null); // Explicitly set to null on error
      } finally {
        setIsLoading(false);
      }

      // Fetch recent posts
      setIsLoadingRecent(true);
      try {
        const recentResponse = await articleService.getAllArticles({
          limit: 4, // Fetch 4 to filter one out and get up to 3
        });
        setRecentPosts(
          (recentResponse.articles || [])
            .filter((p) => p.slug !== slug) // Filter out current article
            .slice(0, 3) // Take top 3
        );
      } catch (recentError) {
        console.error("Failed to fetch recent posts:", recentError);
        setRecentPosts([]); // Set to empty on error
      } finally {
        setIsLoadingRecent(false);
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
        <div className="lg:flex lg:gap-x-12">
          {/* Main Content Column - Added min-w-0 */}
          <article className="lg:w-2/3 xl:w-3/4 space-y-8 min-w-0">
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

            {/* Assuming article.content is HTML and uses Tailwind Typography prose class */}
            {article.content && (
              <div
                className="prose prose-orange lg:prose-xl max-w-none dark:prose-invert break-words"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            )}

            {/* Author Bio Section (Example - if you want to add one) */}
            {article.author && (
              <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  About the Author
                </h2>
                <div className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Avatar className="h-16 w-16">
                    {authorAvatarUrl ? (
                      <AvatarImage
                        src={authorAvatarUrl}
                        alt={authorName || "Author"}
                      />
                    ) : null}
                    <AvatarFallback className="text-xl">
                      {authorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {authorName || "Anonymous Author"}
                    </h3>
                    {/* Add a placeholder for bio if you plan to have one in user profile */}
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      More information about the author will be available soon.
                      Stay tuned for updates on their work and contributions!
                    </p>
                  </div>
                </div>
              </section>
            )}

            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Join the Conversation
              </h3>
              <p className="text-gray-600">Comments are coming soon!</p>
            </div>
          </article>

          {/* Sidebar Column */}
          <aside className="lg:w-1/3 xl:w-1/4 mt-12 lg:mt-0 space-y-8">
            {/* Recent Posts Section */}
            {!isLoadingRecent && recentPosts.length > 0 && (
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                  Recent Posts
                </h3>
                <ul className="space-y-6">
                  {recentPosts.map((post) => (
                    <li
                      key={post.id}
                      className="flex space-x-4 items-start group"
                    >
                      {post.image_url && (
                        <Link
                          to={`/posts/${post.slug}`}
                          className="flex-shrink-0 block w-24 h-24 rounded-lg overflow-hidden shadow-md"
                        >
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                          />
                        </Link>
                      )}
                      <div
                        className={`flex-grow ${
                          post.image_url ? "w-[calc(100%-7rem)]" : "w-full"
                        }`}
                      >
                        <Link to={`/posts/${post.slug}`} title={post.title}>
                          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200 line-clamp-2">
                            {post.title}
                          </h4>
                        </Link>
                        {post.author && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            By{" "}
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {post.author.username}
                            </span>
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {formatDate(post.published_at)}
                        </p>
                        {post.excerpt && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        {!post.excerpt && post.content && (
                          <p
                            className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3"
                            title="Excerpt from content"
                          >
                            {`${post.content
                              .replace(/<[^>]+>/g, "")
                              .substring(0, 120)}...`}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Categories Section - Limited to 12 */}
            {!isLoadingCategories && uniqueCategories.length > 0 && (
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Categories
                </h3>
                <ul className="space-y-2">
                  {uniqueCategories.slice(0, 12).map((category) => (
                    <li key={category}>
                      <Link
                        to={`/category/${encodeURIComponent(category)}`}
                        className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500 hover:underline transition-colors"
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                  {uniqueCategories.length > 12 && (
                    <li>
                      <Link
                        to="/features"
                        className="text-sm text-orange-600 dark:text-orange-500 hover:underline font-medium"
                      >
                        View all categories...
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
