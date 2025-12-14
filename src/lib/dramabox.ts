/***
 @ Base: https://dramabox.web.id/
 @ Author: Shannz
 @ Note: Short drama, directly using dramaboxdb api server
***/

import axios from 'axios';
import * as cheerio from 'cheerio';

const CONFIG = {
    BASE_URL: 'https://dramabox.web.id',
    HEADERS: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
};

const request = async (url) => {
    try {
        const response = await axios.get(url, { headers: CONFIG.HEADERS });
        return cheerio.load(response.data);
    } catch (error) {
        throw new Error(`Network Error: ${error.message}`);
    }
};

const resolveUrl = (link) => {
    if (link && !link.startsWith('http')) {
        return `${CONFIG.BASE_URL}/${link.replace(/^\//, '')}`;
    }
    return link;
};

const getBookIdFromUrl = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('bookId');
    } catch (e) {
        return null;
    }
};

const extractNumber = (text: string) => {
    if (!text) return '0';
    // Extract numbers from text (handles formats like "1.2M views", "📺 90 Ep", etc.)
    const match = text.match(/\d+\.?\d*/);
    return match ? match[0] : '0';
};

const extractEpisodes = (text: string) => {
    if (!text) return '0';
    
    // Handle format like "📺 90 Ep" - extract number before "Ep"
    const epMatch = text.match(/(\d+)\s*Ep/i);
    if (epMatch) return epMatch[1];
    
    // Handle format like "90 episodes"
    const episodeMatch = text.match(/episodes?\s*(\d+)/i);
    if (episodeMatch) return episodeMatch[1];
    
    // Fallback: extract any number
    const numberMatch = text.match(/\d+/);
    return numberMatch ? numberMatch[0] : '0';
};

export const dramabox = {
    home: async () => {
        const $ = await request(CONFIG.BASE_URL);
        const latest = [];
        $('.drama-grid .drama-card').each((_, el) => {
            const link = resolveUrl($(el).find('.watch-button').attr('href'));
            const viewsText = $(el).find('.drama-meta span').first().text().trim();
            const episodesText = $(el).find('.drama-meta span[itemprop="numberOfEpisodes"]').text().trim();
            
            latest.push({
                title: $(el).find('.drama-title').text().trim(),
                book_id: getBookIdFromUrl(link),
                image: $(el).find('.drama-image img').attr('src'),
                views: extractNumber(viewsText),
                episodes: extractEpisodes(episodesText)
            });
        });

        const trending = [];
        $('.sidebar-widget .rank-list .rank-item').each((_, el) => {
            const link = resolveUrl($(el).attr('href'));
            const viewsText = $(el).find('.rank-meta span').eq(0).text().trim();
            const episodesText = $(el).find('.rank-meta span').eq(1).text().trim();
            const fallbackEpisodes = episodesText || viewsText; // Use viewsText if episodesText is empty
            
            trending.push({
                rank: $(el).find('.rank-number').text().trim(),
                title: $(el).find('.rank-title').text().trim(),
                book_id: getBookIdFromUrl(link),
                image: $(el).find('.rank-image img').attr('src'),
                views: extractNumber(viewsText),
                episodes: extractEpisodes(fallbackEpisodes)
            });
        });

        return { latest, trending };
    },

    latest: async (page: number = 1) => {
        const targetUrl = `${CONFIG.BASE_URL}/index.php?page=${page}&lang=in`;
        const $ = await request(targetUrl);
        const latest = [];
        
        $('.drama-grid .drama-card').each((_, el) => {
            const link = resolveUrl($(el).find('.watch-button').attr('href'));
            const viewsText = $(el).find('.drama-meta span').first().text().trim();
            const episodesText = $(el).find('.drama-meta span[itemprop="numberOfEpisodes"]').text().trim();
            
            latest.push({
                title: $(el).find('.drama-title').text().trim(),
                book_id: getBookIdFromUrl(link),
                image: $(el).find('.drama-image img').attr('src'),
                views: extractNumber(viewsText),
                episodes: extractEpisodes(episodesText)
            });
        });

        return latest;
    },

    search: async (query) => {
        const targetUrl = `${CONFIG.BASE_URL}/search.php?lang=in&q=${encodeURIComponent(query)}`;
        const $ = await request(targetUrl);

        const results = [];
        $('.drama-grid .drama-card').each((_, el) => {
            const link = resolveUrl($(el).find('.watch-button').attr('href'));
            results.push({
                title: $(el).find('.drama-title').text().trim(),
                book_id: getBookIdFromUrl(link),
                views: $(el).find('.drama-meta span').first().text().trim().split(' ')[1],
                image: $(el).find('.drama-image img').attr('src')
            });
        });

        return results;
    },

    detail: async (bookId) => {
        if (!bookId) throw new Error("Book ID is required");

        const targetUrl = `${CONFIG.BASE_URL}/watch.php?bookId=${bookId}&lang=in`;
        const $ = await request(targetUrl);

        const fullTitle = $('.video-title').text().trim();
        const cleanTitle = fullTitle.split('- Episode')[0].trim();
        
        const episodes = [];
        $('.episodes-grid .episode-btn').each((_, el) => {
            episodes.push({
                episode: parseInt($(el).text().trim()),
                id: $(el).attr('data-episode')
            });
        });

        // Extract genres/categories
        const genres = [];
        try {
          $('.video-meta .genre-tag').each((_, el) => {
            genres.push($(el).text().trim());
          });
        } catch (e) {
          // If genres don't exist, continue without error
          console.log('Genres not found, continuing...');
        }

        // Extract status
        let status = '';
        try {
          status = $('.video-status .status-text').text().trim();
        } catch (e) {
          // If status doesn't exist, continue without error
          console.log('Status not found, continuing...');
        }

        return {
            book_id: bookId,
            title: cleanTitle,
            description: $('.video-description').text().trim(),
            thumbnail: $('meta[itemprop="thumbnailUrl"]').attr('content'),
            upload_date: $('meta[itemprop="uploadDate"]').attr('content'),
            stats: {
                followers: extractNumber($('.video-meta span').first().text().trim()),
                total_episodes: extractNumber($('span[itemprop="numberOfEpisodes"]').text().trim()),
            },
            episode_list: episodes,
            genres: genres,
            status: status
        };
    },

    stream: async (bookId, episode) => {
        if (!bookId || !episode) throw new Error("Book ID and Episode are required");

        const targetUrl = `${CONFIG.BASE_URL}/watch.php?bookId=${bookId}&lang=in&episode=${episode}`;
        const $ = await request(targetUrl);

        let videoUrl = $('#mainVideo source').attr('src');
        if (!videoUrl) videoUrl = $('#mainVideo').attr('src');

        return {
            book_id: bookId,
            episode: episode,
            video_url: videoUrl
        };
    }
};