"use client";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { apiClient } from "@/lib/api-client";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profile_picture_url?: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userId: string, userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const storedUser = Cookies.get("user");
        const token = Cookies.get("token");

        if (token && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);

            // Optionally verify the token is still valid with the server
            // This could be a lightweight endpoint that just returns 200 if token is valid
          } catch (err) {
            console.error("Failed to parse user from cookie:", err);
            Cookies.remove("user");
            Cookies.remove("token");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();

      // Create user object
      const userData: User = {
        id: data.userId,
        name: data.userName,
        email: data.userEmail,
      };

      // Store user in cookie and state
      Cookies.set("user", JSON.stringify(userData), { expires: 7, path: "/" });
      setUser(userData);

      // Redirect to profile
      router.push("/profile");
    } catch (error: any) {
      setError(error.message);
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      // Redirect to login page after successful registration
      router.push("/auth/login");
    } catch (error: any) {
      setError(error.message || "Registration failed");
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Clear user state and cookies
      setUser(null);
      Cookies.remove("user");
      Cookies.remove("token");

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userId: string, userData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const updatedUserData = await response.json();

      // Update the user state and cookie with new data
      const newUserData = { ...user, ...updatedUserData };
      setUser(newUserData);
      Cookies.set("user", JSON.stringify(newUserData), {
        expires: 7,
        path: "/",
      });
    } catch (error: any) {
      setError(error.message || "Failed to update profile");
      console.error("Profile update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
