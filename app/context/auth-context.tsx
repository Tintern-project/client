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
    hasCV?: boolean;
};

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (userId: string, userData: any) => Promise<void>;
    refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // This useEffect loads the user from the cookie on initial mount
  useEffect(() => {
    const loadUserFromCookie = () => {
      // Set loading state while checking auth
      setIsLoading(true);

      try {
        // Get user data from cookie
        const userCookie = Cookies.get("user");

        // If user cookie exists, parse it and set the user state
        if (userCookie) {
          const userData = JSON.parse(userCookie);
          setUser(userData);
        }
      } catch (err) {
        console.error("Error loading user from cookie:", err);
        // Clear potentially corrupted cookies
        Cookies.remove("user");
        Cookies.remove("token");
      } finally {
        // End loading state
        setIsLoading(false);
      }
    };

    loadUserFromCookie();
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
        phone: data.userPhone,
        hasCV: data.hasCV || false,
      };

      // Store user in cookie and state
      // Set a longer expiration time to ensure persistence
      Cookies.set("user", JSON.stringify(userData), {
        expires: 7, // 7 days
        path: "/",
        sameSite: "strict",
      });

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

      // Clear user state
      setUser(null);

      // Remove cookies
      Cookies.remove("user");
      Cookies.remove("token");

      // Navigate to home page
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
      // Use apiClient instead of fetch for consistent error handling
      const updatedUserData = await apiClient('/users/my-profile', {
        method: 'PUT',
        data: userData,
      });

      // Update the user state with new data
      const newUserData = {
        ...user,
        ...updatedUserData,
        id: userId, // Ensure ID is preserved
      };

      // Update the state and cookie
      setUser(newUserData);
      Cookies.set("user", JSON.stringify(newUserData), {
        expires: 7,
        path: "/",
        sameSite: "strict",
      });
    } catch (error: any) {
      setError(error.message || "Failed to update profile");
      console.error("Profile update failed:", error);
    } finally {
      setIsLoading(false);
    }
    };

    const refreshUserProfile = async () => {
        if (!user?.id) return;

        setIsLoading(true);
        try {
            const profileData = await apiClient('/users/my-profile', {
                method: 'GET',
            });

            // Update the user state with fresh data including hasCV status
            const refreshedUserData = {
                ...user,
                ...profileData,
            };

            setUser(refreshedUserData);
            Cookies.set("user", JSON.stringify(refreshedUserData), {
                expires: 7,
                path: "/",
                sameSite: "strict",
            });
        } catch (error) {
            console.error("Failed to refresh user profile:", error);
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
    refreshUserProfile,
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
