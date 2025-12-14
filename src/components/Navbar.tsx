'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Search, 
  Menu, 
  Wallet, 
  User, 
  Crown,
  LogOut,
  LogIn,
  X
} from 'lucide-react';
import { formatNumber } from '@/lib/currency';

export const Navbar: React.FC = () => {
  const { user, userData, loading, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Floating Navbar */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between px-6 py-3">
            
            {/* Left - Brand */}
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tighter">
                <span className="text-white">Drama</span>
                <span className="text-rose-500">Flex</span>
              </h1>
            </Link>

            {/* Center - Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/trending" 
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Trending
              </Link>
              <Link 
                href="/series" 
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Series
              </Link>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center space-x-3">
              
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-zinc-300 hover:text-white"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Credits Display */}
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRedeemModalOpen(true)}
                  className="flex items-center space-x-2 text-amber-400 hover:text-amber-300"
                >
                  <Wallet className="h-4 w-4" />
                  <span className="font-medium">{formatNumber(userData?.credits || 0)}</span>
                </Button>
              )}

              {/* User Profile */}
              {!user ? (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  variant="default"
                  size="sm"
                  className="bg-rose-500 hover:bg-rose-600"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={user.photoURL || undefined} 
                          alt={user.displayName || 'User'} 
                        />
                        <AvatarFallback className="bg-rose-500 text-white text-sm font-medium">
                          {userData?.displayName 
                            ? getInitials(userData.displayName)
                            : user.email?.[0]?.toUpperCase()
                          }
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {userData?.displayName || user.displayName || 'User'}
                        </p>
                        <p className="text-xs leading-none text-zinc-400">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* User Info Items */}
                    <DropdownMenuItem className="flex items-center justify-between" disabled>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Role</span>
                      </div>
                      <span className="text-sm font-medium capitalize">
                        {userData?.role || 'user'}
                      </span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="flex items-center justify-between" disabled>
                      <div className="flex items-center space-x-2">
                        <Wallet className="h-4 w-4" />
                        <span>Credits</span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatNumber(userData?.credits || 0)}
                      </span>
                    </DropdownMenuItem>
                    
                    {userData?.isVip && (
                      <DropdownMenuItem className="flex items-center justify-between" disabled>
                        <div className="flex items-center space-x-2">
                          <Crown className="h-4 w-4 text-yellow-500" />
                          <span>Status</span>
                        </div>
                        <span className="text-sm font-medium text-yellow-500">
                          VIP
                        </span>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    
                    {/* Sign Out */}
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                      onClick={signOut}
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-zinc-300 hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-64 bg-black/90 backdrop-blur-xl border-l border-white/10">
            <div className="flex flex-col h-full p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="flex items-center space-x-3 text-zinc-300 hover:text-white transition-colors p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Home</span>
                </Link>
                <Link 
                  href="/trending" 
                  className="flex items-center space-x-3 text-zinc-300 hover:text-white transition-colors p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Trending</span>
                </Link>
                <Link 
                  href="/series" 
                  className="flex items-center space-x-3 text-zinc-300 hover:text-white transition-colors p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Series</span>
                </Link>
              </div>
              
              {!user && (
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  variant="default"
                  size="sm"
                  className="w-full bg-rose-500 hover:bg-rose-600"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        open={isAuthModalOpen} 
        onOpenChange={setIsAuthModalOpen}
      />

      {/* Redeem Modal */}
      <RedeemModal 
        open={isRedeemModalOpen}
        onOpenChange={setIsRedeemModalOpen}
      />

      {/* Search Modal/Command - Placeholder for future implementation */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsSearchOpen(false)} />
          <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg p-4 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <Search className="h-5 w-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search dramas..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-zinc-400"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-zinc-400">
              Search functionality coming soon...
            </div>
          </div>
        </div>
      )}
    </>
  );
};