'use client';

import React, { useState } from 'react';
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
import { LogIn, LogOut, User, Wallet, Crown } from 'lucide-react';
import { formatNumber } from '@/lib/currency';

export const Navbar: React.FC = () => {
  const { user, userData, loading, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Dramaflex</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Left side - Brand */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Dramaflex</h1>
          </div>

          {/* Right side - Auth */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <Button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            ) : (
              <>
                {/* Credits Display with RedeemModal */}
                <RedeemModal>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 h-9 px-4"
                  >
                    <Wallet className="h-4 w-4" />
                    <span className="font-medium">
                      {formatNumber(userData?.credits || 0)} Credits
                    </span>
                    <span className="text-xs text-muted-foreground">+</span>
                  </Button>
                </RedeemModal>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage 
                          src={user.photoURL || undefined} 
                          alt={user.displayName || 'User'} 
                        />
                        <AvatarFallback>
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
                        <p className="text-xs leading-none text-muted-foreground">
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
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        open={isAuthModalOpen} 
        onOpenChange={setIsAuthModalOpen}
      />
    </>
  );
};