"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useToast } from "./ToastContext";
import { apiClient } from "@/lib/api-client";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profile_picture_url?: string;
  hasCV?: boolean;
}

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
  const pathname = usePathname(); // Get current pathname
  const { showToast } = useToast();

  // Centralized function to handle logout logic (clear state and cookies)
  const logoutCoreLogic = async (showGlobalToast = false, redirect = true) => {
    setUser(null);
    setError(null);
    Cookies.remove("user", { path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
    Cookies.remove("token", { path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" });

    // Optional: Trigger API logout if not already part of a calling flow.
    // This might be redundant if called from the main logout function which already calls the API.
    // Consider if this is needed for scenarios like auto-logout on token expiry/profile fetch failure.
    // await fetch("/api/auth/logout", { method: "POST" }); 

    if (showGlobalToast) {
      showToast("Session ended. Please login again.", "error");
    }
    // Check current path before redirecting to avoid redirect loops or unnecessary redirects
    if (redirect && pathname !== "/auth/login") {
      router.push("/auth/login");
    }
  };

  // Function to handle auth errors, typically called when an API request fails with 401/403
  const handleAuthError = async () => {
    await logoutCoreLogic(true); // Show toast and redirect
  };


  useEffect(() => {
    const loadUserFromCookie = async () => {
      setIsLoading(true);
      try {
        const userCookie = Cookies.get("user");
        const tokenCookie = Cookies.get("token"); // HttpOnly, so client can't read value but can check existence

        if (userCookie) {
          try {
            const userData = JSON.parse(userCookie);
            setUser(userData);
          } catch (parseError) {
            await logoutCoreLogic(false, false); // Clear corrupted cookie and state, don't show toast or redirect yet
          }
        } else if (tokenCookie) {
          try {
            const profileData = await apiClient("/users/my-profile", { method: "GET" });
            if (profileData?.id) { // Ensure profileData is valid
              const userData: User = {
                id: profileData.id,
                name: profileData.name,
                email: profileData.email,
                phone: profileData.phone,
                hasCV: profileData.hasCV || false,
              };
              setUser(userData);
              Cookies.set("user", JSON.stringify(userData), {
                expires: 7,
                path: "/",
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
              });
            } else {
              await logoutCoreLogic(true); // Token might be invalid, treat as logout, show toast & redirect
            }
          } catch (profileErr: any) {
            // If profile fetch fails (e.g. 401, 403, network error), treat as logout
            await handleAuthError(); // This will call logoutCoreLogic with toast and redirect
          }
        } else {
          // No 'user' cookie and no 'token' cookie, ensure user is null and no auth attempt needed
          setUser(null);
        }
      } catch (err) {
        // Catch-all for unexpected errors during cookie loading phase
        await logoutCoreLogic(false); // Fallback to ensure clean state, don't show toast, allow redirect
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromCookie();
  }, [router]); // Added router to dependency array as logoutCoreLogic uses it.

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

      // Store user in cookie and state (as a backup to server-set cookies)
      // This ensures the user data is available even if the server-set cookie fails
      Cookies.set("user", JSON.stringify(userData), {
        expires: 7, // 7 days
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      
      setUser(userData);
      showToast("Login successful!", "success");

      // Redirect to home
      router.push("/");
    } catch (error: any) {
      const errorMessage = error.message || "Login failed";
      setError(errorMessage);
      showToast(errorMessage, "error");
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
      showToast("Registration successful! Please login.", "success");
      // Redirect to login page after successful registration
      router.push("/auth/login");
    } catch (error: any) {
      const errorMessage = error.message || "Registration failed";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Call the API to clear server-side session and HttpOnly cookie
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        // Log error but proceed with client-side cleanup
        showToast("Logout failed on server, clearing client session.", "warning");
      }
      
      // Perform client-side logout (clear state, cookies, redirect)
      await logoutCoreLogic(false, true); // Don't show global error toast from core, but allow redirect
      showToast("Logged out successfully.", "success");
      // logoutCoreLogic handles redirection to /auth/login if not already there and redirect is true
      
    } catch (error) {
      showToast("Logout failed. Please try again.", "error");
      // Ensure client-side is cleared even if API call throws an error before response check
      await logoutCoreLogic(false, true); // Don't show global error toast from core, but allow redirect
    } finally {
      setIsLoading(false);
      router.push("/");
    }
  };

  const updateProfile = async (userId: string, userData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use apiClient instead of fetch for consistent error handling
      const updatedUserData = await apiClient("/users/my-profile", {
        method: "PUT",
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
        sameSite: "lax", // Changed from strict to lax for consistency
        secure: process.env.NODE_ENV === "production",
      });
      showToast("Profile updated successfully!", "success");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to update profile";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const profileData = await apiClient("/users/my-profile", {
        method: "GET",
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
        sameSite: "lax", // Changed from strict to lax for consistency
        secure: process.env.NODE_ENV === "production",
      });
      // Removed success toast as per "user action only" guideline
    } catch (error: any) {
      // If refreshing profile fails, it could indicate a session issue (e.g., token expired).
      // Treat this as an authentication error to ensure consistent state.
      await handleAuthError();
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading, // Ensured isLoading is used
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
