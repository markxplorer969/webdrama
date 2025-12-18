import { HeroSection } from '@/components/home/HeroSection';
import { TrendingScroll } from '@/components/home/TrendingScroll';
import { LatestGrid } from '@/components/home/LatestGrid';
import { getTrending, toUnifiedDrama, type UnifiedDrama } from '@/lib/services/dramabox';
import { Loader2, Film } from 'lucide-react';

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-zinc-800 border-t-rose-500 rounded-full animate-spin" />
        <Film className="absolute inset-0 m-auto w-8 h-8 text-rose-500" />
      </div>
      <p className="text-zinc-400 animate-pulse">Loading amazing content...</p>
    </div>
  </div>
);

// Error Component
const ErrorComponent = () => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    <div className="text-center space-y-4">
      <Film className="w-16 h-16 text-rose-500 mx-auto" />
      <h2 className="text-xl font-semibold text-white">Oops! Something went wrong</h2>
      <p className="text-zinc-400">Failed to load content. Please try again later.</p>
    </div>
  </div>
);

export default async function Home() {
  // Fetch data directly from external API
  let trendingData: UnifiedDrama[] = [];
  let error: Error | null = null;

  try {
    const trending = await getTrending();
    
    // Convert to unified format and split for hero section (top 3) and rest
    trendingData = trending.map((drama, index) => 
      toUnifiedDrama(drama, (index + 1).toString())
    );
  } catch (err) {
    console.error('Home page error:', err);
    error = err instanceof Error ? err : new Error('Unknown error');
  }

  // Show error state
  if (error) {
    return <ErrorComponent />;
  }

  // Split trending data: top 3 for hero, rest for scroll
  const heroTrending = trendingData.slice(0, 3);
  const scrollTrending = trendingData.slice(3);

  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section - Top 3 Trending */}
        <HeroSection trending={heroTrending} />
        
        {/* Trending Scroll - Rest of Trending */}
        <TrendingScroll trending={scrollTrending} />
        
        {/* Latest Episodes Grid - Using remaining trending as latest for now */}
        <LatestGrid latest={trendingData.slice(0, 12)} />
      </main>
    </div>
  );
}
