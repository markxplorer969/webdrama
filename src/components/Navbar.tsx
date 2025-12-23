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
import { SearchCommand } from '@/components/search/SearchCommand';
import { siteConfig, navigation } from '@/config/site';
import { 
  Search, 
  Menu, 
  Wallet, 
  User, 
  Crown,
  LogOut,
  LogIn,
  X,
  Settings
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
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-full shadow-lg">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-6 w-24 bg-zinc-800/50" />
              <Skeleton className="h-6 w-24 bg-zinc-800/50" />
            </div>
            <Skeleton className="h-6 w-24 bg-zinc-800/50" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Floating Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-full shadow-lg">
          <div className="flex items-center justify-between px-6 py-3">
            
            {/* Left - Brand */}
            <Link href={navigation.home} className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tighter">
                <span className="text-white">Drama</span>
                <span className="text-rose-500">Flex</span>
              </h1>
            </Link>

            {/* Center - Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href={navigation.home} 
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link 
                href={navigation.trending} 
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Trending
              </Link>
              <Link 
                href={navigation.series} 
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Series
              </Link>
              <Link 
                href={navigation.search} 
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Search
              </Link>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center space-x-3">
              
              {/* Search Button */}
              <SearchCommand 
                open={isSearchOpen} 
                onOpenChange={setIsSearchOpen}
              />

              {/* Credits Display */}
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRedeemModalOpen(true)}
                  className="flex items-center space-x-2 text-amber-400 hover:text-amber-300 hover:bg-zinc-800/50 transition-colors"
                >
                  <Wallet className="h-4 w-4" />
                  <span className="font-medium">{formatNumber(userData?.credits || 0)}</span>
                </Button>
              )}

              {/* User Profile */}
              {!user ? (
                <Link 
                  href="/signin"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors px-4 py-2 rounded-full flex items-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative h-9 w-9 rounded-full hover:bg-zinc-800/50 transition-colors"
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
                  <DropdownMenuContent className="w-56 bg-zinc-900/95 backdrop-blur-md border border-zinc-800" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal text-zinc-100">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">
                          {userData?.displayName || user.displayName || 'User'}
                        </p>
                        <p className="text-xs leading-none text-zinc-400">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* User Info Items */}
                    <DropdownMenuItem className="flex items-center justify-between text-zinc-300 focus:text-white focus:bg-zinc-800" disabled>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Role</span>
                      </div>
                      <span className="text-sm font-medium capitalize text-zinc-400">
                        {userData?.role || 'user'}
                      </span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="flex items-center justify-between text-zinc-300 focus:text-white focus:bg-zinc-800" disabled>
                      <div className="flex items-center space-x-2">
                        <Wallet className="h-4 w-4" />
                        <span>Credits</span>
                      </div>
                      <span className="text-sm font-medium text-amber-400">
                        {formatNumber(userData?.credits || 0)}
                      </span>
                    </DropdownMenuItem>
                    
                    {userData?.isVip && (
                      <DropdownMenuItem className="flex items-center justify-between text-zinc-300 focus:text-white focus:bg-zinc-800" disabled>
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
                    
                    {/* Dashboard Link */}
                    <DropdownMenuItem 
                      className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer"
                      asChild
                    >
                      <Link href="/dashboard" className="w-full flex items-center space-x-2">
                        <Wallet className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    {/* Admin Panel Link - Only for admins */}
                    {(userData?.role === 'admin' || userData?.role === 'superadmin') && (
                      <DropdownMenuItem 
                        className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer"
                        asChild
                      >
                        <Link href="/admin" className="w-full flex items-center space-x-2">
                          <Settings className="h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    {/* Sign Out */}
                    <DropdownMenuItem 
                      className="text-red-400 focus:text-red-300 focus:bg-zinc-800 cursor-pointer"
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
                className="md:hidden text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
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
          <div className="fixed right-0 top-0 h-full w-64 bg-zinc-950/95 backdrop-blur-md border-l border-zinc-800">
            <div className="flex flex-col h-full p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Link 
                  href={navigation.home} 
                  className="flex items-center space-x-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors p-3 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Home</span>
                </Link>
                <Link 
                  href={navigation.trending} 
                  className="flex items-center space-x-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors p-3 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Trending</span>
                </Link>
                <Link 
                  href={navigation.series} 
                  className="flex items-center space-x-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors p-3 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Series</span>
                </Link>
                <Link 
                  href={navigation.search} 
                  className="flex items-center space-x-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors p-3 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Search</span>
                </Link>
                
                {/* Dashboard Link for Mobile */}
                {user && (
                  <Link 
                    href="/dashboard" 
                    className="flex items-center space-x-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors p-3 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Wallet className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                
                {/* Admin Panel Link for Mobile - Only for admins */}
                {user && (userData?.role === 'admin' || userData?.role === 'superadmin') && (
                  <Link 
                    href="/admin" 
                    className="flex items-center space-x-3 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors p-3 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
              </div>
              
              {!user && (
                <Link 
                  href="/signin"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors px-4 py-3 rounded-lg flex items-center justify-center space-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
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
    </>
  );
};