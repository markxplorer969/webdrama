import { dramabox, DramaItem } from '@/lib/scrapers/dramabox';
import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

export async function getSearchResults(query: string): Promise<DramaItem[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    // First try to get cached results from Firestore
    const cacheKey = query.toLowerCase().trim();
    const cacheRef = adminDb.collection('search_cache').doc(cacheKey);
    const cacheDoc = await cacheRef.get();

    if (cacheDoc.exists) {
      const data = cacheDoc.data() as { results: DramaItem[], timestamp: any };
      const cacheAge = (Date.now() - data.timestamp.toDate().getTime()) / (1000 * 60 * 60); // hours
      
      if (cacheAge < 1) { // Cache is less than 1 hour old
        console.log(`✅ Using cached search results for "${query}" (${cacheAge.toFixed(1)}h old)`);
        return data.results;
      }
    }

    // If no cache or expired, scrape fresh data
    console.log(`🔄 Scraping fresh search results for "${query}"`);
    const results = await dramabox.search(query.trim());

    // Cache the results for future use
    if (results.length > 0) {
      try {
        await cacheRef.set({
          results,
          timestamp: adminDb.firestore.FieldValue.serverTimestamp()
        });
        console.log(`💾 Cached search results for "${query}" with ${results.length} items`);
      } catch (cacheError) {
        console.warn('⚠️ Failed to cache search results:', cacheError);
      }
    }

    // Revalidate the search page
    revalidatePath('/search');

    return results;
  } catch (error) {
    console.error('Search service error:', error);
    return [];
  }
}