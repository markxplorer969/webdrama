'use client';

import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Globe, Zap, Shield, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with Bento Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
          
          {/* Hero Card - Spans 2 columns on desktop */}
          <Card className="md:col-span-2 row-span-2 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Welcome to Dramaflex
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Experience the next generation of streaming with our powerful platform. 
                Connect with communities, access premium content, and enjoy seamless streaming.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm bg-primary/10 px-3 py-1 rounded-full">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Lightning Fast</span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-secondary px-3 py-1 rounded-full">
                  <Shield className="h-4 w-4" />
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-accent px-3 py-1 rounded-full">
                  <Globe className="h-4 w-4" />
                  <span>Global Access</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Users Stat Card */}
          <Card className="hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-primary" />
                <span className="text-xs text-muted-foreground">Live Now</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">12,847</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Activity className="h-3 w-3" />
                  <span>+12% from last week</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Guilds Card */}
          <Card className="hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-primary" />
                <span className="text-xs text-muted-foreground">Featured</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="font-semibold">Community Guilds</h3>
                <p className="text-sm text-muted-foreground">
                  Join vibrant communities, share experiences, and connect with like-minded enthusiasts.
                </p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                    +5
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streaming API Card */}
          <Card className="hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Zap className="h-8 w-8 text-primary" />
                <span className="text-xs text-muted-foreground">Developer</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="font-semibold">Streaming API</h3>
                <p className="text-sm text-muted-foreground">
                  Powerful RESTful API for seamless integration with your applications.
                </p>
                <div className="flex gap-2">
                  <span className="text-xs bg-secondary px-2 py-1 rounded">REST</span>
                  <span className="text-xs bg-secondary px-2 py-1 rounded">WebSocket</span>
                  <span className="text-xs bg-secondary px-2 py-1 rounded">Real-time</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Card */}
          <Card className="hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <BarChart3 className="h-8 w-8 text-primary" />
                <span className="text-xs text-muted-foreground">Analytics</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="font-semibold">Performance Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <span className="text-green-600 font-medium">99.9%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Latency</span>
                    <span className="font-medium">24ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Bandwidth</span>
                    <span className="font-medium">1.2TB/s</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}