import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { mockArticles, type Article } from "@/data/mockArticles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, UserCircle } from "lucide-react";
import HeroSection from "@/components/layout/HeroSection"; // Optional: for a less prominent hero or none

// Function to get author initials (similar to BlogCardPost)
const getAuthorInitials = (authorName: string): string => {
  if (!authorName) return "U";
  const nameParts = authorName.split(/[ .]+/); // Split by space or dot
  if (nameParts.length > 1) {
    return `${nameParts[0][0]}${
      nameParts[nameParts.length - 1][0]
    }`.toUpperCase();
  }
  return nameParts[0].slice(0, 2).toUpperCase();
};

export default function SinglePostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null | undefined>(undefined);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [recentPosts, setRecentPosts] = useState<Article[]>([]);

  useEffect(() => {
    const foundArticle = mockArticles.find((art) => art.slug === slug);
    setArticle(foundArticle || null);

    if (foundArticle) {
      // Set unique categories for the sidebar
      const allCategories = mockArticles.map((art) => art.category);
      setUniqueCategories([...new Set(allCategories)].sort());

      // Set recent posts
      const sortedArticles = mockArticles
        .filter((art) => art.id !== foundArticle.id) // Exclude current article
        .sort(
          (a, b) =>
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime()
        );
      setRecentPosts(sortedArticles.slice(0, 3));
    }
  }, [slug]);

  if (article === undefined) {
    return (
      <MainLayout>
        {/* <HeroSection
          title="Single Post Page"
          subtitle="This is the single post page"
          imageUrl="https://images.unsplash.com/photo-1701442876057-0bcbe9317600?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        /> */}
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-lg text-gray-600">Loading post...</p>
        </div>
      </MainLayout>
    );
  }

  if (article === null) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">
            Post Not Found
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Sorry, we couldn't find the post you were looking for.
          </p>
          <Link
            to="/posts"
            className="text-orange-500 hover:text-orange-700 underline"
          >
            Back to All Posts
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <HeroSection title={article.title} imageUrl={article.imageLink} />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="lg:flex lg:space-x-12">
          {/* Main Content Column */}
          <article className="lg:w-2/3 xl:w-3/4 space-y-8">
            <header className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                {article.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-10 w-10">
                    {article.authorImageLink ? (
                      <AvatarImage
                        src={article.authorImageLink}
                        alt={article.author}
                      />
                    ) : null}
                    <AvatarFallback>
                      {getAuthorInitials(article.author)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{article.author}</span>
                </div>
                <span>&bull;</span>
                <div className="flex items-center space-x-1">
                  <CalendarDays size={16} />
                  <span>
                    Published:{" "}
                    {new Date(article.publishDate).toLocaleDateString()}
                  </span>
                </div>
                {article.publishDate !== article.updatedDate && (
                  <div className="flex items-center space-x-1">
                    <CalendarDays size={16} />
                    <span>
                      Updated:{" "}
                      {new Date(article.updatedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </header>

            {article.imageLink && (
              <img
                src={article.imageLink}
                alt={article.title}
                className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
              />
            )}

            {/* Render HTML content from CKEditor */}
            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-img:rounded-xl prose-headings:text-gray-800 prose-a:text-orange-600 hover:prose-a:text-orange-700"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Placeholder for comments, share buttons, etc. */}
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
                  {uniqueCategories.length === 0 && (
                    <li className="text-gray-500">No categories found.</li>
                  )}
                </ul>
              </section>

              {/* You can add more sections to the sidebar here, e.g., recent posts, tags */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Recent Posts
                </h2>
                <ul className="space-y-4">
                  {recentPosts.length > 0 ? (
                    recentPosts.map((post) => (
                      <li key={post.id} className="flex space-x-3">
                        <Link
                          to={`/posts/${post.slug}`}
                          className="flex-shrink-0"
                        >
                          <img
                            src={post.imageLink}
                            alt={post.title}
                            className="w-20 h-20 object-cover rounded-md hover:opacity-80 transition-opacity"
                          />
                        </Link>
                        <div className="flex-grow">
                          <h3 className="text-sm font-semibold leading-tight mb-1">
                            <Link
                              to={`/posts/${post.slug}`}
                              className="text-gray-800 hover:text-orange-600 transition-colors"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-xs text-gray-500 mb-1">
                            By {post.author} &bull;{" "}
                            {new Date(post.publishDate).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-xs text-gray-600 leading-snug">
                            {post.excerpt.length > 60
                              ? `${post.excerpt.substring(0, 60)}...`
                              : post.excerpt}
                          </p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No recent posts found.</li>
                  )}
                </ul>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
