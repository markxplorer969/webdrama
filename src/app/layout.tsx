import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from '@/components/dramaflex/Sidebar'
import BottomNav from '@/components/dramaflex/BottomNav'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dramaflex Indonesia - Platform Streaming Short Drama",
  description: "Streaming drama Indonesia terbaik dengan kualitas HD. Tonton ribuan short drama menarik kapan saja dan di mana saja.",
  keywords: ["Dramaflex", "Indonesia", "drama", "streaming", "short drama", "video"],
  authors: [{ name: "Dramaflex Team" }],
  openGraph: {
    title: "Dramaflex Indonesia - Platform Streaming Short Drama",
    description: "Streaming drama Indonesia terbaik dengan kualitas HD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dramaflex Indonesia",
    description: "Platform Streaming Short Drama",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans bg-background text-text-primary`}>
        {/* Sidebar only visible on Desktop (>= 768px) */}
        <div className="hidden md:block fixed left-0 top-0 h-full z-50">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        {/* Mobile: Full width. Desktop: Placed next to sidebar (ml-60) */}
        <main className="w-full md:ml-60 min-h-screen pb-20 md:pb-0">
          {children}
        </main>

        {/* BottomNav only visible on Mobile (< 768px) */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
