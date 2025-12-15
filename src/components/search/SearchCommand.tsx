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
  const [inputValue, setInputValue] = useState('');

  // Auto-focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setInputValue('');
    }
  }, [open]);

  // Handle Enter key for immediate redirect
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission
      onOpenChange(false); // Close modal
      if (inputValue.trim()) {
        router.push(`/search?q=${encodeURIComponent(inputValue)}`);
      }
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
      
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">Search Dramas</DialogTitle>
          <DialogDescription className="text-sm text-zinc-300">
            Type a drama title and press Enter to search
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type title and press Enter..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-zinc-900/80 border-zinc-700 border-white/20 rounded-lg text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-rose-500 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            />
            <Button
              size="sm"
              className="bg-rose-500 hover:bg-rose-600"
              onClick={() => {
                if (inputValue.trim()) {
                  onOpenChange(false);
                  router.push(`/search?q=${encodeURIComponent(inputValue)}`);
                }
              }}
              disabled={!inputValue.trim()}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Instructions */}
          <div className="text-center py-8">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-zinc-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Quick Search</h3>
                <p className="text-zinc-400 text-sm">
                  Type the name of a drama, movie, or series and press Enter
                </p>
                <p className="text-zinc-500 text-xs">
                  You'll be redirected to the search results page immediately
                </p>
              </div>
              
              {/* Popular Search Suggestions */}
              <div className="mt-6">
                <p className="text-zinc-500 text-xs mb-3">Popular searches:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Istriku', 'Mistress', 'Love', 'Drama'].map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      className="text-xs bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      onClick={() => {
                        onOpenChange(false);
                        router.push(`/search?q=${encodeURIComponent(term)}`);
                      }}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};