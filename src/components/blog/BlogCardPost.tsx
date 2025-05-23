import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link } from "react-router-dom";
import { genericAuthorImage, type Article } from "@/data/mockArticles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ArticleCardProps = {
  article: Article;
};

// Helper function to get author initials - ensuring this robust version is used
const getAuthorInitials = (authorName: string): string => {
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function BlogCardPost({ article }: ArticleCardProps) {
  const authorInitials = getAuthorInitials(article.author);

  return (
    <Card className="bg-white py-0 shadow-lg rounded-lg overflow-hidden flex flex-col h-full">
      <CardContent className="p-0">
        <img
          src={article.imageLink}
          alt={article.title}
          className="w-full h-50 object-cover rounded-t-lg"
        />
      </CardContent>
      <CardHeader>
        <p className="text-sm text-orange-500 uppercase mb-1">
          {article.category}
        </p>
        <CardTitle>
          <Link to={`/posts/${article.slug}`}>{article.title}</Link>
        </CardTitle>
        <CardDescription>{article.excerpt}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="w-8 h-8 mr-2">
            {article.authorImageLink ? (
              <AvatarImage
                className="object-cover"
                src={article.authorImageLink || genericAuthorImage}
                alt={article.author}
              />
            ) : (
              <AvatarFallback className="text-xs bg-slate-200 text-slate-700 font-semibold">
                {authorInitials}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {article.author}
            </p>
            <p className="text-xs text-gray-500">
              {article.updatedDate
                ? formatDate(article.updatedDate)
                : formatDate(article.publishDate)}
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
