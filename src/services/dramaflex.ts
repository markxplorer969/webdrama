'use server'

import { cache } from 'react'

// Define types for Dramaflex API responses
export interface DramaflexVideo {
  id: string
  bookId: string
  title: string
  image: string
  description?: string
  category?: string
  episodes: number
  status?: string
  views?: number
}

export interface DramaflexDetail extends DramaflexVideo {
  episodeList?: DramaflexEpisode[]
}

export interface DramaflexEpisode {
  episode: number
  title?: string
}

export interface DramaflexStream {
  streamUrl: string
  subtitles?: string[]
}

export interface DramaflexResponse<T> {
  success: boolean
  data?: T
  message?: string
}

const API_BASE_URL = 'https://api.dramaflex.xyz/api'

/**
 * Generic fetch function with error handling
 */
async function fetchFromAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<DramaflexResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.error(`Dramaflex API error: ${response.status} - ${response.statusText}`)
      return {
        success: false,
        message: `API Error: ${response.status}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('Failed to fetch from Dramaflex API:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get trending videos
 */
export const getTrending = cache(async function getTrending(): Promise<DramaflexResponse<DramaflexVideo[]>> {
  return fetchFromAPI<DramaflexVideo[]>('/trending')
})

/**
 * Get latest videos
 */
export const getLatest = cache(async function getLatest(): Promise<DramaflexResponse<DramaflexVideo[]>> {
  return fetchFromAPI<DramaflexVideo[]>('/latest')
})

/**
 * Search videos by query
 */
export const search = cache(
  async function search(query: string): Promise<DramaflexResponse<DramaflexVideo[]>> {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        message: 'Query is required',
      }
    }

    const encodedQuery = encodeURIComponent(query.trim())
    return fetchFromAPI<DramaflexVideo[]>(`/search?q=${encodedQuery}`)
  }
)

/**
 * Get video detail by book ID
 */
export const getDetail = cache(
  async function getDetail(bookId: string): Promise<DramaflexResponse<DramaflexDetail>> {
    if (!bookId || bookId.trim().length === 0) {
      return {
        success: false,
        message: 'Book ID is required',
      }
    }

    return fetchFromAPI<DramaflexDetail>(`/detail/${bookId}`)
  }
)

/**
 * Get stream URL for specific episode
 */
export const getStream = cache(
  async function getStream(
    bookId: string,
    episode: number
  ): Promise<DramaflexResponse<DramaflexStream>> {
    if (!bookId || bookId.trim().length === 0) {
      return {
        success: false,
        message: 'Book ID is required',
      }
    }

    if (!episode || episode < 1) {
      return {
        success: false,
        message: 'Valid episode number is required',
      }
    }

    return fetchFromAPI<DramaflexStream>(`/stream/${bookId}/${episode}`)
  }
)

/**
 * Helper functions with fallback data for safe usage
 */
export async function safeGetTrending(fallbackData: DramaflexVideo[] = []): Promise<DramaflexVideo[]> {
  const result = await getTrending()
  if (result.success && result.data) {
    // Already returns DramaflexVideo[] format
    return Array.isArray(result.data) ? result.data : fallbackData
  }
  return fallbackData
}

export async function safeGetLatest(fallbackData: DramaflexVideo[] = []): Promise<DramaflexVideo[]> {
  const result = await getLatest()
  if (result.success && result.data) {
    // Already returns DramaflexVideo[] format
    return Array.isArray(result.data) ? result.data : fallbackData
  }
  return fallbackData
}

export async function safeSearch(
  query: string,
  fallbackData: DramaflexVideo[] = []
): Promise<DramaflexVideo[]> {
  const result = await search(query)
  return result.success && result.data ? result.data : fallbackData
}

export async function safeGetDetail(
  bookId: string,
  fallbackData: DramaflexDetail | null = null
): Promise<DramaflexDetail | null> {
  const result = await getDetail(bookId)
  return result.success && result.data ? result.data : fallbackData
}

export async function safeGetStream(
  bookId: string,
  episode: number,
  fallbackData: DramaflexStream | null = null
): Promise<DramaflexStream | null> {
  const result = await getStream(bookId, episode)
  return result.success && result.data ? result.data : fallbackData
}
