'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import RedeemTabContent from '@/components/dashboard/RedeemTabContent';
import { toast } from '@/hooks/use-toast';
import { 
  Wallet, 
  Crown, 
  Calendar, 
  User, 
  Mail, 
  Lock, 
  LogOut, 
  Settings,
  History
} from 'lucide-react';

interface UserData {
  uid: string;
  displayName: string;
  email: string;
  credits: number;
  isVip: boolean;
  photoURL?: string;
  createdAt?: any;
  referralCode?: string;
  redeemedReferrals?: string[];
  redeemedVouchers?: string[];
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Real-time user data fetching
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as UserData;
        setUserData(data);
        setDisplayName(data.displayName || '');
        setLoading(false);
      } else {
        setLoading(false);
      }
    }, (error) => {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pengguna",
        variant: "destructive"
      });
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Handle profile update
  const handleSaveProfile = async () => {
    if (!user || !userData) return;

    setIsSaving(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: displayName
      });

      // Update Firestore document
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: displayName,
        updatedAt: new Date()
      });

      toast({
        title: "Berhasil!",
        description: "Profil berhasil diperbarui"
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui profil",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password reset
  const handleChangePassword = () => {
    // In real implementation, send password reset email
    toast({
      title: "Info",
      description: "Link reset password telah dikirim ke email Anda"
    });
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Berhasil",
        description: "Anda telah keluar"
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Calculate days active
  const getDaysActive = (createdAt: any) => {
    if (!createdAt) return 0;
    
    const created = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header Skeleton */}
          <Card className="mb-8 bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full bg-zinc-800" />
                  <div>
                    <Skeleton className="h-8 w-48 bg-zinc-800 mb-2" />
                    <Skeleton className="h-4 w-64 bg-zinc-800" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <Skeleton className="h-20 w-24 bg-zinc-800" />
                  <Skeleton className="h-20 w-24 bg-zinc-800" />
                  <Skeleton className="h-20 w-24 bg-zinc-800" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs Skeleton */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-12 bg-zinc-800" />
              <Skeleton className="h-12 bg-zinc-800" />
              <Skeleton className="h-12 bg-zinc-800" />
            </div>
            <Skeleton className="h-96 bg-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  // No user data state
  if (!userData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Data Tidak Ditemukan</h2>
          <p className="text-zinc-400">Tidak dapat memuat data pengguna. Silakan refresh halaman.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header - Wallet View */}
        <Card className="mb-8 bg-gradient-to-r from-rose-900/50 to-zinc-900/50 border-rose-800/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-rose-600">
                  <AvatarImage src={userData.photoURL} />
                  <AvatarFallback className="bg-rose-600 text-white text-xl font-bold">
                    {getInitials(userData.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {userData.displayName}
                  </h1>
                  <p className="text-zinc-400">{userData.email}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6">
                {/* Saldo */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Wallet className="h-5 w-5 text-rose-400" />
                    <span className="text-sm text-zinc-400">Saldo</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {userData.credits.toLocaleString()} CR
                  </div>
                  <Link href="/pricing">
                    <Button 
                      size="sm" 
                      className="bg-rose-600 hover:bg-rose-700 text-white w-full"
                    >
                      Isi Saldo
                    </Button>
                  </Link>
                </div>

                {/* Status VIP */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm text-zinc-400">Status VIP</span>
                  </div>
                  <Badge 
                    className={`mb-2 ${
                      userData.isVip 
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white border-yellow-400' 
                        : 'bg-zinc-700 text-zinc-300 border-zinc-600'
                    }`}
                  >
                    {userData.isVip ? 'GOLD' : 'FREE'}
                  </Badge>
                  <p className="text-xs text-zinc-500">
                    {userData.isVip ? 'Unlimited Access' : 'Limited Access'}
                  </p>
                </div>

                {/* Member Since */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-zinc-400" />
                    <span className="text-sm text-zinc-400">Member Since</span>
                  </div>
                  <div className="text-lg font-semibold text-white mb-2">
                    {formatDate(userData.createdAt)}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {getDaysActive(userData.createdAt)} hari aktif
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-zinc-900 border-zinc-800">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-rose-600 data-[state=active]:text-white text-zinc-400"
            >
              <Settings className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger 
              value="referral" 
              className="data-[state=active]:bg-rose-600 data-[state=active]:text-white text-zinc-400"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Dompet & Referral
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:bg-rose-600 data-[state=active]:text-white text-zinc-400"
            >
              <History className="h-4 w-4 mr-2" />
              Riwayat
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-zinc-900/90 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Pengaturan Profil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Edit Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-zinc-300">Nama Lengkap</Label>
                  <div className="flex gap-3">
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-rose-600"
                    />
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="bg-rose-600 hover:bg-rose-700"
                    >
                      {isSaving ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-300">Email</Label>
                  <Input
                    id="email"
                    value={userData.email}
                    disabled
                    className="bg-zinc-800/50 border-zinc-700 text-zinc-400"
                  />
                  <p className="text-xs text-zinc-500">Email tidak dapat diubah</p>
                </div>

                {/* Change Password */}
                <div className="space-y-2">
                  <Label className="text-zinc-300">Password</Label>
                  <Button 
                    variant="outline" 
                    onClick={handleChangePassword}
                    className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Ubah Password
                  </Button>
                </div>

                {/* Logout Button */}
                <div className="pt-4 border-t border-zinc-800">
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Keluar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Dompet & Referral */}
          <TabsContent value="referral" className="space-y-6">
            <RedeemTabContent />
          </TabsContent>

          {/* Tab 3: Riwayat (Placeholder) */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-zinc-900/90 border-zinc-800">
              <CardContent className="p-12 text-center">
                <History className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Riwayat Transaksi</h3>
                <p className="text-zinc-400 max-w-md mx-auto">
                  Riwayat transaksi Anda akan ditampilkan di sini. Mulai menonton dan melakukan redeem untuk melihat aktivitas Anda.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}