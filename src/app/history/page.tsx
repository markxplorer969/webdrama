'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Play, 
  PlayCircle, 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  Trash2, 
  History, 
  MoreHorizontal,
  ChevronDown,
  Eye,
  EyeOff,
  Grid3X3,
  List,
  CheckCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc, deleteDoc, collection, query, orderBy, onSnapshot, where, getFirestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface HistoryItem {
  bookId: string;
  title: string;
  poster: string;
  episode: number;
  progress: number;
  updatedAt: any;
}

interface FilterOptions {
  value: string;
  label: string;
  count: number;
}

function HistoryCard({ 
  item, 
  onDelete, 
  onSelect 
}: { 
  item: HistoryItem; 
  onDelete: (bookId: string) => void;
  onSelect: (bookId: string) => void;
}) {
  const [imageError, setImageError] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(false);
    
    try {
      const { user } = await import('@/context/AuthContext').then(mod => mod.useAuth());
      if (!user) return;

      const historyRef = doc(db, 'users', user.uid, 'history', item.bookId);
      await deleteDoc(historyRef);
      
      onDelete(item.bookId);
    } catch (error) {
      console.error('Failed to delete history item:', error);
    }
  };

  const formatProgress = (progress: number) => {
    return `${Math.round(progress)}%`;
  };

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const past = new Date(timestamp.seconds * 1000);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} jam yang lalu`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} hari yang lalu`;
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}j ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-rose-600/50 transition-all duration-300 cursor-pointer">
      {/* Progress Bar Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
          <div 
            className="h-full bg-rose-600 transition-all duration-300 group-hover:bg-rose-500"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      </div>

      {/* Actions Menu */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className="bg-zinc-800/90 hover:bg-zinc-700 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <MoreHorizontal className="w-4 h-4 text-zinc-300" />
        </button>
      </div>

      {/* Actions Dropdown */}
      {showActions && (
        <div className="absolute top-12 right-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 p-2 min-w-[160px]">
          <div className="space-y-2">
            <button
              onClick={() => {
                onSelect(item.bookId);
                setShowActions(false);
              }}
              className="w-full text-left px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-md transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Lanjutkan Menonton
            </button>
            
            <button
              onClick={() => {
                onDelete(item.bookId);
                setShowActions(false);
              }}
              className="w-full text-left px-3 py-2 text-zinc-300 hover:text-red-400 hover:bg-red-600/20 rounded-md transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Hapus dari Riwayat
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <Link href={`/watch/${item.bookId}?episode=${item.episode}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={item.poster}
            alt={item.title}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
              imageError ? 'opacity-50' : ''
            }`}
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          
          {/* Fallback for image error */}
          {imageError && (
            <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-zinc-600" />
            </div>
          )}
        </div>

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white mb-1 truncate pr-2">
                {item.title}
              </h4>
              <div className="flex items-center gap-3 text-zinc-300">
                <span className="text-rose-400 font-medium">
                  Episode {item.episode + 1}
                </span>
                <span className="text-zinc-400">
                  • {formatProgress(item.progress)} ditonton
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(item.updatedAt)}</span>
                <span className="text-zinc-500">
                  • {formatDuration(item.progress * 30)} tersisa
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                {item.episode > 1 ? `Episode ${item.episode}` : 'Episode 1'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-rose-600/90 hover:bg-rose-600/80 rounded-full p-4 transition-all duration-300 group-hover:scale-110">
            <Play className="w-8 h-8 text-white" fill="currentColor" />
          </div>
        </div>
      </Link>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="h-8 lg:h-10 bg-zinc-800 rounded w-48 animate-pulse" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-zinc-900 rounded-lg p-4">
                <div className="h-20 bg-zinc-800 rounded w-full animate-pulse" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-zinc-700 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyHistoryState() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md">
        <div className="w-24 h-24 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <History className="w-12 h-12 text-zinc-600" />
        </div>
        <h3 className="text-3xl font-bold text-white mb-4">Belum Ada Riwayat</h3>
        <p className="text-zinc-400 text-lg leading-relaxed mb-8">
          Drama yang Anda tonton akan ditampilkan di sini. Mulai menonton sekarang dan nikmati momen favorit Anda!
        </p>
        <p className="text-zinc-500 text-sm mb-6">
          Mulai dari drama yang Anda tonton akan tersimpan secara otomatis dan dapat Anda lanjutkan kapan saja.
        </p>
        <Link href="/">
          <Button className="bg-rose-600 hover:bg-rose-700 text-white">
            <PlayCircle className="w-5 h-5 mr-2" />
            Mulai Menonton
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [filterGenre, setFilterGenre] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const { user } = useAuth();

  // Filter options
  const filterOptions: FilterOptions[] = [
    { value: 'all', label: 'Semua Drama', count: 0 },
    { value: 'completed', label: 'Selesai Ditonton', count: 0 },
    { value: 'inprogress', label: 'Sedang Ditonton', count: 0 },
    { value: 'recent', label: 'Baru Saja Ditonton', count: 0 },
  ];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'users', user.uid, 'history'),
        orderBy(sortBy, 'desc')
      ),
      (snapshot) => {
        const items: HistoryItem[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as HistoryItem;
          if (data) {
            items.push({
              id: doc.id,
              ...data
            });
          }
        });
        
        setHistoryItems(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching history:', err);
        setError('Gagal memuat riwayat menonton');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, sortBy]);

  // Filter items
  const filteredItems = useMemo(() => {
    let filtered = historyItems;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bookId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply genre filter
    if (filterGenre !== 'all') {
      filtered = filtered.filter(item => {
        if (filterGenre === 'completed') return item.progress >= 95;
        if (filterGenre === 'inprogress') return item.progress > 0 && item.progress < 95;
        if (filterGenre === 'recent') return true;
        return false;
      });
    }

    return filtered;
  }, [historyItems, searchTerm, filterGenre]);

  const handleSelect = (bookId: string) => {
    setSelectedItems(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(filteredItems.map(item => item.bookId));
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      const { user } = await import('@/context/AuthContext').then(mod => mod.useAuth());
      if (!user) return;

      const batch = selectedItems.map(bookId => 
        deleteDoc(doc(db, 'users', user.uid, 'history', bookId))
      );

      await Promise.all(batch);
      
      setHistoryItems(prev => prev.filter(item => !selectedItems.includes(item.bookId)));
      setSelectedItems([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error('Failed to bulk delete:', error);
    }
  };

  const handleDelete = (deletedBookId: string) => {
    setHistoryItems(prev => prev.filter(item => item.bookId !== deletedBookId));
  };

  if (loading) {
    return <HistorySkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <History className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Error</h3>
          <p className="text-zinc-400 text-lg mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-rose-600 hover:bg-rose-700 text-white">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Riwayat Menonton
            </h1>
            <p className="text-zinc-400 text-lg">
              Kelola dan lanjutkan menonton drama favorit Anda
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-white">
              Kembali
            </Button>
          </Link>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 text-zinc-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Cari drama atau episode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-rose-600 focus:ring-rose-600/20"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt">Terbaru Ditonton</SelectItem>
              <SelectItem value="progress">Progres Terbanyak</SelectItem>
              <SelectItem value="title">Judul A-Z</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter */}
          <Select value={filterGenre} onValueChange={setFilterGenre}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                  <Badge variant="secondary" className="ml-2">
                    {option.count}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeselectAll}
                className="border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4" />
                Hapus ({selectedItems.length})
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 lg:px-6 mb-4">
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 flex items-center justify-between">
            <span className="text-zinc-300">
              {selectedItems.length} item dipilih
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeselectAll}
                className="border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-white"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Hapus Semua
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {filteredItems.length === 0 ? (
        <EmptyHistoryState />
      ) : (
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.bookId}
                className={`relative ${
                  selectedItems.includes(item.bookId) ? 'ring-2 ring-rose-600 ring-offset-2 ring-offset-zinc-900' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.bookId)}
                  onChange={() => handleSelect(item.bookId)}
                  className="absolute top-4 left-4 w-5 h-5 text-rose-600 bg-white border-2 border-zinc-300 rounded focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
                />
                <HistoryCard
                  item={item}
                  onDelete={handleDelete}
                  onSelect={handleSelect}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}