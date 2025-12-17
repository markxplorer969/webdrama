import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Play, Calendar, Eye, Film, Clock, Tag, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { formatNumber } from '@/lib/currency';
import { serverFetch } from '@/lib/utils/api';

interface DramaDetail {
  book_id: string;
  title: string;
  description: string;
  thumbnail: string;
  upload_date: string;
  stats: {
    followers: string;
    total_episodes: string;
  };
  episode_list: Array<{
    episode: number;
    id: string;
  }>;
  genres: string[];
  status: string;
}

interface DramaDetailPageProps {
  params: { bookId: string };
}

async function getDramaDetail(bookId: string): Promise<DramaDetail | null> {
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

export default async function DramaDetailPage({ params }: DramaDetailPageProps) {
  const drama = await getDramaDetail(params.bookId);

  if (!drama) {
    notFound();
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-zinc-950 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{drama.title}</h1>
                  <div className="flex items-center gap-3">
                    {drama.status && (
                      <Badge variant={drama.status === 'Ongoing' ? 'default' : 'secondary'} className="text-xs">
                        {drama.status}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {drama.episode_list.length} Episodes
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button size="lg" className="bg-rose-500 hover:bg-rose-600">
                    <Play className="w-5 h-5" fill="white" />
                    Watch Now
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-zinc-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Synopsis</h2>
                <p className="text-zinc-300 leading-relaxed">
                  {drama.description || 'No description available.'}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Followers</span>
                      <span className="text-white font-medium">{formatNumber(drama.stats.followers)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total Episodes</span>
                      <span className="text-white font-medium">{drama.stats.total_episodes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Status</span>
                      <span className="text-white font-medium capitalize">{drama.status}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Upload Date</span>
                      <span className="text-white font-medium">
                        {new Date(drama.upload_date).toLocaleDateString()}
                      </span>
                    </div>
                    {drama.genres && drama.genres.length > 0 && (
                      <div>
                        <span className="text-zinc-400">Genres</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {drama.genres.map((genre, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Thumbnail */}
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src={drama.thumbnail}
                  alt={drama.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Episodes List */}
              <div className="bg-zinc-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Film className="w-5 h-5" />
                  Episodes
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {drama.episode_list.map((episode) => (
                    <Link
                      key={episode.id}
                      href={`/watch?bookId=${drama.book_id}&episode=${episode.episode}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">Episode {episode.episode}</span>
                        <span className="text-zinc-400 text-sm">ID: {episode.id}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-rose-500" fill="currentColor" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}