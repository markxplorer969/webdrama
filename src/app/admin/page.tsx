'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Users, 
  Crown, 
  Ticket,
  Plus,
  Settings,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { formatRupiah, formatNumber } from '@/lib/currency';
import { UserData } from '@/context/AuthContext';

interface Voucher {
  id: string;
  code: string;
  credits: number;
  maxUses: number;
  currentUses: number;
  createdAt: any;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { onSnapshot, collection } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');

        // Fetch users
        const usersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
          const usersData: UserData[] = [];
          snapshot.forEach((doc) => {
            usersData.push({
              uid: doc.id,
              ...doc.data()
            } as UserData);
          });
          setUsers(usersData);
        }, (error) => {
          console.error('Error fetching users:', error);
          toast.error('Failed to fetch users data');
        });

        // Fetch vouchers
        const vouchersUnsubscribe = onSnapshot(collection(db, 'vouchers'), (snapshot) => {
          const vouchersData: Voucher[] = [];
          snapshot.forEach((doc) => {
            vouchersData.push({
              id: doc.id,
              ...doc.data()
            } as Voucher);
          });
          setVouchers(vouchersData);
        }, (error) => {
          console.error('Error fetching vouchers:', error);
          toast.error('Failed to fetch vouchers data');
        });

        setLoading(false);

        return () => {
          usersUnsubscribe();
          vouchersUnsubscribe();
        };
      } catch (error) {
        console.error('Error setting up listeners:', error);
        toast.error('Failed to initialize dashboard');
        setLoading(false);
      }
    };

    const cleanup = fetchData();
    return () => {
      cleanup.then(unsub => unsub?.());
    };
  }, []);

  // Calculate metrics
  const totalUsers = users.length;
  const vipUsers = users.filter(u => u.isVip).length;
  const totalRevenue = vipUsers * 10000; // VIP price is IDR 10,000
  const activeVouchers = vouchers.filter(v => v.currentUses < v.maxUses).length;
  const totalCredits = users.reduce((sum, u) => sum + u.credits, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            DramaFlex Admin Panel Overview
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          Live Data
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatRupiah(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {vipUsers} VIP users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalUsers)}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP Users</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(vipUsers)}</div>
            <p className="text-xs text-muted-foreground">
              {totalUsers > 0 ? Math.round((vipUsers / totalUsers) * 100) : 0}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vouchers</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(activeVouchers)}</div>
            <p className="text-xs text-muted-foreground">
              Available for redemption
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/admin/vouchers">
              <Button className="w-full h-16 flex items-center justify-center gap-3">
                <Plus className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Generate Voucher</div>
                  <div className="text-xs opacity-70">Create new credit vouchers</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/users">
              <Button variant="outline" className="w-full h-16 flex items-center justify-center gap-3">
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Manage Users</div>
                  <div className="text-xs opacity-70">View and edit user accounts</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Details */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">VIP Users</span>
                <span className="font-medium">{formatNumber(vipUsers)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">VIP Price</span>
                <span className="font-medium">{formatRupiah(10000)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Revenue</span>
                <span className="font-bold text-green-600">{formatRupiah(totalRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Revenue/User</span>
                <span className="font-medium">
                  {formatRupiah(totalUsers > 0 ? totalRevenue / totalUsers : 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Regular Users</span>
                <span className="font-medium">
                  {formatNumber(users.filter(u => !u.isVip).length)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Credits</span>
                <span className="font-medium">{formatNumber(totalCredits)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Credits/User</span>
                <span className="font-medium">
                  {totalUsers > 0 ? Math.round(totalCredits / totalUsers) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Voucher Conversion</span>
                <span className="font-medium">
                  {vouchers.length > 0 
                    ? Math.round((vouchers.reduce((sum, v) => sum + v.currentUses, 0) / vouchers.reduce((sum, v) => sum + v.maxUses, 0)) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users
              .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis())
              .slice(0, 5)
              .map((user) => (
                <div key={user.uid} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                      {user.role}
                    </Badge>
                    {user.isVip && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        VIP
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}