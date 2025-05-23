import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/auth?view=login&returnTo=/my-works"); // Redirect to login, optionally pass returnTo
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-lg text-gray-600">Loading your masterpieces...</p>
        </div>
      </MainLayout>
    );
  }

  if (!currentUser) {
    return null;
  }

  return children;
};
