'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Gift,
  Play,
  Info,
  Bell,
  Inbox
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'promo' | 'maintenance' | 'content';
  createdAt: any;
}

interface AnnouncementCardProps {
  announcement: Announcement;
}

// Type configurations
const announcementTypes = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-500',
    hoverBgColor: 'hover:bg-blue-600',
    label: 'Info'
  },
  promo: {
    icon: Gift,
    bgColor: 'bg-amber-500',
    hoverBgColor: 'hover:bg-amber-600',
    label: 'Promo'
  },
  maintenance: {
    icon: AlertTriangle,
    bgColor: 'bg-red-500',
    hoverBgColor: 'hover:bg-red-600',
    label: 'Maintenance'
  },
  content: {
    icon: Play,
    bgColor: 'bg-green-500',
    hoverBgColor: 'hover:bg-green-600',
    label: 'Konten'
  }
};

function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const typeConfig = announcementTypes[announcement.type];
  const Icon = typeConfig.icon;

  // Format relative time
  const formatRelativeTime = (timestamp: any) => {
    if (!timestamp) return 'Baru saja';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    try {
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: id 
      });
    } catch {
      return formatDistanceToNow(date, { 
        addSuffix: true 
      });
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden transition-all duration-300 hover:border-zinc-700">
      <CardContent className="p-0">
        {/* Clickable Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center gap-4 text-left hover:bg-zinc-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-inset"
        >
          {/* Left - Icon */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full ${typeConfig.bgColor} ${typeConfig.hoverBgColor} flex items-center justify-center transition-colors`}>
            <Icon className="w-5 h-5 text-white" />
          </div>

          {/* Middle - Title and Date */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm md:text-base mb-1 truncate">
              {announcement.title}
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm">
              {formatRelativeTime(announcement.createdAt)}
            </p>
          </div>

          {/* Right - Chevron */}
          <div className="flex-shrink-0">
            <ChevronDown 
              className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-zinc-800">
            <div className="pt-4">
              <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                {announcement.content}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AnnouncementSkeleton() {
  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Icon Skeleton */}
          <Skeleton className="w-10 h-10 rounded-full bg-zinc-800" />
          
          {/* Text Skeletons */}
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-3/4 bg-zinc-800 mb-2" />
            <Skeleton className="h-4 w-1/2 bg-zinc-800" />
          </div>
          
          {/* Chevron Skeleton */}
          <Skeleton className="w-5 h-5 bg-zinc-800" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <Inbox className="w-10 h-10 text-zinc-600" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">
        Tidak Ada Pengumuman
      </h3>
      <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
        Saat ini tidak ada pengumuman terbaru. Nantikan update menarik seputar layanan kami!
      </p>
    </div>
  );
}

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'announcements'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Announcement[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          title: data.title,
          content: data.content,
          type: data.type,
          createdAt: data.createdAt
        });
      });
      setAnnouncements(items);
      setLoading(false);
    }, (error) => {
      console.error('Error loading announcements:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-zinc-600" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">
            Akses Diperlukan
          </h1>
          <p className="text-zinc-400 text-sm">
            Silakan masuk untuk melihat pengumuman terbaru.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Kotak Masuk
          </h1>
          <p className="text-zinc-400 text-sm md:text-base">
            Update terbaru seputar layanan kami.
          </p>
        </div>

        {/* Announcements List */}
        <div className="space-y-3">
          {loading ? (
            // Loading skeletons
            <>
              <AnnouncementSkeleton />
              <AnnouncementSkeleton />
              <AnnouncementSkeleton />
              <AnnouncementSkeleton />
            </>
          ) : announcements.length === 0 ? (
            <EmptyState />
          ) : (
            announcements.map((announcement) => (
              <AnnouncementCard 
                key={announcement.id} 
                announcement={announcement} 
              />
            ))
          )}
        </div>

        {/* Footer info */}
        {!loading && announcements.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-xs">
              Menampilkan {announcements.length} pengumuman
            </p>
          </div>
        )}
      </div>
    </div>
  );
}