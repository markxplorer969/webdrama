'use server';

import { dramabox, DramaItem } from '@/lib/scrapers/dramabox';

export async function searchAction(formData: FormData) {
  const query = formData.get('query') as string;
  
  if (!query || query.trim().length < 2) {
    return {
      success: false,
      error: 'Please enter at least 2 characters',
      results: []
    };
  }

  try {
    const results = await dramabox.search(query.trim());
    
    return {
      success: true,
      results,
      query: query.trim()
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      success: false,
      error: 'Failed to search. Please try again.',
      results: []
    };
  }
}