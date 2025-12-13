import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dramaflex - Streaming Platform",
  description: "Next generation streaming platform with community features",
  keywords: ["streaming", "drama", "community", "platform"],
  authors: [{ name: "Dramaflex Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Dramaflex",
    description: "Next generation streaming platform",
    url: "https://dramaflex.com",
    siteName: "Dramaflex",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dramaflex",
    description: "Next generation streaming platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
