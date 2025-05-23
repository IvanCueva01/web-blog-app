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
import {
  Share2,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  CopyIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useState } from "react";

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

  const [showFallbackPopover, setShowFallbackPopover] = useState(false);

  const constructPostUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/posts/${article.slug}`;
    }
    return "";
  };

  // Option A: Revised handleShare for Hybrid approach
  const handleShare = async () => {
    const postUrl = constructPostUrl();
    if (!postUrl) {
      toast.error("Could not determine post URL.");
      return;
    }
    const shareData = {
      title: article.title,
      text: article.excerpt || article.title,
      url: postUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShowFallbackPopover(false); // Ensure popover is closed if native share was attempted
      } catch (error: any) {
        if (error.name !== "AbortError") {
          // Don't show popover if user just canceled the native dialog
          setShowFallbackPopover(true);
        }
      }
    } else {
      setShowFallbackPopover(true); // Web Share API not available, show popover
    }
  };

  const copyToClipboard = async (closePopover: boolean = true) => {
    // Added closePopover param
    const postUrl = constructPostUrl();
    if (!postUrl) {
      toast.error("Could not determine post URL to copy.");
      return;
    }
    try {
      await navigator.clipboard.writeText(postUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link.");
      console.error("Failed to copy text: ", err);
    }
    if (closePopover) {
      setShowFallbackPopover(false); // Close popover after attempting copy
    }
  };

  const postUrlForLinks = constructPostUrl();
  const encodedTitle = encodeURIComponent(article.title);
  const encodedUrl = encodeURIComponent(postUrlForLinks);
  const encodedExcerpt = encodeURIComponent(article.excerpt || article.title);

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
          <Link
            className="hover:text-orange-500 transition-colors duration-200"
            to={`/posts/${article.slug}`}
          >
            {article.title}
          </Link>
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

        <Popover
          open={showFallbackPopover}
          onOpenChange={setShowFallbackPopover}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-orange-500"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto bg-slate-800 border-slate-700 text-gray-200 p-3">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium text-center mb-1">
                Share this post
              </p>
              {/* Option D: Social buttons also copy to clipboard */}
              <Button
                variant="outline"
                className="w-full justify-start bg-slate-700 hover:bg-slate-600 border-slate-600 hover:border-slate-500 text-gray-200"
                onClick={() => {
                  copyToClipboard(false); // Copy, but don't close popover immediately
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
                    "_blank"
                  );
                  setShowFallbackPopover(false); // Close popover after opening social link
                }}
              >
                <TwitterIcon className="mr-2 h-4 w-4 text-[#1DA1F2]" /> Twitter
                / X
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-slate-700 hover:bg-slate-600 border-slate-600 hover:border-slate-500 text-gray-200"
                onClick={() => {
                  copyToClipboard(false); // Copy, but don't close popover immediately
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
                    "_blank"
                  );
                  setShowFallbackPopover(false); // Close popover after opening social link
                }}
              >
                <FacebookIcon className="mr-2 h-4 w-4 text-[#1877F2]" />{" "}
                Facebook
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-slate-700 hover:bg-slate-600 border-slate-600 hover:border-slate-500 text-gray-200"
                onClick={() => {
                  copyToClipboard(false); // Copy, but don't close popover immediately
                  window.open(
                    `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedExcerpt}`,
                    "_blank"
                  );
                  setShowFallbackPopover(false); // Close popover after opening social link
                }}
              >
                <LinkedinIcon className="mr-2 h-4 w-4 text-[#0A66C2]" />{" "}
                LinkedIn
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-slate-700 hover:bg-slate-600 border-slate-600 hover:border-slate-500 text-gray-200"
                onClick={() => copyToClipboard(true)} // True to close popover
              >
                <CopyIcon className="mr-2 h-4 w-4" /> Copy Link
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
}

export default BlogCardPost;
