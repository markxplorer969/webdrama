import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import FirebaseProvider from "@/components/providers/firebase-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dramaflex - Your Ultimate Drama Streaming Platform",
  description: "Stream the latest Asian dramas with Dramaflex. Discover trending series, binge-watch your favorites, and enjoy personalized recommendations.",
  keywords: ["Dramaflex", "drama streaming", "Asian dramas", "K-drama", "C-drama", "J-drama", "online streaming"],
  authors: [{ name: "Dramaflex Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Dramaflex",
    description: "Your Ultimate Drama Streaming Platform",
    url: "https://dramaflex.com",
    siteName: "Dramaflex",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dramaflex",
    description: "Your Ultimate Drama Streaming Platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <FirebaseProvider>
          {children}
          <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  );
}
