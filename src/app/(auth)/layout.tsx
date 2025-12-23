'use client';

import { ReactNode } from 'react';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/20 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl" />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}