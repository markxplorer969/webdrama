/**
 * Dramabox Service - Centralized API client for DramaFlex API
 * Replaces local scraping with stable external API calls
 */

// Base URL for DramaFlex API
const API_BASE_URL = 'https://api.dramaflex.xyz/api';

// Type definitions for API responses
export interface TrendingDrama {
  rank?: string;
  title: string;
  book_id: string;
  image: string;
  views?: string;
  episodes?: string;
  bookId?: string; // For backward compatibility
  bookName?: string; // For backward compatibility
  coverWap?: string; // For backward compatibility
  chapterCount?: number; // For backward compatibility
  introduction?: string; // For backward compatibility
  protagonist?: string; // For backward compatibility
  tags?: string[]; // For backward compatibility
}

export interface SearchDrama {
  title: string;
  book_id: string;
  image: string;
  introduction?: string;
  author?: string;
  protagonist?: string;
  tagNames?: string[];
  // For backward compatibility
  bookId?: string;
  bookName?: string;
  cover?: string;
  tags?: string[];
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
  book_id: string;
  episode: string;
  video_url: string;
  // For backward compatibility
  chapterId?: string;
  chapterIndex?: number;
  isCharge?: number;
  chapterName?: string;
  cdnList?: CDNInfo[];
  chapterImg?: string;
  chapterType?: number;
  needInterstitialAd?: number;
  viewingDuration?: number;
  chargeChapter?: boolean;
}

export interface DramaDetails {
  book_id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  upload_date?: string;
  stats?: {
    followers?: string;
    total_episodes?: string;
  };
  episode_list?: Array<{
    episode: number;
    id: string;
  }>;
  // For backward compatibility
  bookId?: string;
  bookName?: string;
  coverWap?: string;
  chapterCount?: number;
  introduction?: string;
  protagonist?: string;
  tags?: string[];
  episodes?: EpisodeDetail[];
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
 * Fetches latest dramas from external API
 * @returns Promise<TrendingDrama[]> Array of latest dramas
 */
export async function getLatest(): Promise<TrendingDrama[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/latest`, {
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

    const result = await response.json();
    return result?.data || [];
  } catch (error) {
    console.error('Failed to fetch latest dramas:', error);
    return []; // Return empty array on error
  }
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

    const result = await response.json();
    return result?.data || [];
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
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query.trim())}`, {
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

    const result = await response.json();
    return result?.data || [];
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
    const response = await fetch(`${API_BASE_URL}/detail/${encodeURIComponent(bookId.trim())}`, {
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

    const result = await response.json();
    const dramaData = result?.data;
    
    if (!dramaData) {
      return null;
    }

    // Extract drama details from API response
    const dramaDetails: DramaDetails = {
      book_id: dramaData.book_id || bookId,
      title: dramaData.title || `Drama ${bookId}`,
      description: dramaData.description || '',
      thumbnail: dramaData.thumbnail || '',
      upload_date: dramaData.upload_date,
      stats: dramaData.stats,
      episode_list: dramaData.episode_list || [],
      // For backward compatibility
      bookId: bookId,
      bookName: dramaData.title || `Drama ${bookId}`,
      coverWap: dramaData.thumbnail || '',
      chapterCount: parseInt(dramaData.stats?.total_episodes || '0'),
      introduction: dramaData.description || '',
      protagonist: '',
      tags: [],
      episodes: []
    };

    return dramaDetails;
  } catch (error) {
    console.error('Failed to fetch drama details:', error);
    return null; // Return null on error
  }
}

/**
 * Fetches streaming video URL for a specific episode
 * @param bookId - The drama book ID
 * @param episodeId - The episode ID
 * @returns Promise<EpisodeDetail | null> Episode streaming details or null on error
 */
export async function getEpisodeStream(bookId: string, episodeId: string): Promise<EpisodeDetail | null> {
  if (!bookId || bookId.trim() === '' || !episodeId || episodeId.trim() === '') {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/stream/${encodeURIComponent(bookId.trim())}/${encodeURIComponent(episodeId.trim())}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'DramaFlex/1.0',
      },
      cache: 'no-store', // Ensure fresh stream links
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const streamData = result?.data;
    
    if (!streamData) {
      return null;
    }

    return streamData as EpisodeDetail;
  } catch (error) {
    console.error('Failed to fetch episode stream:', error);
    return null; // Return null on error
  }
}

/**
 * Gets best video URL for an episode (prefers 720p default, falls back to available)
 * @param episode - Episode detail object
 * @returns string | null - Best video URL or null if not found
 */
export function getBestVideoUrl(episode: EpisodeDetail): string | null {
  // For new API format, video_url is directly available
  if (episode.video_url) {
    return episode.video_url;
  }

  // Fallback to old format for backward compatibility
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
    book_id: drama.book_id,
    title: drama.title,
    image: drama.image,
    description: drama.introduction,
    protagonist: drama.protagonist,
    tags: drama.tags || drama.tagNames || [],
  };

  if ('rank' in drama && drama.rank) {
    return {
      ...base,
      rank: drama.rank,
      views: drama.views || '',
      episodes: drama.episodes || '',
    };
  }

  return {
    ...base,
    episodes: drama.episodes || '',
    views: drama.views || '',
  };
}

export default {
  getLatest,
  getTrending,
  searchDramas,
  getDramaDetails,
  getEpisodeStream,
  getBestVideoUrl,
  getVideoQualities,
  toUnifiedDrama,
};
