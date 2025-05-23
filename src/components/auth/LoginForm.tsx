import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        const returnTo = searchParams.get("returnTo") || "/my-works";
        navigate(returnTo);
      } else {
        // This branch might not be hit if login function always throws on error
        setError("Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      console.error("Login submit error:", err);
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Construct the returnTo URL. If current page is /auth, don't set a confusing returnTo from it.
    // If there's a meaningful returnTo in the URL (e.g., from a protected route), use that.
    const currentReturnTo = searchParams.get("returnTo");
    let googleRedirectUri = `${API_BASE_URL}/auth/google`;

    // Optional: Append returnTo to Google link if backend is set up to pass it through
    // For now, backend redirects to /auth/handle-token, which then can use its own returnTo.
    if (currentReturnTo && window.location.pathname !== "/auth") {
      googleRedirectUri += `?returnTo=${encodeURIComponent(currentReturnTo)}`;
    }
    window.location.href = googleRedirectUri;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
        </div>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 text-center py-1 mb-2 bg-red-50 rounded-md">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3 pt-2">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting} // Keep it disabled if main form is submitting
        >
          <FontAwesomeIcon icon={faGoogle} /> Login with Google
        </Button>
      </div>
    </form>
  );
}
