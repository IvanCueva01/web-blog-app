import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // To potentially update context directly or use its methods
import apiClient from "@/services/api";
import type { BackendUser } from "@/contexts/AuthContext"; // Import as type
import MainLayout from "@/components/layout/MainLayout"; // For a consistent loading look
import { Loader2 } from "lucide-react";

export default function HandleTokenPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth(); // Get setCurrentUser from context to update it

  const [message, setMessage] = useState("Processing authentication...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const googleError = searchParams.get("error"); // Check for errors passed from backend redirect

    if (googleError) {
      let errorMessage = "Google authentication failed.";
      if (googleError === "google_auth_failed") {
        errorMessage = "Google authentication failed. Please try again.";
      } else if (googleError === "google_auth_incomplete") {
        errorMessage =
          "Could not retrieve all necessary information from Google. Please try again.";
      }
      setError(errorMessage);
      setMessage("Redirecting to login...");
      setTimeout(() => {
        navigate(`/auth?view=login&error=${encodeURIComponent(errorMessage)}`);
      }, 3000);
      return;
    }

    if (token) {
      localStorage.setItem("authToken", token);
      // apiClient will now use this token for the /auth/me request
      apiClient
        .get<BackendUser>("/auth/me")
        .then((response) => {
          if (response.data) {
            localStorage.setItem("currentUser", JSON.stringify(response.data));
            setCurrentUser(response.data); // Update AuthContext directly
            setMessage("Authentication successful! Redirecting...");
            // Determine where to redirect. Could be based on a 'returnTo' param if we add it.
            const returnTo = searchParams.get("returnTo") || "/my-works";
            setTimeout(() => navigate(returnTo), 1500);
          } else {
            throw new Error("No user data received after token validation.");
          }
        })
        .catch((err) => {
          console.error("Error validating token or fetching user:", err);
          localStorage.removeItem("authToken");
          localStorage.removeItem("currentUser");
          setCurrentUser(null);
          const specificError =
            err.response?.data?.message ||
            err.message ||
            "Invalid or expired token.";
          setError(`Failed to log in with Google: ${specificError}`);
          setMessage("Redirecting to login...");
          setTimeout(() => {
            navigate(
              `/auth?view=login&error=${encodeURIComponent(specificError)}`
            );
          }, 3000);
        });
    } else {
      setError("Authentication token not found.");
      setMessage("Redirecting to login...");
      setTimeout(() => {
        navigate("/auth?view=login&error=google_token_missing");
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, navigate, setCurrentUser]); // Added setCurrentUser to dependency array

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          {error ? (
            <>
              <h1 className="text-3xl font-bold text-red-600 mb-4">
                Authentication Failed
              </h1>
              <p className="text-lg text-gray-700 mb-2">{error}</p>
              <p className="text-md text-gray-500">{message}</p>
            </>
          ) : (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-orange-500 mb-6" />
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Please Wait
              </h1>
              <p className="text-lg text-gray-600">{message}</p>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
