'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Database } from 'lucide-react';

interface SyncButtonProps {
  className?: string;
}

export const SyncContentButton: React.FC<SyncButtonProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });

  const handleSync = async () => {
    setIsLoading(true);
    setMessage({ type: null, text: '' });

    try {
      const response = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: `✅ ${result.message} (${result.data?.trendingCount || 0} trending, ${result.data?.latestCount || 0} latest)`
        });
      } else {
        setMessage({
          type: 'error',
          text: `❌ ${result.message}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: '❌ Failed to sync content. Please try again.'
      });
    } finally {
      setIsLoading(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage({ type: null, text: '' });
      }, 5000);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        onClick={handleSync}
        disabled={isLoading}
        className={`
          w-full h-16 flex items-center justify-center gap-3 px-4
          bg-rose-500 hover:bg-rose-600 
          disabled:bg-zinc-600 text-white rounded-lg font-medium transition-colors
          focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-background
          ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <div className="text-left">
              <div className="font-medium">Syncing...</div>
              <div className="text-xs opacity-70">Updating content cache</div>
            </div>
          </>
        ) : (
          <>
            <Database className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Sync Content</div>
              <div className="text-xs opacity-70">Update drama cache from source</div>
            </div>
          </>
        )}
      </button>

      {message.text && (
        <div className={`
          flex items-center gap-2 text-sm px-3 py-2 rounded-lg
          ${message.type === 'success' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }
        `}>
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
};