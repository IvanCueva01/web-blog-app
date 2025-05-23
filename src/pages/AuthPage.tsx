import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PartyPopper } from "lucide-react";

const LOGIN_IMAGE_URL =
  "https://images.unsplash.com/photo-1612681336352-b8b82f3c775a?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const SIGNUP_IMAGE_URL =
  "https://plus.unsplash.com/premium_photo-1681487606224-fd7fdf83879c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODl8fGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isLoginView, setIsLoginView] = useState(true);
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false);

  useEffect(() => {
    const view = searchParams.get("view");
    const registered = searchParams.get("registered");

    setIsLoginView(view !== "signup");

    if (view !== "signup" && registered === "true") {
      setShowRegisteredMessage(true);
    } else {
      setShowRegisteredMessage(false);
    }
  }, [searchParams]);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setShowRegisteredMessage(false);
  };

  return (
    <div className="flex h-svh w-full bg-gray-100 overflow-hidden">
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 h-full">
        <img
          src={isLoginView ? LOGIN_IMAGE_URL : SIGNUP_IMAGE_URL}
          alt={isLoginView ? "Login illustration" : "Signup illustration"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col items-center justify-center p-6 md:p-10 relative overflow-y-auto">
        <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
          <Link to="/">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 bg-white shadow-sm"
            >
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-sm">
          {isLoginView ? (
            <>
              {showRegisteredMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md text-sm flex items-center justify-center">
                  <PartyPopper size={20} className="mr-2 text-green-600" />
                  <span>Registration successful! Please log in.</span>
                </div>
              )}
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
                Welcome Back!
              </h2>
              <p className="text-center text-sm text-gray-600 mb-6">
                Enter your credentials to access your account.
              </p>
              <LoginForm />
              <p className="text-center text-sm text-gray-600 mt-6">
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
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
                Create Your Account
              </h2>
              <p className="text-center text-sm text-gray-600 mb-6">
                Join us and start your journey.
              </p>
              <SignupForm />
              <p className="text-center text-sm text-gray-600 mt-6">
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
    </div>
  );
}
