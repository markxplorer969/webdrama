'use server';

import { dramabox, DramaDetail, Episode } from '@/lib/scrapers/dramabox';
import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

interface CachedDramaDetail extends DramaDetail {
  lastSyncAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export async function getDramaDetail(bookId: string): Promise<DramaDetail | null> {
  if (!bookId) {
    throw new Error('Book ID is required');
  }

  try {
    // Check Firestore first
    const docRef = adminDb.collection('contents').doc(bookId);
    const doc = await docRef.get();

    if (doc.exists) {
      const data = doc.data() as CachedDramaDetail;
      
      // Check if data is less than 24 hours old
      const now = Math.floor(Date.now() / 1000);
      const lastSync = data.lastSyncAt.seconds;
      const hoursDiff = (now - lastSync) / 3600;

      if (hoursDiff < 24) {
        console.log(`✅ Using cached data for ${bookId} (${hoursDiff.toFixed(1)}h old)`);
        
        // Get episodes from subcollection
        const episodesSnapshot = await adminDb
          .collection('contents')
          .doc(bookId)
          .collection('episodes')
          .orderBy('episode', 'asc')
          .get();

        const episodes: Episode[] = [];
        episodesSnapshot.forEach((episodeDoc) => {
          const episodeData = episodeDoc.data();
          episodes.push({
            episode: episodeData.episode,
            id: episodeData.sourceId // Use the original scraper episode ID
          });
        });

        return {
          book_id: data.book_id,
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          upload_date: data.upload_date,
          stats: data.stats,
          episode_list: episodes
        };
      }
    }

    // Fallback: Scrape fresh data
    console.log(`🔄 Scraping fresh data for ${bookId}`);
    const freshData = await dramabox.detail(bookId);
    
    if (!freshData) {
      throw new Error('Drama not found');
    }

    // Try to cache to Firestore (but don't fail if it doesn't work)
    try {
      const batch = adminDb.batch();

      // Main content document
      const contentRef = adminDb.collection('contents').doc(bookId);
      batch.set(contentRef, {
        book_id: freshData.book_id,
        title: freshData.title,
        description: freshData.description,
        thumbnail: freshData.thumbnail,
        upload_date: freshData.upload_date,
        stats: freshData.stats,
        lastSyncAt: adminDb.firestore.FieldValue.serverTimestamp()
      });

      // Episodes subcollection
      freshData.episode_list.forEach((episode) => {
        const episodeRef = adminDb
          .collection('contents')
          .doc(bookId)
          .collection('episodes')
          .doc(episode.episode.toString());
        
        batch.set(episodeRef, {
          episode: episode.episode,
          sourceId: episode.id, // Store the original scraper episode ID
          createdAt: adminDb.firestore.FieldValue.serverTimestamp()
        });
      });

      // Commit batch
      await batch.commit();
      console.log(`💾 Cached fresh data for ${bookId} with ${freshData.episode_list.length} episodes`);
    } catch (cacheError) {
      console.warn('⚠️ Failed to cache to Firestore:', cacheError);
      // Continue without caching
    }

    // Revalidate the detail page
    revalidatePath(`/drama/${bookId}`);

    return freshData;

  } catch (error) {
    console.error(`Error getting drama detail for ${bookId}:`, error);
    
    // If Firestore fails, try to get fresh data directly
    try {
      console.log(`🔄 Firestore failed, trying direct scrape for ${bookId}`);
      const freshData = await dramabox.detail(bookId);
      return freshData;
    } catch (scrapeError) {
      console.error('Both Firestore and scraper failed:', scrapeError);
      throw scrapeError;
    }
  }
}