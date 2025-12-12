'use server';

import { dramabox, DramaItem } from '@/lib/scrapers/dramabox';

export async function getHomeFeed(): Promise<{
  latest: DramaItem[];
  trending: DramaItem[];
}> {
  try {
    const { latest, trending } = await dramabox.home();
    return {
      latest: latest || [],
      trending: trending || []
    };
  } catch (error) {
    console.error('Error fetching home feed:', error);
    // Return empty arrays if scraper fails
    return {
      latest: [],
      trending: []
    };
  }
}