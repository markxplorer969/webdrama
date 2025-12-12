import { Suspense } from 'react';
import { getSearchResults } from '@/lib/services/search-service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import SearchResultsSkeleton from '@/components/search/search-results-skeleton';

// Helper function to format view count
const formatViews = (views?: string) => {
  if (!views) return 'N/A';
  const num = parseInt(views.replace(/[^0-9]/g, ''));
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return views;
};

// Helper function to get image URL with fallback
const getImageUrl = (drama: any) => {
  if (drama.image && drama.image.startsWith('http')) {
    return drama.image;
  }
  return `https://picsum.photos/seed/${drama.title}/300/450.jpg`;
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q || '';

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Search Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
              Search Results: {query && `"${query}"`}
            </h1>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      </div>
    </div>
  );
}

async function SearchResults({ query }: { query: string }) {
  const results = query ? await getSearchResults(query) : [];

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="text-slate-400 text-sm">No results</div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
        <p className="text-slate-400">
          Try searching with different keywords or check the spelling
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {results.map((drama: any, index) => (
        <Link href={`/drama/${drama.book_id}`} key={`${drama.book_id}-${index}`}>
          <Card className="overflow-hidden bg-card hover:ring-2 hover:ring-primary transition-all cursor-pointer h-full">
            <div className="aspect-[3/4] relative">
              <img 
                src={getImageUrl(drama)} 
                alt={drama.title} 
                className="object-cover w-full h-full" 
                loading="lazy"
              />
              {drama.views && (
                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-white" />
                    <span className="text-white text-xs">{formatViews(drama.views)}</span>
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-sm line-clamp-2 mb-2">{drama.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">
                {drama.episodes ? `${drama.episodes} Episodes` : 'Ongoing'}
              </p>
              <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                <Play className="w-3 h-3 mr-1" />
                View Details
              </Button>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}