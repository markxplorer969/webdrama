'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { 
  Coins, 
  Crown, 
  Star, 
  Check, 
  TrendingUp, 
  Shield, 
  Zap, 
  Play, 
  VolumeX, 
  HelpCircle,
  Loader2,
  Gift,
  Diamond,
  Trophy,
  Sparkles
} from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';
// import TestPaymentModal from '@/components/TestPaymentModal';

// Data Constants
const COIN_PACKAGES = [
  {
    id: 'coin_100',
    amount: 100,
    price: 10000,
    label: 'Paket Irit',
    description: 'Cukup buat 3-4 episode.',
    isPopular: false,
  },
  {
    id: 'coin_500',
    amount: 500,
    price: 45000,
    label: 'Paling Laris',
    description: 'Puas nonton seharian.',
    isPopular: true,
    bonus: 'HEMAT 10%'
  },
  {
    id: 'coin_1500',
    amount: 1500,
    price: 120000,
    label: 'Sultan Mode',
    description: 'Stok koin melimpah ruah.',
    isPopular: false,
    bonus: 'HEMAT 20%'
  }
];

const VIP_PACKAGES = [
  {
    id: 'vip_30',
    name: 'VIP Monthly',
    duration: '30 Hari',
    price: 50000,
    benefits: ['Unlock Semua Episode', 'Tanpa Iklan', 'Resolusi HD 1080p', 'Support Prioritas'],
    theme: 'border-zinc-700'
  },
  {
    id: 'vip_365',
    name: 'VIP Yearly',
    duration: '1 Tahun',
    price: 450000,
    benefits: ['Unlock Semua Episode', 'Tanpa Iklan', 'Resolusi 4K', 'Badge Profil Emas', 'Hemat 2 Bulan'],
    theme: 'border-yellow-500 bg-yellow-950/10',
    isBestValue: true
  }
];

const FAQ_ITEMS = [
  {
    question: 'Koin hangus?',
    answer: 'Tidak, koin berlaku selamanya dan tidak akan kadaluarsa.'
  },
  {
    question: 'Metode Pembayaran?',
    answer: 'QRIS, E-Wallet (OVO, GoPay, Dana), Virtual Account (BCA, BNI, BRI, Mandiri), dan Kartu Kredit/Debit.'
  },
  {
    question: 'Apakah VIP bisa dibatalkan?',
    answer: 'Ya, Anda bisa batalkan membership VIP kapan saja. Refund akan diproses sesuai kebijakan kami.'
  },
  {
    question: 'Bedanya Koin vs VIP?',
    answer: 'Koin digunakan untuk membuka episode per episode, sedangkan VIP memberikan akses unlimited ke semua episode tanpa iklan.'
  }
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState('coins');
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Payment Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  // Fix hydration mismatch by ensuring client-side only
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Format currency - client side only
  const formatCurrency = (amount: number) => {
    if (!isClient) return `Rp ${amount.toLocaleString('id-ID')}`;
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle purchase - open payment modal
  const handlePurchase = (item: any, type: 'coins' | 'vip') => {
    // Mock user check - in real app, check actual auth state
    const isLoggedIn = true; // Mock check
    
    if (!isLoggedIn) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }

    // Set payment modal data
    setSelectedAmount(item.price || item.amount);
    setSelectedPackage(type === 'coins' ? `${item.amount} Koin - ${item.label}` : `${item.name} - ${item.duration}`);
    
    // Open payment modal
    setIsPaymentModalOpen(true);
  };

  // Close payment modal
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedAmount(0);
    setSelectedPackage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 blur-3xl opacity-50 rounded-full"></div>
              <div className="relative bg-gradient-to-r from-rose-600 to-orange-600 p-4 rounded-full">
                <Crown className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Top Up & <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Membership</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Nikmati drama tanpa batas dengan paket terbaik.
          </p>
          
          <div className="flex justify-center gap-4 mt-8">
            <Link href="/">
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                Kembali ke Beranda
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white">
                Dashboard Saya
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs Switcher */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-zinc-900 border border-zinc-800 p-1">
            <TabsTrigger 
              value="coins" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-orange-600 data-[state=active]:text-white text-zinc-400 transition-all"
            >
              <Coins className="w-4 h-4 mr-2" />
              Isi Koin
            </TabsTrigger>
            <TabsTrigger 
              value="vip" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-yellow-500 data-[state=active]:text-white text-zinc-400 transition-all"
            >
              <Crown className="w-4 h-4 mr-2" />
              Jadi VIP 👑
            </TabsTrigger>
          </TabsList>

          {/* Tab Content: Coins */}
          <TabsContent value="coins" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COIN_PACKAGES.map((pkg) => (
                <Card 
                  key={pkg.id}
                  className={`relative bg-zinc-900/90 border-2 ${
                    pkg.isPopular 
                      ? 'border-amber-500 shadow-2xl shadow-amber-500/20' 
                      : 'border-zinc-800 hover:border-rose-600/50'
                  } transition-all duration-300 hover:scale-105 group`}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 text-sm font-bold shadow-lg">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        TERLARIS
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        pkg.isPopular 
                          ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
                          : 'bg-gradient-to-br from-rose-500 to-orange-500'
                      }`}>
                        <Coins className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <CardTitle className="text-2xl font-bold text-white mb-2">
                      {pkg.label}
                    </CardTitle>
                    
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-4xl font-bold text-white">
                        {pkg.amount.toLocaleString()}
                      </span>
                      <Coins className="w-6 h-6 text-yellow-400" />
                    </div>
                    
                    <CardDescription className="text-zinc-400 mb-4">
                      {pkg.description}
                    </CardDescription>
                    
                    {pkg.bonus && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {pkg.bonus}
                      </Badge>
                    )}
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <div className="text-3xl font-bold text-white mb-2">
                        {formatCurrency(pkg.price)}
                      </div>
                      <p className="text-sm text-zinc-500">
                        Harga terbaik
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => handlePurchase(pkg, 'coins')}
                      className={`w-full py-3 text-lg font-semibold transition-all ${
                        pkg.isPopular
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg'
                          : 'bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white'
                      }`}
                    >
                      <>
                        <Gift className="w-4 h-4 mr-2" />
                        Beli Sekarang
                      </>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Content: VIP */}
          <TabsContent value="vip" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {VIP_PACKAGES.map((vip) => (
                <Card 
                  key={vip.id}
                  className={`relative bg-zinc-900/90 border-2 ${
                    vip.isBestValue 
                      ? 'border-yellow-500 shadow-2xl shadow-yellow-500/20' 
                      : vip.theme
                  } transition-all duration-300 hover:scale-105 group`}
                >
                  {vip.isBestValue && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white px-4 py-1 text-sm font-bold shadow-lg">
                        <Trophy className="w-3 h-3 mr-1" />
                        BEST VALUE
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        vip.isBestValue 
                          ? 'bg-gradient-to-br from-yellow-500 to-yellow-400' 
                          : 'bg-gradient-to-br from-zinc-600 to-zinc-700'
                      }`}>
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <CardTitle className="text-2xl font-bold text-white mb-2">
                      {vip.name}
                    </CardTitle>
                    
                    <div className="text-lg text-zinc-400 mb-4">
                      {vip.duration}
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-3xl font-bold text-white mb-2">
                        {formatCurrency(vip.price)}
                      </div>
                      <p className="text-sm text-zinc-500">
                        {vip.isBestValue ? 'Hemat 2 bulan' : 'Per bulan'}
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    <div className="space-y-3 mb-6">
                      {vip.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center justify-start gap-3 text-zinc-300">
                          <Check className={`w-5 h-5 flex-shrink-0 ${
                            vip.isBestValue ? 'text-yellow-400' : 'text-green-400'
                          }`} />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => handlePurchase(vip, 'vip')}
                      className={`w-full py-3 text-lg font-semibold transition-all ${
                        vip.isBestValue
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-white shadow-lg'
                          : 'bg-gradient-to-r from-zinc-600 to-zinc-700 hover:from-zinc-700 hover:to-zinc-800 text-white'
                      }`}
                    >
                      <>
                        <Diamond className="w-4 h-4 mr-2" />
                        Aktifkan Sekarang
                      </>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <HelpCircle className="w-8 h-8 text-rose-500" />
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-zinc-400 text-lg">
              Temukan jawaban untuk pertanyaan umum tentang layanan kami
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg"
              >
                <AccordionTrigger className="text-left text-white hover:text-rose-400 transition-colors px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-rose-400 font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-lg font-medium">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="pl-11 text-zinc-300 leading-relaxed">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-br from-rose-900/50 to-orange-900/50 border-rose-700/30 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-rose-600 to-orange-600 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Siap untuk Mulai Menonton?
              </h2>
              
              <p className="text-zinc-300 text-lg mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan pengguna yang sudah menikmati drama berkualitas tanpa batas.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Link href="/">
                  <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                    Coba Gratis
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white">
                    Mulai Sekarang
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        selectedAmount={selectedAmount}
        selectedPackage={selectedPackage}
      />
      {/* <TestPaymentModal /> */}
    </div>
  );
}