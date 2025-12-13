import { Suspense } from 'react';
import SmartPlayer from '@/components/drama/SmartPlayer';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface WatchPageProps {
  params: Promise<{ dramaId: string }>;
  searchParams: Promise<{ ep?: string }>;
}

// Loading component for Suspense
function PlayerLoader() {
  return (
    <Card className="w-full bg-slate-900 border-slate-800">
      <CardContent className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-violet-500" />
            <p className="text-slate-400">Loading player...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const { dramaId } = await params;
  const { ep } = await searchParams;
  
  const episodeNumber = ep ? parseInt(ep) : 1;
  const episodeId = `${dramaId}-${episodeNumber}`;

  // In a real app, you would fetch this data from your API/database
  const mockDramaData = {
    title: "Kejutan Menyakitkan dari Istriku",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Sample video
    poster: `https://picsum.photos/seed/${dramaId}/1280/720.jpg`,
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Episode Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {mockDramaData.title} - Episode {episodeNumber}
            </h1>
            <p className="text-slate-400">
              Drama ID: {dramaId} | Episode ID: {episodeId}
            </p>
          </div>

          {/* SmartPlayer - Clean Usage without userId prop */}
          <Suspense fallback={<PlayerLoader />}>
            <SmartPlayer
              videoUrl={mockDramaData.videoUrl}
              poster={mockDramaData.poster}
              episodeId={episodeId}
              dramaTitle={mockDramaData.title}
              episodeNumber={episodeNumber}
            />
          </Suspense>

          {/* Additional Episode Info */}
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Episode Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Drama ID:</span>
                      <span className="text-white">{dramaId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Episode:</span>
                      <span className="text-white">{episodeNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cost:</span>
                      <span className="text-violet-400">1 Coin</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">How it works</h3>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Login to unlock episodes</li>
                    <li>• Each episode costs 1 coin</li>
                    <li>• Once unlocked, watch anytime</li>
                    <li>• Your balance updates automatically</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}