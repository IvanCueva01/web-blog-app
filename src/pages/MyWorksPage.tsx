import React from "react";
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
import { mockArticles, type Article } from "@/data/mockArticles";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, Edit3, Trash2 } from "lucide-react";
import { ProtectedRoute } from "@/utils/ProtectedRoute";
import HeroSection from "@/components/layout/HeroSection";

export default function MyWorksPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [myArticles, setMyArticles] = useState<Article[]>([]);

  // State for delete modals
  const [isFirstDeleteModalOpen, setIsFirstDeleteModalOpen] = useState(false);
  const [isSecondDeleteModalOpen, setIsSecondDeleteModalOpen] = useState(false);
  const [articleToDeleteId, setArticleToDeleteId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (currentUser) {
      const userArticles = mockArticles.filter(
        (article) => article.authorId === currentUser.id
      );
      setMyArticles(userArticles);
    } else {
      setMyArticles([]); // Clear articles if user logs out
    }
  }, [currentUser]);

  const handleEdit = (articleId: string) => {
    navigate(`/my-works/edit/${articleId}`);
  };

  // Open first delete confirmation modal
  const initiateDelete = (articleId: string) => {
    setArticleToDeleteId(articleId);
    setIsFirstDeleteModalOpen(true);
  };

  // Confirmed first delete, open second modal
  const handleFirstDeleteConfirm = () => {
    setIsFirstDeleteModalOpen(false);
    setIsSecondDeleteModalOpen(true);
  };

  // Actually delete the article after second confirmation
  const handleSecondDeleteConfirm = () => {
    if (articleToDeleteId) {
      const articleIndex = mockArticles.findIndex(
        (art) => art.id === articleToDeleteId
      );
      if (articleIndex !== -1) {
        mockArticles.splice(articleIndex, 1); // Remove the article
        setMyArticles((prevArticles) =>
          prevArticles.filter((art) => art.id !== articleToDeleteId)
        );
        console.log("Article deleted:", articleToDeleteId);
      }
      setArticleToDeleteId(null);
      setIsSecondDeleteModalOpen(false);
    }
  };

  const articleToConfirmDelete = articleToDeleteId
    ? myArticles.find((art) => art.id === articleToDeleteId)
    : null;

  return (
    <ProtectedRoute>
      <HeroSection
        title="My Works"
        subtitle="Here are all the works I've published so far."
        imageUrl="https://images.unsplash.com/photo-1701442876057-0bcbe9317600?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              My Blog Works
            </h1>
            <Link to="/my-works/create">
              {" "}
              {/* Placeholder for Create Post Page */}
              <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center space-x-2">
                <PlusCircle size={20} />
                <span>Add New Post</span>
              </Button>
            </Link>
          </div>

          {myArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
              {myArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-start"
                >
                  <div>
                    <h3 className="text-2xl font-semibold text-orange-600 hover:text-orange-700 mb-2">
                      <Link to={`/posts/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      Category: {article.category}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      Last Updated:{" "}
                      {new Date(article.updatedDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4 flex-shrink-0">
                    <Button
                      onClick={() => handleEdit(article.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1.5"
                    >
                      <Edit3 size={16} />
                      <span>Edit</span>
                    </Button>
                    <Button
                      onClick={() => initiateDelete(article.id)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center space-x-1.5"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 mb-4">
                You haven't published any works yet.
              </p>
              <Link to="/my-works/create">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <PlusCircle size={20} className="mr-2" /> Create Your First
                  Post
                </Button>
              </Link>
            </div>
          )}
          {/* Pagination for MyWorks can be added here if needed using BlogList showPagination prop */}
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
                <strong>{articleToConfirmDelete?.title || "this post"}</strong>
                ". This is the first confirmation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setArticleToDeleteId(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleFirstDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
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
                <strong>{articleToConfirmDelete?.title || "this post"}</strong>"
                will be gone forever. This is your last chance to back out.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setArticleToDeleteId(null)}>
                Cancel (Phew!)
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSecondDeleteConfirm}
                className="bg-red-700 hover:bg-red-800"
              >
                Yes, I Understand, Delete Permanently!
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </MainLayout>
    </ProtectedRoute>
  );
}
