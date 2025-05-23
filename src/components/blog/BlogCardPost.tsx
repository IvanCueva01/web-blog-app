import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link } from "react-router-dom";
import type { IArticleFrontEnd, AuthorProfile } from "@/types/article.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fallback image if author has no avatar_url
// const GENERIC_AUTHOR_IMAGE_FALLBACK = "/path/to/your/generic/avatar.png"; // Replace with your actual path or remove if not needed

type ArticleCardProps = {
  article: IArticleFrontEnd;
};

// Helper function to get author initials
const getAuthorInitials = (authorName?: string): string => {
  if (!authorName || typeof authorName !== "string") return "AU";
  const nameParts = authorName.trim().split(" ");
  if (nameParts.length > 1 && nameParts[0] && nameParts[nameParts.length - 1]) {
    return `${nameParts[0][0]}${
      nameParts[nameParts.length - 1][0]
    }`.toUpperCase();
  } else if (authorName.length > 1) {
    return authorName.substring(0, 2).toUpperCase();
  } else if (authorName.length === 1) {
    return authorName.toUpperCase();
  }
  return "AU";
};

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "Date not available";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function BlogCardPost({ article }: ArticleCardProps) {
  console.log("Rendering BlogCardPost with article:", article); // <-- Añade esto
  // Use author's username for initials, safely handling potentially undefined author object
  const authorName = article.author?.username;
  const authorInitials = getAuthorInitials(authorName);
  const authorAvatarUrl = article.author?.avatar_url;

  return (
    <Card className="bg-white py-0 shadow-lg rounded-lg overflow-hidden flex flex-col h-full">
      <CardContent className="p-0">
        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        )}
        {!article.image_url && (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </CardContent>
      <CardHeader>
        {article.category && (
          <p className="text-sm text-orange-500 uppercase mb-1">
            {article.category}
          </p>
        )}
        <CardTitle>
          <Link to={`/posts/${article.slug}`}>{article.title}</Link>
        </CardTitle>
        {article.excerpt && (
          <CardDescription>{article.excerpt}</CardDescription>
        )}
      </CardHeader>
      <CardFooter className="mt-auto py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="w-8 h-8 mr-2">
            {authorAvatarUrl ? (
              <AvatarImage
                className="object-cover"
                src={authorAvatarUrl}
                alt={authorName || "Author"}
              />
            ) : (
              <AvatarFallback className="text-xs bg-slate-200 text-slate-700 font-semibold">
                {authorInitials}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {authorName || "Unknown Author"}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(article.updated_at || article.published_at)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-orange-500"
        >
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default BlogCardPost;
