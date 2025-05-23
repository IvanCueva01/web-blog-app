import { useState, useEffect, type FormEvent } from "react";
import { useAuth, type BackendUser } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, UserCircle, Image as ImageIcon, Mail } from "lucide-react";
import HeroSection from "@/components/layout/HeroSection";
import { useNavigate } from "react-router";

// Helper function to get initials (can be imported if it's in a shared util file)
const getInitials = (name?: string): string => {
  if (!name) return "??";
  const parts = name.split(/[ .]+/);
  if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  if (parts.length === 1 && parts[0].length > 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length === 1) {
    return parts[0].toUpperCase();
  }
  return name.substring(0, 2).toUpperCase() || "??";
};

export default function ProfilePage() {
  const { currentUser, setCurrentUser, loading: authLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setAvatarUrl(currentUser.avatar_url || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Not authenticated. Please log in.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: { username?: string; avatar_url?: string } = {};
      if (username !== currentUser.username) {
        payload.username = username;
      }
      if (avatarUrl !== (currentUser.avatar_url || "")) {
        // Handle null avatar_url from current user
        payload.avatar_url = avatarUrl;
      }

      if (Object.keys(payload).length === 0) {
        toast.info("No changes to save.");
        setIsSubmitting(false);
        return;
      }

      const response = await userService.updateProfile(payload);
      setCurrentUser(response.user as BackendUser); // Ensure BackendUser type is used
      localStorage.setItem("currentUser", JSON.stringify(response.user)); // Update local storage too
      toast.success(response.message || "Profile updated successfully!");
      navigate("/my-works");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        </div>
      </MainLayout>
    );
  }

  if (!currentUser) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold">
            Please log in to view your profile.
          </h1>
          {/* Optionally, add a link to the login page */}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <HeroSection
        title="My Profile"
        subtitle="Update your username and profile picture. Email address cannot be changed."
        imageUrl="https://images.unsplash.com/photo-1570667459270-42931fe4df5d?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Update your username and profile picture. Email address cannot be
            changed.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4 mb-6">
            <Avatar className="h-32 w-32 ring-2 ring-offset-2 ring-orange-500 ring-offset-background">
              <AvatarImage
                src={avatarUrl || undefined}
                alt={username || "User"}
              />
              <AvatarFallback className="text-4xl">
                {getInitials(username)}
              </AvatarFallback>
            </Avatar>
            <div className="w-full max-w-md">
              <label
                htmlFor="avatarUrl"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Avatar URL
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="avatarUrl"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="pl-10"
                placeholder="Your awesome username"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email (cannot be changed)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                disabled
                className="pl-10 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || authLoading}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Changes
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}
