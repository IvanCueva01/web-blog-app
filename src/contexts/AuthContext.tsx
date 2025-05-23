import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import apiClient from "@/services/api"; // Import apiClient

// Define the structure of the user object from the backend
export interface BackendUser {
  id: number; // Or string, depending on your DB schema
  username: string;
  email: string;
  avatar_url?: string | null;
  created_at?: string; // Dates are often strings from JSON
  updated_at?: string;
  // Add any other fields your backend user object has, e.g., roles
}

// Define the structure of the login response
interface AuthResponse {
  token: string;
  user: BackendUser;
  message?: string; // Optional: for success or error messages from backend on login
}

// Define the structure of the register response (can be varied)
interface RegisterResponse {
  message: string;
  user?: BackendUser; // Optional, backend might return user on successful registration
  // any other fields...
}

interface AuthContextType {
  currentUser: BackendUser | null;
  setCurrentUser: Dispatch<SetStateAction<BackendUser | null>>;
  login: (email: string, password_param: string) => Promise<boolean>;
  logout: () => void;
  register: (
    username: string,
    email: string,
    password_param: string
  ) => Promise<{ success: boolean; message?: string }>;
  loading: boolean;
  // token: string | null; // We might not need to expose token directly via context
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);
  // const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        // We have a token, try to fetch the user
        // apiClient already has the interceptor to add the token to headers
        try {
          const response = await apiClient.get<BackendUser>("/auth/me");
          if (response.data) {
            setCurrentUser(response.data);
            localStorage.setItem("currentUser", JSON.stringify(response.data)); // Keep user in sync
          } else {
            // Token might be invalid or expired, or /auth/me didn't return user
            localStorage.removeItem("authToken");
            localStorage.removeItem("currentUser");
            setCurrentUser(null);
          }
        } catch (error) {
          console.error("Failed to fetch user with stored token:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("currentUser");
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (
    email: string,
    password_param: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", {
        email,
        password: password_param, // Ensure field name matches backend expectation
      });
      if (response.data && response.data.token && response.data.user) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("currentUser", JSON.stringify(response.data.user));
        setCurrentUser(response.data.user);
        // apiClient interceptor will now pick up the new token for subsequent requests
        setLoading(false);
        return true;
      }
      // If backend sends a message field even on failed login (e.g. 401 with specific error)
      const errorMessage =
        response.data?.message ||
        "Login failed: No token or user data in response.";
      throw new Error(errorMessage);
    } catch (error: any) {
      console.error("Login error:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      setLoading(false);
      // Propagate specific error message if available from backend
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred during login."
      );
    }
  };

  const register = async (
    username: string,
    email: string,
    password_param: string
  ): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      // Specify expected response type for register endpoint
      const response = await apiClient.post<RegisterResponse>(
        "/auth/register",
        {
          username,
          email,
          password: password_param,
        }
      );
      setLoading(false);
      if (response.status === 201 && response.data) {
        return {
          success: true,
          message: response.data.message || "Registration successful",
        };
      }
      return {
        success: false,
        message:
          response.data?.message ||
          "Registration failed. Status: " + response.status,
      };
    } catch (error: any) {
      console.error("Registration error:", error);
      setLoading(false);
      const message =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred during registration.";
      return { success: false, message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    // Optionally: could also make a backend call to invalidate the token if supported
    // setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, login, logout, register, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
