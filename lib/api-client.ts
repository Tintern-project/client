import Cookies from "js-cookie";

// Define a custom error for authentication issues
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

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

    if (response.status === 401) {
      // For 401, throw a specific AuthError.
      // The AuthContext will catch this and trigger logout logic.
      const errorData = await response.json().catch(() => ({ message: "Unauthorized" }));
      throw new AuthError(errorData.message || "User is not authenticated");
    }

    // For other non-OK responses, try to parse JSON and reject with it.
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Request failed with status ${response.status}` }));
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    // For OK responses, parse and return JSON.
    // Handle cases where response might be OK but empty (e.g., 204 No Content)
    if (response.status === 204) {
        return null; // Or an appropriate representation for no content
    }
    return await response.json();

  } catch (error) {
    // This catches network errors, JSON parsing errors, or errors thrown above.
    // If it's already an AuthError or an error with status, rethrow it.
    // Otherwise, wrap it or provide a generic error message.
    if (error instanceof AuthError || (error as any).status) {
        throw error;
    }
    // Generic error for network issues or unexpected problems
    throw new Error("An unexpected error occurred in apiClient.");
  }
}
