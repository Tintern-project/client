"use client";

import { useAuth } from "@/app/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ['/', '/jobs']; // Add any other public paths here

  useEffect(() => {
    // If still loading, wait.
    if (isLoading) {
      return;
    }

    // If done loading and no user, and current path is not public, redirect.
    if (!user && !publicPaths.includes(pathname)) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router, pathname]);

  // While loading auth state, show a loading indicator.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#121212]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#FF6868]"></div>
      </div>
    );
  }

  // If done loading and there's a user, render children.
  if (user) {
    return <>{children}</>;
  }

  // If done loading and no user, return null. Middleware should have redirected.
  // This state implies the user was logged out and AuthContext is handling redirection,
  // or it's a public page that mistakenly wrapped with ProtectedRoute (which shouldn't happen).
  return null;
}
