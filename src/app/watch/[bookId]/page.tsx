import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WatchClient from '@/components/watch/WatchClient';
import { serverFetch } from '@/lib/utils/api';

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
    const response = await serverFetch(`/api/drama/detail?bookId=${bookId}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
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