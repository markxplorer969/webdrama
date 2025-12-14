'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { RedeemModal } from '@/components/wallet/RedeemModal';
import { 
  Menu, 
  Search, 
  Wallet, 
  User, 
  LogOut,
  LogIn,
  X
} from 'lucide-react';
import { formatNumber } from '@/lib/currency';

export const SearchCommand: React.FC<SearchCommandProps> = ({ open, onOpenChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, onOpenChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      // Trigger search here if needed
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-zinc-400 hover:text-white relative"
        >
          <Search className="w-4 h-4" />
          <span className="text-zinc-400">Search Dramas</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">Search Dramas</DialogTitle>
          <DialogDescription className="text-sm text-zinc-300">
            Search for your favorite dramas, series, and movies
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search drama, movies, series..."
            onKeyDown={handleKeyDown}
            className="bg-zinc-900/80 border-zinc-700 border-white/20 rounded-lg text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-rose-500 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          />
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button>
            <Button
              size="sm"
              className="bg-rose-500 hover:bg-rose-600"
              >
                <Search
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};