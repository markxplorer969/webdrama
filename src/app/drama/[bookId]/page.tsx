import { getDramaDetail } from '@/app/actions/drama-detail';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Clock, Eye, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Helper function to format view count
const formatViews = (views?: string) => {
  if (!views) return 'N/A';
  const num = parseInt(views.replace(/[^0-9]/g, ''));
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return views;
};

// Helper function to format date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Unknown';
  }
};

interface DramaDetailPageProps {
  params: Promise<{ bookId: string }>;
}

export default async function DramaDetailPage({ params }: DramaDetailPageProps) {
  const { bookId } = await params;
  
  let dramaDetail;
  
  try {
    dramaDetail = await getDramaDetail(bookId);
  } catch (error) {
    console.error('Error loading drama detail:', error);
  }

  if (!dramaDetail) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header Section with Blurred Background */}
      <section className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src={dramaDetail.thumbnail}
            alt={dramaDetail.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="max-w-4xl">
            <Link href="/search">
              <Button variant="ghost" className="mb-4 text-white hover:bg-slate-800/50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {dramaDetail.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-300 mb-6">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{dramaDetail.stats.total_episodes} Episodes</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{formatViews(dramaDetail.stats.followers)} followers</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(dramaDetail.upload_date)}</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
                <Play className="w-5 h-5 mr-2" />
                Start Watching
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                Add to Watchlist
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
                <p className="text-slate-300 leading-relaxed">
                  {dramaDetail.description || 'No synopsis available.'}
                </p>
              </CardContent>
            </Card>

            {/* Episode List */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Episodes</h2>
                
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {dramaDetail.episode_list.map((episode) => (
                      <Link
                        key={`${episode.episode}-${episode.id}`}
                        href={`/watch/${dramaDetail.book_id}?ep=${episode.episode}`}
                      >
                        <Button
                          variant="outline"
                          className="w-full h-16 bg-slate-800 border-slate-700 hover:bg-violet-600 hover:border-violet-600 hover:text-white text-slate-300"
                        >
                          <div className="flex flex-col items-center">
                            <Play className="w-4 h-4 mb-1" />
                            <span className="text-sm font-semibold">
                              EP {episode.episode}
                            </span>
                          </div>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Drama Info */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Drama Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Episodes</span>
                    <span className="text-white font-semibold">
                      {dramaDetail.stats.total_episodes}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Followers</span>
                    <span className="text-white font-semibold">
                      {formatViews(dramaDetail.stats.followers)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Upload Date</span>
                    <span className="text-white font-semibold">
                      {formatDate(dramaDetail.upload_date)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Start from Episode 1
                  </Button>
                  <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-800">
                    Add to Favorites
                  </Button>
                  <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-800">
                    Share Drama
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}