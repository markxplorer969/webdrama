/**
 * Dramabox Service - Centralized API client for Sansekai Dramabox API
 * Replaces local scraping with stable external API calls
 */

// Base URL for Sansekai API
const API_BASE_URL = 'https://dramabox.sansekai.my.id/api/dramabox';

// Type definitions for API responses
export interface TrendingDrama {
  bookId: string;
  bookName: string;
  coverWap: string;
  chapterCount: number;
  introduction: string;
  tags: string[];
  tagV3s: Array<{
    tagId: number;
    tagName: string;
    tagEnName: string;
  }>;
  rankVo: {
    rankType: number;
    hotCode: string;
    sort: number;
  };
  protagonist: string;
}

export interface SearchDrama {
  bookId: string;
  bookName: string;
  introduction: string;
  author: string;
  cover: string;
  protagonist: string;
  tagNames: string[];
}

export interface VideoQuality {
  quality: number;
  videoPath: string;
  isDefault: number;
  isEntry: number;
  isVipEquity: number;
}

export interface CDNInfo {
  cdnDomain: string;
  isDefault: number;
  videoPathList: VideoQuality[];
}

export interface EpisodeDetail {
  chapterId: string;
  chapterIndex: number;
  isCharge: number;
  chapterName: string;
  cdnList: CDNInfo[];
  chapterImg: string;
  chapterType: number;
  needInterstitialAd: number;
  viewingDuration: number;
  chargeChapter: boolean;
}

export interface DramaDetails {
  // This would contain drama metadata combined from trending + episodes
  bookId: string;
  bookName: string;
  coverWap: string;
  chapterCount: number;
  introduction: string;
  protagonist: string;
  tags: string[];
  episodes: EpisodeDetail[];
}

// Unified Drama interface for components
export interface UnifiedDrama {
  book_id: string;
  title: string;
  image: string;
  description?: string;
  views?: string;
  episodes?: string;
  rank?: string;
  protagonist?: string;
  tags?: string[];
}

/**
 * Fetches trending dramas from external API
 * @returns Promise<TrendingDrama[]> Array of trending dramas
 */
export async function getTrending(): Promise<TrendingDrama[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/trending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DramaFlex/1.0',
      },
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Failed to fetch trending dramas:', error);
    return []; // Return empty array on error
  }
}

/**
 * Searches for dramas based on query
 * @param query - Search query string
 * @returns Promise<SearchDrama[]> Array of search results
 */
export async function searchDramas(query: string): Promise<SearchDrama[]> {
  if (!query || query.trim() === '') {
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query.trim())}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DramaFlex/1.0',
      },
      cache: 'no-store', // Ensure fresh search results
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Failed to search dramas:', error);
    return []; // Return empty array on error
  }
}

/**
 * Fetches drama details and all episodes
 * @param bookId - The drama book ID
 * @returns Promise<DramaDetails | null> Drama details with episodes or null on error
 */
export async function getDramaDetails(bookId: string): Promise<DramaDetails | null> {
  if (!bookId || bookId.trim() === '') {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/allepisode?bookId=${encodeURIComponent(bookId.trim())}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DramaFlex/1.0',
      },
      cache: 'no-store', // Ensure fresh episode links
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const episodesData = await response.json();
    
    if (!episodesData || !Array.isArray(episodesData)) {
      return null;
    }

    // Get basic drama info from first episode or fetch from trending if needed
    const firstEpisode = episodesData[0];
    if (!firstEpisode) {
      return null;
    }

    // Extract basic drama metadata
    const dramaDetails: DramaDetails = {
      bookId: bookId,
      bookName: `Drama ${bookId}`, // Fallback name
      coverWap: firstEpisode.chapterImg || '',
      chapterCount: episodesData.length,
      introduction: '',
      protagonist: '',
      tags: [],
      episodes: episodesData,
    };

    return dramaDetails;
  } catch (error) {
    console.error('Failed to fetch drama details:', error);
    return null; // Return null on error
  }
}

/**
 * Gets best video URL for an episode (prefers 720p default, falls back to available)
 * @param episode - Episode detail object
 * @returns string | null - Best video URL or null if not found
 */
export function getBestVideoUrl(episode: EpisodeDetail): string | null {
  if (!episode.cdnList || episode.cdnList.length === 0) {
    return null;
  }

  // Find default CDN
  const defaultCDN = episode.cdnList.find(cdn => cdn.isDefault === 1) || episode.cdnList[0];
  
  if (!defaultCDN.videoPathList || defaultCDN.videoPathList.length === 0) {
    return null;
  }

  // Find default quality (720p) or fallback to first available
  const defaultQuality = defaultCDN.videoPathList.find(video => video.isDefault === 1);
  const fallbackQuality = defaultCDN.videoPathList[0];

  return defaultQuality?.videoPath || fallbackQuality?.videoPath || null;
}

/**
 * Gets all available video qualities for an episode
 * @param episode - Episode detail object
 * @returns VideoQuality[] - Array of available video qualities
 */
export function getVideoQualities(episode: EpisodeDetail): VideoQuality[] {
  if (!episode.cdnList || episode.cdnList.length === 0) {
    return [];
  }

  const defaultCDN = episode.cdnList.find(cdn => cdn.isDefault === 1) || episode.cdnList[0];
  return defaultCDN.videoPathList || [];
}

/**
 * Converts API response to unified drama format for components
 * @param drama - Drama from API (TrendingDrama | SearchDrama)
 * @param rank - Optional rank for trending dramas
 * @returns UnifiedDrama - Standardized drama object
 */
export function toUnifiedDrama(drama: TrendingDrama | SearchDrama, rank?: string): UnifiedDrama {
  const base = {
    book_id: drama.bookId,
    title: drama.bookName,
    image: 'coverWap' in drama ? drama.coverWap : drama.cover,
    description: drama.introduction,
    protagonist: drama.protagonist,
    tags: drama.tags || drama.tagNames || [],
  };

  if ('rankVo' in drama && rank) {
    return {
      ...base,
      rank,
      views: drama.rankVo?.hotCode || '',
      episodes: drama.chapterCount?.toString() || '',
    };
  }

  return {
    ...base,
    episodes: ('chapterCount' in drama ? drama.chapterCount : 0).toString(),
  };
}

export default {
  getTrending,
  searchDramas,
  getDramaDetails,
  getBestVideoUrl,
  getVideoQualities,
  toUnifiedDrama,
};
