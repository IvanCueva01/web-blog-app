import React, { useState } from "react";
import {
  Card,
  CardContent,
  // CardHeader, // Can be added if a title directly in the form card is desired
  // CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // States for the success dialog
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await register(username, email, password);
      if (result.success) {
        setUsername("");
        setEmail("");
        setPassword("");
        setDialogMessage(
          result.message || "Registration successful! You can now log in."
        );
        setShowSuccessDialog(true);
        // Navigation will happen when dialog is closed by user action
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Signup submit error:", err);
      setError(
        err.message || "An unexpected error occurred during registration."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogAccept = () => {
    setShowSuccessDialog(false);
    navigate("/auth?view=login&registered=true");
  };

  return (
    <>
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="your_username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                minLength={6}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 text-center px-1 py-2 bg-red-50 rounded-md">
                {error}
              </p>
            )}
            <div className="flex flex-col gap-3 pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing up..." : "Sign up"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {showSuccessDialog && (
        <AlertDialog
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Registration Successful!</AlertDialogTitle>
              <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {/* <AlertDialogCancel onClick={() => setShowSuccessDialog(false)}>Cancel</AlertDialogCancel> */}
              <AlertDialogAction onClick={handleDialogAccept}>
                Proceed to Login
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
