import { redirect } from "next/navigation";
import Cookies from "js-cookie";

interface FetchOptions extends RequestInit {
  data?: any;
}

export async function apiClient(
  endpoint: string,
  { data, ...customConfig }: FetchOptions = {},
) {
  // Get the token from cookie
  const token = Cookies.get("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customConfig.headers,
  };

  const config: RequestInit = {
    method: data ? "POST" : "GET",
    ...customConfig,
    headers,
    credentials: "include",
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(
      `https://tintern-server.fly.dev/api/v1${endpoint}`,
      config,
    );

    // Handle unauthenticated requests
    if (response.status === 401) {
      // Clear existing tokens
      Cookies.remove("token");
      Cookies.remove("user");

      // Client-side redirect if window is available
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
        return { success: false };
      }

      // Server-side redirect
      redirect("/auth/login");
    }

    const data = await response.json();

    if (response.ok) {
      return data;
    }

    return Promise.reject(data);
  } catch (error) {
    return Promise.reject(error);
  }
}
