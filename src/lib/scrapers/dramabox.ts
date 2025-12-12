import axios from 'axios';
import * as cheerio from 'cheerio';

const CONFIG = {
    BASE_URL: 'https://dramabox.web.id',
    HEADERS: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
};

const request = async (url: string) => {
    try {
        const response = await axios.get(url, { headers: CONFIG.HEADERS });
        return cheerio.load(response.data);
    } catch (error) {
        throw new Error(`Network Error: ${(error as Error).message}`);
    }
};

const resolveUrl = (link: string) => {
    if (link && !link.startsWith('http')) {
        return `${CONFIG.BASE_URL}/${link.replace(/^\//, '')}`;
    }
    return link;
};

const getBookIdFromUrl = (url: string) => {
    try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('bookId');
    } catch (e) {
        return null;
    }
};

export interface DramaItem {
    title: string;
    book_id: string | null;
    image: string;
    views?: string;
    episodes?: string;
    rank?: string;
}

export interface DramaDetail {
    book_id: string;
    title: string;
    description: string;
    thumbnail: string;
    upload_date: string;
    stats: {
        followers: string;
        total_episodes: string;
    };
    episode_list: Episode[];
}

export interface Episode {
    episode: number;
    id: string;
}

export interface StreamData {
    book_id: string;
    episode: number;
    video_url: string;
}

export const dramabox = {
    /**
     * Fetch home page data - latest and trending dramas
     */
    async home(): Promise<{ latest: DramaItem[]; trending: DramaItem[] }> {
        try {
            const $ = await request(CONFIG.BASE_URL);
            const latest: DramaItem[] = [];
            $('.drama-grid .drama-card').each((_, el) => {
                const link = resolveUrl($(el).find('.watch-button').attr('href') || '');
                latest.push({
                    title: $(el).find('.drama-title').text().trim(),
                    book_id: getBookIdFromUrl(link),
                    image: $(el).find('.drama-image img').attr('src') || '',
                    views: $(el).find('.drama-meta span').first().text().trim().split(' ')[1],
                    episodes: $(el).find('.drama-meta span[itemprop="numberOfEpisodes"]').text().trim().split(' ')[1]
                });
            });

            const trending: DramaItem[] = [];
            $('.sidebar-widget .rank-list .rank-item').each((_, el) => {
                const link = resolveUrl($(el).attr('href') || '');
                trending.push({
                    rank: $(el).find('.rank-number').text().trim(),
                    title: $(el).find('.rank-title').text().trim(),
                    book_id: getBookIdFromUrl(link),
                    image: $(el).find('.rank-image img').attr('src') || '',
                    views: $(el).find('.rank-meta span').eq(0).text().trim().split(' ')[1],
                    episodes: $(el).find('.rank-meta span').eq(1).text().trim().split(' ')[1]
                });
            });

            return { latest, trending };
        } catch (error) {
            console.error('Error fetching home data:', error);
            return { latest: [], trending: [] };
        }
    },

    /**
     * Search for dramas by query
     */
    async search(query: string): Promise<DramaItem[]> {
        try {
            const targetUrl = `${CONFIG.BASE_URL}/search.php?lang=in&q=${encodeURIComponent(query)}`;
            const $ = await request(targetUrl);

            const results: DramaItem[] = [];
            $('.drama-grid .drama-card').each((_, el) => {
                const link = resolveUrl($(el).find('.watch-button').attr('href') || '');
                results.push({
                    title: $(el).find('.drama-title').text().trim(),
                    book_id: getBookIdFromUrl(link),
                    views: $(el).find('.drama-meta span').first().text().trim().split(' ')[1],
                    image: $(el).find('.drama-image img').attr('src') || ''
                });
            });

            return results;
        } catch (error) {
            console.error('Error searching dramas:', error);
            return [];
        }
    },

    /**
     * Get detailed information about a specific drama
     */
    async detail(bookId: string): Promise<DramaDetail | null> {
        try {
            if (!bookId) throw new Error("Book ID is required");

            const targetUrl = `${CONFIG.BASE_URL}/watch.php?bookId=${bookId}&lang=in`;
            const $ = await request(targetUrl);

            const fullTitle = $('.video-title').text().trim();
            const cleanTitle = fullTitle.split('- Episode')[0].trim();
            
            const episodes: Episode[] = [];
            $('.episodes-grid .episode-btn').each((_, el) => {
                episodes.push({
                    episode: parseInt($(el).text().trim()),
                    id: $(el).attr('data-episode') || ''
                });
            });

            return {
                book_id: bookId,
                title: cleanTitle,
                description: $('.video-description').text().trim(),
                thumbnail: $('meta[itemprop="thumbnailUrl"]').attr('content') || '',
                upload_date: $('meta[itemprop="uploadDate"]').attr('content') || '',
                stats: {
                    followers: $('.video-meta span').first().text().trim().split(' ')[1],
                    total_episodes: $('span[itemprop="numberOfEpisodes"]').text().trim().split(' ')[1],
                },
                episode_list: episodes
            };
        } catch (error) {
            console.error('Error fetching drama details:', error);
            return null;
        }
    },

    /**
     * Get streaming data for a specific episode
     */
    async stream(bookId: string, episode: number): Promise<StreamData | null> {
        try {
            if (!bookId || !episode) throw new Error("Book ID and Episode are required");

            const targetUrl = `${CONFIG.BASE_URL}/watch.php?bookId=${bookId}&lang=in&episode=${episode}`;
            const $ = await request(targetUrl);

            let videoUrl = $('#mainVideo source').attr('src');
            if (!videoUrl) videoUrl = $('#mainVideo').attr('src');

            return {
                book_id: bookId,
                episode: episode,
                video_url: videoUrl || ''
            };
        } catch (error) {
            console.error('Error fetching stream data:', error);
            return null;
        }
    }
};