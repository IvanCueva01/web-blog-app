import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  PlusCircle,
  Edit3,
  Trash2,
  Loader2,
  AlertTriangle,
  Search,
} from "lucide-react";
import { ProtectedRoute } from "@/utils/ProtectedRoute";
import HeroSection from "@/components/layout/HeroSection";
import { articleService } from "@/services/articleService";
import type { IArticleFrontEnd } from "@/types/article.types";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

const POSTS_PER_PAGE = 5;

export default function MyWorksPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [myArticles, setMyArticles] = useState<IArticleFrontEnd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  // Search state
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // State for delete modals
  const [isFirstDeleteModalOpen, setIsFirstDeleteModalOpen] = useState(false);
  const [isSecondDeleteModalOpen, setIsSecondDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] =
    useState<IArticleFrontEnd | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyArticles = useCallback(async () => {
    if (!currentUser) {
      setIsLoading(false);
      setMyArticles([]);
      setTotalPages(1);
      setError("User not authenticated.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const pageQueryParam = parseInt(searchParams.get("page") || "1", 10);
      setCurrentPage(pageQueryParam);
      const offset = (pageQueryParam - 1) * POSTS_PER_PAGE;

      const response = await articleService.getMyArticles({
        limit: POSTS_PER_PAGE,
        offset,
        searchTerm: debouncedSearchTerm || undefined,
      });

      setMyArticles(response.articles || []);
      setTotalArticles(response.totalCount);
      setTotalPages(Math.ceil(response.totalCount / POSTS_PER_PAGE));
    } catch (err: any) {
      console.error("Failed to fetch user's articles:", err);
      setError(err.message || "An unexpected error occurred.");
      setMyArticles([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, searchParams, debouncedSearchTerm]);

  useEffect(() => {
    fetchMyArticles();
  }, [fetchMyArticles]);

  // Update searchParams when searchTerm changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (debouncedSearchTerm) {
      newSearchParams.set("q", debouncedSearchTerm);
    } else {
      newSearchParams.delete("q");
    }
    newSearchParams.set("page", "1"); // Reset to page 1 on new search
    setSearchParams(newSearchParams, { replace: true });
  }, [debouncedSearchTerm, setSearchParams]);

  const handleEdit = (articleId: number) => {
    navigate(`/my-works/edit/${articleId}`);
  };

  const initiateDelete = (article: IArticleFrontEnd) => {
    setArticleToDelete(article);
    setIsFirstDeleteModalOpen(true);
  };

  const handleFirstDeleteConfirm = () => {
    setIsFirstDeleteModalOpen(false);
    setIsSecondDeleteModalOpen(true);
  };

  const handleSecondDeleteConfirm = async () => {
    if (articleToDelete) {
      setIsDeleting(true);
      try {
        await articleService.deleteArticle(articleToDelete.id);
        // Refetch articles after delete
        fetchMyArticles();
        // Optionally, show a success toast/message here
      } catch (err: any) {
        console.error("Error deleting article:", err);
        // Optionally, show an error toast/message here
        setError(err.message || "Failed to delete article.");
      } finally {
        setIsDeleting(false);
        setArticleToDelete(null);
        setIsSecondDeleteModalOpen(false);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    setSearchParams(newSearchParams);
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (!currentUser && !isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-red-500" />
          <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
          <p className="text-lg text-gray-600 mt-4">
            You need to be logged in to view your works.
          </p>
          <Button onClick={() => navigate("/auth")} className="mt-6">
            Login
          </Button>
        </div>
      </MainLayout>
    );
  }

  const PaginationControls = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return (
      <nav className="mt-12 flex justify-center" aria-label="Pagination">
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              className="rounded-l-md"
            >
              Previous
            </Button>
          </li>
          {pageNumbers.map((number) => (
            <li key={number}>
              <Button
                onClick={() => handlePageChange(number)}
                variant={currentPage === number ? "default" : "outline"}
                className="mx-1"
              >
                {number}
              </Button>
            </li>
          ))}
          <li>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              className="rounded-r-md"
            >
              Next
            </Button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <ProtectedRoute>
      <HeroSection
        title="My Works"
        subtitle={`Manage and review all ${
          totalArticles > 0 ? totalArticles : "your"
        } published ${totalArticles === 1 ? "article" : "articles"}.`}
        imageUrl="https://images.unsplash.com/photo-1701442876057-0bcbe9317600?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 self-start md:self-center">
              My Published Articles
            </h1>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Input
                  type="search"
                  placeholder="Search your articles..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 w-full md:w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <Link to="/my-works/create">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center space-x-2 whitespace-nowrap">
                  <PlusCircle size={20} />
                  <span>New Post</span>
                </Button>
              </Link>
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
              <p className="ml-3 text-gray-600 text-lg">
                Loading your articles...
              </p>
            </div>
          )}

          {error && !isLoading && (
            <div className="text-center py-10 text-red-600 bg-red-50 p-6 rounded-lg shadow-md">
              <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-red-500" />
              <p className="text-xl font-semibold">
                Failed to load your articles
              </p>
              <p className="text-md">{error}</p>
              <Button onClick={fetchMyArticles} className="mt-4">
                Try Again
              </Button>
            </div>
          )}

          {!isLoading && !error && myArticles.length > 0 && (
            <div className="space-y-8">
              {myArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white p-6 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-start gap-4"
                >
                  <div className="flex-grow">
                    <h3 className="text-xl lg:text-2xl font-semibold text-orange-600 hover:text-orange-700 mb-2">
                      <Link to={`/posts/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
                      {article.category && (
                        <span>Category: {article.category}</span>
                      )}
                      <span>
                        Published:{" "}
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString()
                          : "N/A"}
                      </span>
                      <span>
                        Last Updated:{" "}
                        {article.updated_at
                          ? new Date(article.updated_at).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <p className="text-gray-700 line-clamp-2 mb-3 sm:mb-0">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 ml-0 sm:ml-4 flex-shrink-0 self-start sm:self-center">
                    <Button
                      onClick={() => handleEdit(article.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1.5 w-full justify-center"
                    >
                      <Edit3 size={16} />
                      <span>Edit</span>
                    </Button>
                    <Button
                      onClick={() => initiateDelete(article)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center space-x-1.5 w-full justify-center"
                      disabled={
                        isDeleting && articleToDelete?.id === article.id
                      }
                    >
                      {isDeleting && articleToDelete?.id === article.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
              <PaginationControls />
            </div>
          )}

          {!isLoading && !error && myArticles.length === 0 && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 mx-auto mb-6 text-gray-400" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                {debouncedSearchTerm
                  ? `No articles found for "${debouncedSearchTerm}"`
                  : "No articles published yet"}
              </h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {debouncedSearchTerm
                  ? "Try adjusting your search term or create a new article that matches."
                  : "It looks like you haven't published any articles. Get started by creating your first one!"}
              </p>
              <Link to="/my-works/create">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-6 py-3">
                  <PlusCircle size={22} className="mr-2" /> Create New Post
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* First Deletion Confirmation Modal */}
        <AlertDialog
          open={isFirstDeleteModalOpen}
          onOpenChange={setIsFirstDeleteModalOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete the post "
                <strong>{articleToDelete?.title || "this post"}</strong>
                ". This is the first confirmation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setArticleToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleFirstDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                Yes, Delete (Step 1/2)
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Second Deletion Confirmation Modal */}
        <AlertDialog
          open={isSecondDeleteModalOpen}
          onOpenChange={setIsSecondDeleteModalOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Final Confirmation: Are you really sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Seriously, this action cannot be undone. The post "
                <strong>{articleToDelete?.title || "this post"}</strong>" will
                be gone forever. This is your last chance to back out.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setArticleToDelete(null)}>
                Cancel (Phew!)
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSecondDeleteConfirm}
                className="bg-red-700 hover:bg-red-800"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Deleting...
                  </>
                ) : (
                  "Yes, I Understand, Delete Permanently!"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </MainLayout>
    </ProtectedRoute>
  );
}
