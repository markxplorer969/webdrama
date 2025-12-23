import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WatchClient from '@/components/watch/WatchClient';
import { getDramaDetails, getBestVideoUrl, type DramaDetails } from '@/lib/services/dramabox';

interface WatchPageProps {
  params: Promise<{ bookId: string }>;
  searchParams: Promise<{ episode?: string }>;
}

export const metadata: Metadata = {
  title: 'Watch Drama - DramaFlex',
  description: 'Watch your favorite dramas online on DramaFlex',
};

async function getDramaDetail(bookId: string) {
  try {
    const dramaData = await getDramaDetails(bookId);
    
    if (!dramaData) {
      return null;
    }

    // Transform the data to match the expected Drama interface for WatchClient
    const transformedDrama = {
      book_id: dramaData.bookId,
      title: dramaData.bookName,
      description: dramaData.introduction || 'No description available.',
      thumbnail: dramaData.coverWap || '',
      poster: dramaData.coverWap || '',
      upload_date: new Date().toISOString(),
      status: 'Ongoing',
      stats: {
        followers: '0',
        total_episodes: dramaData.episodes.length.toString(),
      },
      episode_list: dramaData.episodes.map((episode, index) => ({
        episode: episode.chapterIndex + 1,
        id: episode.chapterId,
        title: episode.chapterName,
        is_free: episode.chapterIndex === 0, // First episode is usually free
      })),
    };

    return transformedDrama;
  } catch (error) {
    console.error('Failed to fetch drama detail:', error);
    return null;
  }
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const bookId = resolvedParams.bookId;
  const initialEpisode = resolvedSearchParams.episode || '1';

  const drama = await getDramaDetail(bookId);

  if (!drama) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-white mb-4">Drama Not Found</h1>
          <p className="text-zinc-400 mb-6">The drama you're looking for doesn't exist or has been removed.</p>
          <a 
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-rose-600 hover:bg-rose-700 px-6 py-3 text-white font-medium transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <WatchClient 
        drama={drama} 
        initialEpisode={initialEpisode}
      />
    </div>
  );
}
