import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { DramaCard } from '@/components/home/DramaCard';

interface TrendingPageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata: Metadata = {
  title: 'Trending Dramas - DramaFlex',
  description: 'Discover the most popular and trending dramas on DramaFlex',
};

async function TrendingContent({ page }: { page: number }) {
  // Fetch trending data from API
  let trending = [];
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/home`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      trending = data.trending || [];
    }
  } catch (error) {
    console.error('Trending fetch error:', error);
  }

  if (trending.length === 0) {
    return (
      <div className="text-center py-16">
        <TrendingUp className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-zinc-400 mb-2">
          No trending dramas available
        </h2>
        <p className="text-zinc-500">
          Check back later for the most popular dramas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {trending.map((drama, index) => (
        <DramaCard 
          key={`${drama.book_id}-${index}`}
          drama={drama}
          index={index}
        />
      ))}
    </div>
  );
}

export default async function TrendingPage({ searchParams }: TrendingPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1');

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-zinc-950 pt-20">
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
              <TrendingUp className="w-5 h-5 text-rose-500" />
              <h1 className="text-xl font-bold text-white">
                Trending Dramas
              </h1>
            </div>
          </div>

          {/* Trending Content */}
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
            <TrendingContent page={page} />
          </Suspense>
        </div>
      </main>
    </>
  );
}