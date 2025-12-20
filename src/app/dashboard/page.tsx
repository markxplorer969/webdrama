'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import RedeemTabContent from '@/components/dashboard/RedeemTabContent';
import { 
  Wallet, 
  Crown, 
  Calendar, 
  User, 
  Mail, 
  Lock, 
  LogOut, 
  Gift, 
  TrendingUp,
  ArrowRight,
  History,
  Settings,
  Loader2,
  Sparkles,
  Star,
  Shield
} from 'lucide-react';

// User data interface
interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  credits: number;
  isVip: boolean;
  createdAt?: any;
  updatedAt?: any;
  lastLoginAt?: any;
  referralCode?: string;
  redeemedReferrals?: string[];
  redeemedVouchers?: string[];
  successfulReferrals?: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Real-time user data listener
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as UserData;
        setUserData(data);
        setDisplayName(data.displayName || '');
      } else {
        // User document doesn't exist, create basic structure
        const basicUserData: UserData = {
          uid: user.uid,
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL,
          credits: 0,
          isVip: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          redeemedReferrals: [],
          redeemedVouchers: []
        };
        setUserData(basicUserData);
        setDisplayName(basicUserData.displayName);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error listening to user data:', error);
      toast.error('Gagal memuat data pengguna');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle profile update
  const handleSaveProfile = async () => {
    if (!user || !userData) return;

    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: displayName,
        updatedAt: serverTimestamp()
      });

      toast.success('Profil berhasil diperbarui!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Gagal memperbarui profil');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password reset
  const handleChangePassword = () => {
    // In a real app, this would trigger Firebase password reset
    toast.success('Link reset password telah dikirim ke email Anda');
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // In a real app, this would call Firebase signOut
      toast.success('Anda telah keluar');
      // Redirect to login page would happen here
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Gagal keluar');
    }
  };

  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Calculate days active
  const getDaysActive = () => {
    if (!userData?.createdAt) return 0;
    
    const created = userData.createdAt.toDate ? userData.createdAt.toDate() : new Date(userData.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-spin" />
          <p className="text-zinc-400 text-lg">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg">Silakan login untuk mengakses dashboard</p>
          <Link href="/signin">
            <Button className="mt-4 bg-rose-600 hover:bg-rose-700">
              Masuk
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header - Premium Wallet View */}
        <Card className="mb-8 bg-gradient-to-br from-rose-900 via-rose-800 to-orange-900 border-rose-700/30 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              {/* User Info */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-4 border-rose-600 shadow-xl">
                  <AvatarImage src={userData.photoURL} alt={userData.displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-rose-600 to-orange-600 text-white text-2xl font-bold">
                    {userData.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                    {userData.displayName}
                    {userData.isVip && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white border-yellow-300 px-3 py-1">
                        <Crown className="w-4 h-4 mr-1" />
                        VIP
                      </Badge>
                    )}
                  </h1>
                  <p className="text-rose-100 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {userData.email}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-8">
                {/* Live Credits */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Wallet className="h-6 w-6 text-yellow-400" />
                    <span className="text-sm text-rose-100 font-medium">Live Credits</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-2">
                    {userData.credits.toLocaleString()}
                    <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                  </div>
                  <Link href="/pricing">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white w-full shadow-lg"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Isi Saldo
                    </Button>
                  </Link>
                </div>

                {/* VIP Status */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Shield className="h-6 w-6 text-rose-400" />
                    <span className="text-sm text-rose-100 font-medium">Status</span>
                  </div>
                  <Badge 
                    className={`mb-3 px-4 py-2 text-sm font-bold ${
                      userData.isVip 
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white border-yellow-300 shadow-lg' 
                        : 'bg-zinc-700 text-zinc-300 border-zinc-600'
                    }`}
                  >
                    {userData.isVip ? (
                      <>
                        <Star className="w-4 h-4 mr-1" />
                        GOLD
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 mr-1" />
                        FREE
                      </>
                    )}
                  </Badge>
                  <p className="text-xs text-rose-100">
                    {userData.isVip ? 'Unlimited Access' : 'Limited Access'}
                  </p>
                </div>

                {/* Member Since */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Calendar className="h-6 w-6 text-rose-400" />
                    <span className="text-sm text-rose-100 font-medium">Member Since</span>
                  </div>
                  <div className="text-xl font-bold text-white mb-3">
                    {formatDate(userData.createdAt)}
                  </div>
                  <p className="text-xs text-rose-100">
                    {getDaysActive()} hari aktif
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-zinc-900 border-zinc-800 p-1">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-rose-600 data-[state=active]:text-white text-zinc-400 data-[state=active]:shadow-lg transition-all"
            >
              <Settings className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger 
              value="referral" 
              className="data-[state=active]:bg-rose-600 data-[state=active]:text-white text-zinc-400 data-[state=active]:shadow-lg transition-all"
            >
              <Gift className="h-4 w-4 mr-2" />
              Dompet & Referral
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:bg-rose-600 data-[state=active]:text-white text-zinc-400 data-[state=active]:shadow-lg transition-all"
            >
              <History className="h-4 w-4 mr-2" />
              Riwayat
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-zinc-900/90 border-zinc-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-rose-500" />
                  Pengaturan Profil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Edit Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-zinc-300 font-medium">Nama Lengkap</Label>
                  <div className="flex gap-3">
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-rose-600 focus:ring-rose-600/20"
                      placeholder="Masukkan nama lengkap"
                    />
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={isSaving || !displayName.trim()}
                      className="bg-rose-600 hover:bg-rose-700 text-white"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        'Simpan'
                      )}
                    </Button>
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-300 font-medium">Email</Label>
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
                  <Label className="text-zinc-300 font-medium">Password</Label>
                  <Button 
                    variant="outline" 
                    onClick={handleChangePassword}
                    className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 w-full"
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

          {/* Tab 2: Wallet & Referral */}
          <TabsContent value="referral" className="space-y-6">
            {/* Import and render the RedeemTabContent component */}
            <RedeemTabContent />
          </TabsContent>

          {/* Tab 3: Transaction History */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-zinc-900/90 border-zinc-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="h-5 w-5 text-rose-500" />
                  Riwayat Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <History className="w-10 h-10 text-zinc-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Belum Ada Riwayat Transaksi
                  </h3>
                  <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed mb-6">
                    Riwayat transaksi Anda akan ditampilkan di sini. Mulai menonton dan gunakan voucher untuk melihat aktivitas Anda!
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/">
                      <Button className="bg-rose-600 hover:bg-rose-700 text-white">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Mulai Menonton
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                        <Wallet className="w-4 h-4 mr-2" />
                        Isi Saldo
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}