'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      // Navigate to search page with query parameter
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search for dramas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-slate-800 border-slate-700 text-white placeholder-slate-400 pr-12"
          minLength={2}
          required
        />
        <Button
          type="submit"
          disabled={query.trim(). length < 2}
          className="absolute right-1 top-1 h-10 bg-violet-600 hover:bg-violet-700"
        >
          <Search className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}