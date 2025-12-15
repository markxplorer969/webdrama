import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronLeft, Heart, List, Play, LayoutGrid, Loader2, Calendar, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WatchContent } from './WatchContent';

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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/drama/detail?bookId=${bookId}`, {
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
  const episode = resolvedSearchParams.episode || '1';

  const drama = await getDramaDetail(bookId);

  if (!drama) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-white mb-4">Drama Not Found</h1>
          <p className="text-zinc-400 mb-6">The drama you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button className="bg-rose-600 hover:bg-rose-700">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <WatchContent drama={drama} episode={episode} />
    </div>
  );
}