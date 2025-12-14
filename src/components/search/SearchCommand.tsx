'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Film, Play } from 'lucide-react';

interface SearchResult {
  title: string;
  book_id: string;
  image: string;
  episodes: string;
  views: string;
}

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Debounce hook
function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  }, [func, delay]);
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Debounced search function
  const debouncedSearch = useDebounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/drama/search?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data.slice(0, 8)); // Limit to 8 results
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);
    setSelectedIndex(0);
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      // Redirect to search results page
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        onOpenChange(false);
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      onOpenChange(false);
      setQuery('');
    }
  }, [results, selectedIndex, onOpenChange, query, router]);

  // Reset search when modal opens/closes
  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden bg-zinc-950 border-zinc-800 max-w-2xl">
        <DialogHeader className="px-4 pt-4 pb-2 border-b border-zinc-800">
          <DialogTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Drama
          </DialogTitle>
        </DialogHeader>
        
        <Command className="rounded-lg border-0 bg-transparent">
          <div className="flex items-center border-b border-zinc-800 px-4 pb-3">
            <Search className="h-4 w-4 text-zinc-400 mr-2" />
            <CommandInput
              placeholder="Search drama... (Press Enter to view all results)"
              value={query}
              onValueChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="text-white placeholder:text-zinc-500 border-0 focus:ring-0 bg-transparent"
              autoFocus
            />
            {isLoading && (
              <Loader2 className="h-4 w-4 text-zinc-400 animate-spin" />
            )}
          </div>
          
          <CommandList className="max-h-96 overflow-y-auto px-2 py-2">
            {isLoading && query.trim() ? (
              <div className="flex items-center justify-center py-8 text-zinc-400">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Searching...
              </div>
            ) : results.length > 0 ? (
              <CommandGroup heading="Search Results">
                {results.map((result, index) => (
                  <CommandItem
                    key={result.book_id}
                    value={result.title}
                    onSelect={() => {
                      // Navigate to watch page when item is selected
                      window.location.href = `/watch/${result.book_id}`;
                      onOpenChange(false);
                      setQuery('');
                    }}
                    className={`px-4 py-3 rounded-md cursor-pointer transition-colors ${
                      index === selectedIndex 
                        ? 'bg-zinc-800 text-white' 
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Small Poster */}
                      <div className="relative w-12 h-16 overflow-hidden rounded flex-shrink-0">
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full bg-zinc-700 flex items-center justify-center">
                                  <Film class="w-6 h-6 text-zinc-500" />
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                      
                      {/* Title and Meta */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white truncate pr-2">
                            {result.title}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {result.episodes} EP
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <span>{result.views} views</span>
                        </div>
                      </div>
                      
                      {/* Play Button */}
                      <div className="flex items-center">
                        <Play className="h-4 w-4 text-rose-500" />
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : query.trim() && !isLoading ? (
              <CommandEmpty className="text-zinc-400 py-8">
                No results found for "{query}"
              </CommandEmpty>
            ) : (
              <CommandEmpty className="text-zinc-400 py-8">
                Start typing to search dramas... (Press Enter to view all results)
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}