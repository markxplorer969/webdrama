import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Dramaflex - Streaming Platform",
  description: "Modern streaming platform with community features and powerful API.",
  keywords: ["Dramaflex", "Streaming", "Community", "API", "Next.js", "TypeScript"],
  authors: [{ name: "Dramaflex Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Dramaflex",
    description: "Modern streaming platform with community features",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dramaflex",
    description: "Modern streaming platform with community features",
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
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
