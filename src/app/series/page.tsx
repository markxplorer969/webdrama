import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DramaCard } from '@/components/home/DramaCard';

interface SeriesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  title: 'Drama Series - DramaFlex',
  description: 'Browse complete drama series collections on DramaFlex',
};

async function SeriesContent({ page }: { page: number }) {
  // Fetch latest data to show as series
  let series = [];
  
  try {
    const response = await fetch("/api/drama/latest", {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      series = data.data || [];
    }
  } catch (error) {
    console.error('Series fetch error:', error);
  }

  if (series.length === 0) {
    return (
      <div className="text-center py-16">
        <Film className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-zinc-400 mb-2">
          No series available
        </h2>
        <p className="text-zinc-500">
          Check back later for new drama series.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {series.map((drama, index) => (
        <DramaCard 
          key={`${drama.book_id}-${index}`}
          drama={drama}
          index={index}
        />
      ))}
    </div>
  );
}

export default async function SeriesPage({ searchParams }: SeriesPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1');

  return (
    <>
      <main className="min-h-screen bg-zinc-950 pt-8">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-blue-500" />
              <h1 className="text-xl font-bold text-white">
                Drama Series
              </h1>
            </div>
          </div>

          {/* Series Content */}
          <Suspense fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[3/4] bg-zinc-800 rounded-lg animate-pulse" />
                  <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2 animate-pulse" />
                </div>
              ))}
            </div>
          }>
            <SeriesContent page={page} />
          </Suspense>
        </div>
      </main>
    </>
  );
}