import { getHomeFeed } from '@/app/actions/home';
import { DramaItem } from '@/lib/scrapers/dramabox';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, Clock, TrendingUp, Hash, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import HeroSearch from '@/components/home/hero-search';

export default async function Home() {
  const { latest, trending } = await getHomeFeed();
  const heroDrama = trending[0] || latest[0];

  const formatViews = (views?: string) => {
    if (!views) return 'N/A';
    const num = parseInt(views.replace(/[^0-9]/g, ''));
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return views;
  };

  const getImageUrl = (drama: DramaItem) => {
    if (drama.image && drama.image.startsWith('http')) {
      return drama.image;
    }
    return `https://picsum.photos/seed/${drama.title}/300/450.jpg`;
  };

  return (
    <main className="min-h-screen bg-slate-950">
      {heroDrama ? (
        <>
          <section className="relative h-[70vh] min-h-[600px]">
            <div className="absolute inset-0">
              <Image
                src={getImageUrl(heroDrama)}
                alt={heroDrama.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
            </div>
            
            <div className="relative container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl">
                <HeroSearch />
              </div>
            </div>
            
            <div className="relative container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  {heroDrama.title}
                </h1>
                
                <div className="flex items-center gap-4 text-slate-300 mb-6">
                  <Badge className="bg-violet-600 text-white">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {heroDrama.rank ? `#${heroDrama.rank} Trending` : '#1 Trending'}
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-800 text-slate-200">
                    <Eye className="w-3 h-3 mr-1" />
                    {formatViews(heroDrama.views)} views
                  </Badge>
                </div>
                
                <p className="text-slate-400 mb-8 max-w-lg">
                  Experience this captivating drama that has everyone talking. 
                  Don't miss out on this trending sensation.
                </p>
                
                <div className="flex gap-4">
                  <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Now
                  </Button>
                  <Link href="/search">
                    <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                      <Search className="w-5 h-5 mr-2" />
                      Search Dramas
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4 py-12 space-y-16">
            {trending.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white">Top Trending</h2>
                  <Link href="/search">
                    <Button variant="ghost" className="text-violet-400 hover:text-violet-300">
                      Search More
                    </Button>
                  </Link>
                </div>
                
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                  {trending.map((drama, index) => (
                    <Card key={`${drama.book_id}-${index}`} className="flex-none w-48 bg-slate-900 border-slate-800 hover:border-violet-600 transition-colors cursor-pointer">
                      <div className="relative">
                        <Image
                          src={getImageUrl(drama)}
                          alt={drama.title}
                          width={192}
                          height={288}
                          className="w-full h-72 object-cover rounded-t-lg"
                        />
                        {drama.rank && (
                          <div className="absolute top-2 left-2 bg-violet-600 px-2 py-1 rounded">
                            <div className="flex items-center gap-1">
                              <Hash className="w-3 h-3 text-white" />
                              <span className="text-white text-xs font-semibold">{drama.rank}</span>
                            </div>
                          </div>
                        )}
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
                        <h3 className="font-semibold text-white mb-2 line-clamp-2">{drama.title}</h3>
                        {drama.episodes && (
                          <div className="flex items-center gap-1 text-slate-400 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>{drama.episodes} Episodes</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {latest.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white">Latest Updates</h2>
                  <Link href="/search">
                    <Button variant="ghost" className="text-violet-400 hover:text-violet-300">
                      Search More
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {latest.map((drama, index) => (
                    <Card key={`${drama.book_id}-${index}`} className="bg-slate-900 border-slate-800 hover:border-violet-600 transition-colors cursor-pointer">
                      <div className="relative">
                        <Image
                          src={getImageUrl(drama)}
                          alt={drama.title}
                          width={240}
                          height={360}
                          className="w-full h-64 object-cover rounded-t-lg"
                        />
                        {drama.episodes && (
                          <div className="absolute top-2 left-2 bg-violet-600 px-2 py-1 rounded">
                            <span className="text-white text-xs font-semibold">{drama.episodes} EP</span>
                          </div>
                        )}
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
                        <h3 className="font-semibold text-white mb-2 line-clamp-2">{drama.title}</h3>
                        {drama.episodes && (
                          <div className="flex items-center gap-1 text-slate-400 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>{drama.episodes} Episodes</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading Dramas...</h2>
            <p className="text-slate-400">Fetching the latest content for you</p>
          </div>
        </div>
      )}
    </main>
  );
}