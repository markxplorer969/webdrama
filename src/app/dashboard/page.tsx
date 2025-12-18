'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Wallet, 
  Crown, 
  Calendar, 
  User, 
  Mail, 
  Lock, 
  LogOut, 
  Copy, 
  Gift, 
  TrendingUp,
  ArrowRight,
  History,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

// Mock user data
const mockUserData = {
  uid: 'user123',
  displayName: 'Andi Pratama',
  email: 'andi@example.com',
  photoURL: null,
  credits: 450,
  isVip: true,
  memberSince: '15 Januari 2024',
  referralCode: 'ANDI88',
  totalReferrals: 0,
};

// Mock transaction data
const mockTransactions = [
  {
    id: 1,
    date: '2024-01-20',
    description: 'Unlock Episode 5 - The CEO Secret',
    amount: -10,
    status: 'success',
    type: 'deduction'
  },
  {
    id: 2,
    date: '2024-01-18',
    description: 'Top Up via Voucher',
    amount: +100,
    status: 'success',
    type: 'topup'
  },
  {
    id: 3,
    date: '2024-01-15',
    description: 'Unlock Episode 3 - Sweet Revenge',
    amount: -10,
    status: 'success',
    type: 'deduction'
  },
  {
    id: 4,
    date: '2024-01-10',
    description: 'Welcome Bonus',
    amount: +50,
    status: 'success',
    type: 'bonus'
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [displayName, setDisplayName] = useState(mockUserData.displayName);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Mock save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Profil berhasil diperbarui!');
  };

  const handleCopyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(mockUserData.referralCode);
      setCopiedCode(true);
      toast.success('Kode referral disalin!');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      toast.error('Gagal menyalin kode');
    }
  };

  const handleChangePassword = () => {
    // Mock password reset
    toast.success('Link reset password telah dikirim ke email Anda');
  };

  const handleLogout = () => {
    // Mock logout
    toast.success('Anda telah keluar');
    // In real app, redirect to login page
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

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
                  <AvatarImage src={mockUserData.photoURL} />
                  <AvatarFallback className="bg-rose-600 text-white text-xl font-bold">
                    {mockUserData.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {mockUserData.displayName}
                  </h1>
                  <p className="text-zinc-400">{mockUserData.email}</p>
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
                    {mockUserData.credits.toLocaleString()} CR
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
                      mockUserData.isVip 
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white border-yellow-400' 
                        : 'bg-zinc-700 text-zinc-300 border-zinc-600'
                    }`}
                  >
                    {mockUserData.isVip ? 'GOLD' : 'FREE'}
                  </Badge>
                  <p className="text-xs text-zinc-500">
                    {mockUserData.isVip ? 'Unlimited Access' : 'Limited Access'}
                  </p>
                </div>

                {/* Member Since */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-zinc-400" />
                    <span className="text-sm text-zinc-400">Member Since</span>
                  </div>
                  <div className="text-lg font-semibold text-white mb-2">
                    {mockUserData.memberSince}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {Math.floor((new Date().getTime() - new Date('2024-01-15').getTime()) / (1000 * 60 * 60 * 24))} hari aktif
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
              <Gift className="h-4 w-4 mr-2" />
              Referral
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:bg-rose-600 data-[state=active]:text-white text-zinc-400"
            >
              <History className="h-4 w-4 mr-2" />
              Transaksi
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
                    value={mockUserData.email}
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

          {/* Tab 2: Referral Center */}
          <TabsContent value="referral" className="space-y-6">
            {/* Hero Card */}
            <Card className="bg-gradient-to-r from-rose-900 via-rose-800 to-orange-900 border-rose-600/50">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Ajak Teman, Dapat Credits! 💸
                </h2>
                <p className="text-rose-100 mb-6">
                  Bagikan kode referralmu dan dapatkan bonus credits setiap teman yang bergabung
                </p>
              </CardContent>
            </Card>

            {/* Code Display */}
            <Card className="bg-zinc-900/90 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Kode Referral Kamu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-lg p-6 text-center">
                    <code className="text-3xl font-bold text-rose-400 font-mono">
                      {mockUserData.referralCode}
                    </code>
                  </div>
                  <Button
                    onClick={handleCopyReferralCode}
                    className={`${
                      copiedCode 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-rose-600 hover:bg-rose-700'
                    } text-white`}
                  >
                    {copiedCode ? (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Salin
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900/90 border-zinc-800">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-rose-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-6 w-6 text-rose-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {mockUserData.totalReferrals}
                  </h3>
                  <p className="text-zinc-400">Total Teman Diundang</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-rose-900/50 to-orange-900/50 border-rose-700/50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    20 CR + 50 CR
                  </h3>
                  <p className="text-rose-100 text-sm">
                    Teman dapat 20 CR, Kamu dapat 50 CR
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <Card className="bg-zinc-900/90 border-zinc-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-rose-400" />
                  Cara Menggunakan Kode Referral
                </h3>
                <div className="space-y-3 text-zinc-300">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <p>Bagikan kode <span className="font-mono bg-zinc-800 px-2 py-1 rounded text-rose-400">{mockUserData.referralCode}</span> kepada teman-temanmu</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <p>Teman memasukkan kode saat mendaftar</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <p>Teman dapat bonus 20 CR, kamu dapat 50 CR secara otomatis!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Transaction History */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-zinc-900/90 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Riwayat Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-700">
                        <th className="text-left py-3 px-4 text-zinc-400 font-medium">Tanggal</th>
                        <th className="text-left py-3 px-4 text-zinc-400 font-medium">Deskripsi</th>
                        <th className="text-right py-3 px-4 text-zinc-400 font-medium">Jumlah</th>
                        <th className="text-center py-3 px-4 text-zinc-400 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                          <td className="py-4 px-4 text-zinc-300">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="py-4 px-4 text-white">
                            {transaction.description}
                          </td>
                          <td className={`py-4 px-4 text-right font-medium ${
                            transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} CR
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Badge 
                              variant={transaction.status === 'success' ? 'default' : 'destructive'}
                              className={
                                transaction.status === 'success' 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-red-600 text-white'
                              }
                            >
                              {transaction.status === 'success' ? 'Berhasil' : 'Gagal'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}