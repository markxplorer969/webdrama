'use client';

import { useState, useEffect } from 'react';
import { 
  doc, 
  collection, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  writeBatch, 
  runTransaction,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Gift, 
  Copy, 
  Check, 
  AlertCircle, 
  Users,
  TrendingUp,
  Code
} from 'lucide-react';

interface VoucherData {
  code: string;
  credits: number;
  currentUses: number;
  maxUses: number;
  redeemedBy: string[];
  type?: 'public' | 'private';
  description?: string;
}

interface UserData {
  uid: string;
  credits: number;
  referralCode?: string;
  redeemedReferrals: string[];
  redeemedVouchers: string[];
  displayName?: string;
}

export default function RedeemTabContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [referralCode, setReferralCode] = useState<string>('');
  const [redeemCode, setRedeemCode] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [copied, setCopied] = useState(false);

  // Generate random referral code
  const generateReferralCode = (displayName?: string): string => {
    const namePart = displayName 
      ? displayName.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '')
      : 'USER';
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `${namePart}${randomPart}`;
  };

  // Load user data and generate referral code if needed
  useEffect(() => {
    if (!user) return;

    const loadUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);

          // Generate referral code if not exists
          if (!data.referralCode) {
            const newReferralCode = generateReferralCode(data.displayName);
            
            await runTransaction(db, async (transaction) => {
              const userRef = doc(db, 'users', user.uid);
              const userDoc = await transaction.get(userRef);
              
              if (userDoc.exists()) {
                transaction.update(userRef, {
                  referralCode: newReferralCode,
                  updatedAt: serverTimestamp()
                });
              }
            });

            setReferralCode(newReferralCode);
          } else {
            setReferralCode(data.referralCode);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data pengguna",
          variant: "destructive"
        });
      }
    };

    loadUserData();
  }, [user]);

  // Copy to clipboard function
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Berhasil!",
        description: "Kode referral disalin ke clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyalin kode",
        variant: "destructive"
      });
    }
  };

  // Redeem code handler
  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!redeemCode.trim()) {
      toast({
        title: "Error",
        description: "Silakan masukkan kode",
        variant: "destructive"
      });
      return;
    }

    if (!user || !userData) {
      toast({
        title: "Error",
        description: "Anda harus login untuk melakukan redeem",
        variant: "destructive"
      });
      return;
    }

    const inputCode = redeemCode.trim().toUpperCase();
    setRedeeming(true);

    try {
      await runTransaction(db, async (transaction) => {
        // Step A: Check if it's a voucher
        const voucherQuery = query(
          collection(db, 'vouchers'), 
          where('code', '==', inputCode)
        );
        const voucherSnapshot = await getDocs(voucherQuery);

        if (!voucherSnapshot.empty) {
          // Found voucher - process voucher redemption
          const voucherDoc = voucherSnapshot.docs[0];
          const voucherData = voucherDoc.data() as VoucherData;
          
          // Check if voucher is still valid
          if (voucherData.currentUses >= voucherData.maxUses) {
            throw new Error('Voucher ini sudah mencapai batas penggunaan');
          }

          if (voucherData.redeemedBy.includes(user.uid)) {
            throw new Error('Anda sudah menggunakan voucher ini');
          }

          // Update voucher
          transaction.update(voucherDoc.ref, {
            currentUses: voucherData.currentUses + 1,
            redeemedBy: [...voucherData.redeemedBy, user.uid],
            lastRedeemedAt: serverTimestamp()
          });

          // Update user
          const userRef = doc(db, 'users', user.uid);
          transaction.update(userRef, {
            credits: userData.credits + voucherData.credits,
            redeemedVouchers: [...(userData.redeemedVouchers || []), inputCode],
            lastRedeemedAt: serverTimestamp()
          });

          return {
            type: 'voucher',
            credits: voucherData.credits,
            message: `Berhasil redeem voucher! +${voucherData.credits} credits`
          };
        }

        // Step B: Check if it's a referral code
        const userQuery = query(
          collection(db, 'users'), 
          where('referralCode', '==', inputCode)
        );
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          // Found referral - process referral redemption
          const referrerDoc = userSnapshot.docs[0];
          const referrerData = referrerDoc.data() as UserData;
          
          // Check if referring to self
          if (referrerData.uid === user.uid) {
            throw new Error('Tidak bisa menggunakan kode referral sendiri');
          }

          // Check if already redeemed this referral
          if (userData.redeemedReferrals?.includes(referrerData.uid)) {
            throw new Error('Anda sudah menggunakan kode referral ini');
          }

          // Referral bonus amounts
          const referrerBonus = 50;
          const referredBonus = 50;

          // Update referrer
          transaction.update(referrerDoc.ref, {
            credits: referrerData.credits + referrerBonus,
            redeemedReferrals: [...(referrerData.redeemedReferrals || []), user.uid],
            successfulReferrals: (referrerData.redeemedReferrals?.length || 0) + 1,
            lastReferralAt: serverTimestamp()
          });

          // Update referred user
          const userRef = doc(db, 'users', user.uid);
          transaction.update(userRef, {
            credits: userData.credits + referredBonus,
            redeemedReferrals: [...(userData.redeemedReferrals || []), referrerData.uid],
            referredBy: referrerData.uid,
            referredByCode: inputCode,
            referredAt: serverTimestamp()
          });

          return {
            type: 'referral',
            credits: referredBonus,
            referrerBonus,
            message: `Berhasil menggunakan kode referral! +${referredBonus} credits`
          };
        }

        // Step C: Neither voucher nor referral found
        throw new Error('Kode tidak valid atau tidak ditemukan');
      });

      // Success
      setRedeemCode('');
      toast({
        title: "Berhasil!",
        description: "Kode berhasil ditukarkan",
      });

      // Reload user data to get updated credits
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }

    } catch (error: any) {
      console.error('Redeem error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal melakukan redeem",
        variant: "destructive"
      });
    } finally {
      setRedeeming(false);
    }
  };

  if (!user || !userData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <p className="text-zinc-400">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* My Referral Code Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Kode Referral Saya
          </CardTitle>
          <CardDescription>
            Bagikan kode ini ke teman dan dapatkan 50 credits untuk setiap referral yang berhasil!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-rose-500" />
                  <span className="font-mono text-xl font-bold text-white">
                    {referralCode}
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                Kode referral unik Anda
              </p>
            </div>
            <Button
              onClick={() => copyToClipboard(referralCode)}
              disabled={copied}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Salin
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {userData.redeemedReferrals?.length || 0}
                </p>
                <p className="text-xs text-zinc-400">Referral Berhasil</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {userData.redeemedVouchers?.length || 0}
                </p>
                <p className="text-xs text-zinc-400">Voucher Di-redeem</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {userData.credits}
                </p>
                <p className="text-xs text-zinc-400">Total Credits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Redeem Code Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Redeem Kode
          </CardTitle>
          <CardDescription>
            Masukkan kode voucher atau kode referral untuk mendapatkan credits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRedeem} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Masukkan kode voucher atau referral"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
                disabled={redeeming}
              />
              <p className="text-xs text-zinc-500 mt-2">
                Kode voucher dan referral memiliki format yang sama
              </p>
            </div>
            
            <Button
              type="submit"
              disabled={redeeming || !redeemCode.trim()}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white"
            >
              {redeeming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Memproses...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4 mr-2" />
                  Klaim
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cara Penggunaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 mt-1">
              1
            </Badge>
            <div>
              <p className="text-sm text-zinc-300">
                <strong>Voucher:</strong> Masukkan kode voucher yang Anda dapatkan dari promo atau event
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 mt-1">
              2
            </Badge>
            <div>
              <p className="text-sm text-zinc-300">
                <strong>Referral:</strong> Gunakan kode referral dari teman untuk mendapatkan 50 credits
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 mt-1">
              3
            </Badge>
            <div>
              <p className="text-sm text-zinc-300">
                <strong>Batas:</strong> Setiap voucher memiliki batas penggunaan, referral hanya sekali per orang
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}