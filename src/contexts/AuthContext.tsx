import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { type User, testUser } from "@/data/mockArticles"; // Changed User to type import

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password_param: string) => Promise<boolean>; // Renamed password to password_param to avoid conflict
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // To check initial auth status

  // Try to load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("currentUser"); // Clear corrupted data
      }
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password_param: string
  ): Promise<boolean> => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (email === testUser.email && password_param === testUser.password) {
      const userToStore = { ...testUser };
      // Never store the password in localStorage in a real app
      delete userToStore.password;
      setCurrentUser(userToStore);
      localStorage.setItem("currentUser", JSON.stringify(userToStore));
      setLoading(false);
      return true;
    }
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setLoading(false);
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
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
