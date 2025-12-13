import { dramabox, DramaItem } from '@/lib/scrapers/dramabox';
import { adminDb } from '@/lib/firebase-admin';

export async function getSearchResults(query: string): Promise<DramaItem[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    // First try to get cached results from Firestore
    const cacheKey = query.toLowerCase().trim();
    let cacheDoc;
    
    try {
      const cacheRef = adminDb.collection('search_cache').doc(cacheKey);
      cacheDoc = await cacheRef.get();
    } catch (firestoreError) {
      console.log('🔥 Firestore not available, using direct scraping');
      // If Firestore is not available, proceed directly to scraping
      cacheDoc = { exists: false };
    }

    if (cacheDoc && cacheDoc.exists) {
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

    // Cache the results for future use (only if Firebase is available)
    if (results.length > 0 && cacheDoc !== undefined) {
      try {
        const cacheRef = adminDb.collection('search_cache').doc(cacheKey);
        await cacheRef.set({
          results,
          timestamp: new Date()
        });
        console.log(`💾 Cached search results for "${query}" with ${results.length} items`);
      } catch (cacheError) {
        console.warn('⚠️ Failed to cache search results:', cacheError);
      }
    }

    return results;
  } catch (error) {
    console.error('Search service error:', error);
    // Fallback to direct scraping if all else fails
    try {
      console.log(`🔄 Fallback: Scraping fresh search results for "${query}"`);
      return await dramabox.search(query.trim());
    } catch (fallbackError) {
      console.error('Fallback scraping failed:', fallbackError);
      return [];
    }
  }
}