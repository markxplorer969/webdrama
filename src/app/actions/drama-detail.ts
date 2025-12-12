'use server';

import { adminDb } from '@/lib/firebase-admin'; // Ensure you import your initialized admin db
import { dramabox } from '@/lib/scrapers/dramabox';

export async function getDramaDetail(bookId: string) {
  if (!bookId) return null;

  console.log(`🔍 [Action] Getting details for: ${bookId}`);
  
  // Check if Firebase is properly initialized
  if (!adminDb) {
    console.error("❌ Firebase Admin not initialized");
    return null;
  }

  const docRef = adminDb.collection('contents').doc(String(bookId));
  console.log(`📝 Document reference created: ${docRef.path}`);

  // 1. Try to fetch from Cache (Firestore)
  try {
    console.log("🔎 Attempting to read from Firestore...");
    const doc = await docRef.get();
    console.log(`📄 Document exists: ${doc.exists}`);
    
    // If exists and synced recently (optional logic), return it
    if (doc.exists) {
      console.log("✅ Found in Cache (Firestore)");
      console.log("📊 Cached data:", doc.data());
      return doc.data();
    } else {
      console.log("📭 Document not found in cache");
    }
  } catch (error) {
    console.warn("⚠️ Firestore read error (proceeding to scrape):", error);
  }

  // 2. Fallback: Scrape from Dramabox
  console.log("🌍 Data not in DB. Scraping Dramabox...");
  try {
    const detail = await dramabox.detail(bookId);
    
    if (!detail) {
        console.error("❌ Scraper returned null");
        return null;
    }

    console.log("📦 Data scraped successfully:");
    console.log(`  - Title: ${detail.title}`);
    console.log(`  - Episodes: ${detail.episode_list?.length || 0}`);

    // 3. Save to Firestore (Async / Fire & Forget)
    // We use .set({ ... }, { merge: true }) to prevent NOT_FOUND errors
    console.log("💾 Saving to Firestore...");
    
    try {
      // Clean data before saving - remove undefined values
      const cleanedData = {
        book_id: detail.book_id,
        title: detail.title || '',
        description: detail.description || '',
        thumbnail: detail.thumbnail || '',
        upload_date: detail.upload_date || '',
        stats: {
          followers: detail.stats?.followers || '0',
          total_episodes: detail.stats?.total_episodes || '0'
        },
        episode_list: detail.episode_list || [],
        lastSyncAt: new Date().toISOString(),
        provider: 'dramabox'
      };

      console.log("💾 Saving main document...");
      console.log("🧹 Cleaned data:", JSON.stringify(cleanedData, null, 2));
      
      await docRef.set(cleanedData, { merge: true });
      console.log("✅ Main document saved successfully");

      // Save Episodes (Batch Write)
      if (detail.episode_list && detail.episode_list.length > 0) {
        console.log(`💾 Saving ${detail.episode_list.length} episodes...`);
        const batch = adminDb.batch();
        
        detail.episode_list.forEach((ep: any, index: number) => {
          console.log(`  💾 Preparing episode ${index + 1}: ${ep.episode}`);
          // Use String() to ensure ID is a string
          const epRef = docRef.collection('episodes').doc(String(ep.episode));
          batch.set(epRef, {
              title: `Episode ${ep.episode}`,
              sequence: ep.episode,
              sourceId: ep.id, // The real ID for streaming
              updatedAt: new Date().toISOString()
          }, { merge: true });
        });
        
        console.log("💾 Committing batch...");
        await batch.commit();
        console.log(`✅ Saved ${detail.episode_list.length} episodes successfully`);
      } else {
        console.log("ℹ️ No episodes to save");
      }

      console.log("🎉 All data saved to Firestore successfully!");
      return detail;

    } catch (saveError) {
      console.error("❌ Firestore Save Error:", saveError);
      console.error("❌ Error details:", {
        message: saveError.message,
        code: saveError.code,
        details: saveError.details
      });
      // Return scraped data even if save fails
      console.log("⚠️ Returning scraped data without caching");
      return detail;
    }

  } catch (error) {
    console.error("❌ Scraper/Save Failed:", error);
    console.error("❌ Error details:", {
      message: error.message,
      code: error.code,
      details: error.details
    });
    return null; // Return null so UI shows "Drama Not Found"
  }
}