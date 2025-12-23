/**
 * Utility function to get the base URL for API calls
 * Handles both development and production environments
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }
  
  // Server-side: check environment
  if (process.env.NODE_ENV === 'production') {
    return 'https://dramaflex.xyz';
  }
  
  // Development: use environment variable or fallback to localhost
  const port = process.env.PORT || 3001;
  const devUrl = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${port}`;
  return devUrl;
}

/**
 * Helper function to make API calls with proper URL handling
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}