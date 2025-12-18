/**
 * API URL Utility Helper
 * Provides correct base URL for API calls in different environments
 */

export const getBaseUrl = (): string => {
  // Browser/client-side - use relative paths
  if (typeof window !== "undefined") {
    return "";
  }
  
  // Server-side - use relative paths for Vercel compatibility
  // This ensures the same domain is used for API calls
  return "";
};

/**
 * Helper function to create API URLs
 * Automatically handles base URL for different environments
 */
export const createApiUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Server-side safe fetch wrapper
 * Ensures correct URL is used in server components
 */
export const serverFetch = async (path: string, options?: RequestInit) => {
  const url = createApiUrl(path);
  return fetch(url, options);
};
