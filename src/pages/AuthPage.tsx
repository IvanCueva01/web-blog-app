import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { LoginForm } from "@/components/login-form";
import SignupForm from "@/components/auth/SignupForm";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "signup") {
      setIsLoginView(false);
    } else {
      setIsLoginView(true);
    }
  }, [searchParams]);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-100">
      <div className="w-full max-w-sm space-y-6 bg-white p-8">
        {isLoginView ? (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Login
            </h2>
            <LoginForm />
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Button
                variant="link"
                onClick={toggleView}
                className="p-0 h-auto font-semibold text-orange-600 hover:text-orange-700"
              >
                Sign up
              </Button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Create Account
            </h2>
            <SignupForm />
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={toggleView}
                className="p-0 h-auto font-semibold text-orange-600 hover:text-orange-700"
              >
                Log in
              </Button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
