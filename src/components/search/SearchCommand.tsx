'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Eye, Layers, Loader2, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  title: string;
  book_id: string;
  image: string;
  views: string;
  episodes?: string | number;
}

export const SearchCommand: React.FC<SearchCommandProps> = ({ open, onOpenChange }) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [open]);

  // Format episode count
  const formatEpisodes = (episodes?: string | number) => {
    if (!episodes) return '?';
    if (typeof episodes === 'number') return episodes + ' Ep';
    return episodes + ' Ep';
  };

  // Format views count
  const formatViews = (views: string) => {
    const num = parseFloat(views);
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return views;
  };

  // Search function
  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await fetch('/api/drama/search?q=' + encodeURIComponent(query), {
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSearchResults(data.data);
        } else {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle card click
  const handleCardClick = (bookId: string) => {
    router.push('/drama/' + bookId);
    onOpenChange(false);
  };

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-300 hover:text-white"
        >
          <Search className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">Search Dramas</DialogTitle>
          <DialogDescription className="text-sm text-zinc-300">
            Search for your favorite dramas, series, and movies
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search drama, movies, series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-zinc-900/80 border-zinc-700 border-white/20 rounded-lg text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-rose-500 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            />
            <Button
              size="sm"
              className="bg-rose-500 hover:bg-rose-600"
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Search Results Grid */}
          {hasSearched && (
            <div className="border-t border-zinc-800 pt-4">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                  <span className="text-zinc-400 ml-2">Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                  {searchResults.map((item, index) => (
                    <div
                      key={item.book_id + '-' + index}
                      onClick={() => handleCardClick(item.book_id)}
                      className="group cursor-pointer space-y-2 transition-all duration-200 hover:scale-105"
                    >
                      {/* Drama Card */}
                      <div className="relative overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 hover:border-rose-500/50">
                        {/* Image Container */}
                        <div className="relative aspect-[2/3] w-full overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Play button overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-rose-500/90 backdrop-blur-sm rounded-full p-2">
                              <Film className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-3 space-y-2">
                          {/* Title */}
                          <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-rose-400 transition-colors">
                            {item.title}
                          </h3>

                          {/* Metadata */}
                          <div className="flex items-center justify-between text-xs text-zinc-400">
                            {/* Episodes Badge */}
                            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                              <div className="flex items-center gap-1">
                                <Layers className="h-3 w-3" />
                                <span>{formatEpisodes(item.episodes)}</span>
                              </div>
                            </Badge>

                            {/* Views */}
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                </div>
                              <span>{formatViews(item.views)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="space-y-3">
                    <Search className="h-12 w-12 text-zinc-600 mx-auto" />
                    <h3 className="text-lg font-semibold text-zinc-400">No results found</h3>
                    <p className="text-zinc-500 text-sm">
                      Try different keywords or check your spelling
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search Hint */}
          {!hasSearched && (
            <div className="text-center text-xs text-zinc-500">
              Type a drama title and press Enter or click the search button
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
