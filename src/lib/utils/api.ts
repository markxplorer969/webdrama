/**
 * API URL Utility Helper
 * Provides correct base URL for API calls in different environments
 */

export const getBaseUrl = (): string => {
  // Browser/client-side - use relative paths
  if (typeof window !== "undefined") {
    return "";
  }
  
  // Server-side production - use Vercel URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Server-side development - use environment variable or fallback
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Local development fallback
  return "http://localhost:3000";
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