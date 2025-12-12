'use client';

import { useEffect, useState } from 'react';
import { app } from '@/lib/firebase';

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export default function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Firebase app is initialized when this module is imported
    // Just set the initialized state after a short delay to ensure everything is ready
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Initializing Firebase...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}