'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Ticket, 
  Loader2,
  Copy,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { formatNumber } from '@/lib/currency';

interface Voucher {
  id: string;
  code: string;
  credits: number;
  maxUses: number;
  currentUses: number;
  createdAt: any;
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    credits: '',
    maxUses: '1',
  });

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const { onSnapshot, collection, orderBy, query } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');

        const q = query(
          collection(db, 'vouchers'),
          orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const vouchersData: Voucher[] = [];
          snapshot.forEach((doc) => {
            vouchersData.push({
              id: doc.id,
              ...doc.data()
            } as Voucher);
          });
          setVouchers(vouchersData);
          setLoading(false);
        }, (error) => {
          console.error('Error fetching vouchers:', error);
          toast.error('Failed to fetch vouchers');
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error setting up listener:', error);
        toast.error('Failed to initialize voucher listener');
        setLoading(false);
      }
    };

    const unsubscribe = fetchVouchers();

    return () => {
      unsubscribe.then(unsub => unsub?.());
    };
  }, []);

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.credits) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setCreateLoading(true);
      
      // Import dynamically to avoid bundling issues
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      await addDoc(collection(db, 'vouchers'), {
        code: formData.code.toUpperCase(),
        credits: parseInt(formData.credits),
        maxUses: parseInt(formData.maxUses),
        currentUses: 0,
        createdAt: serverTimestamp(),
      });

      toast.success('Voucher created successfully');
      setCreateDialogOpen(false);
      setFormData({ code: '', credits: '', maxUses: '1' });
    } catch (error: any) {
      console.error('Error creating voucher:', error);
      toast.error(error.message || 'Failed to create voucher');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteVoucher = async (voucherId: string) => {
    try {
      // Import dynamically to avoid bundling issues
      const { deleteDoc, doc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      await deleteDoc(doc(db, 'vouchers', voucherId));

      toast.success('Voucher deleted successfully');
    } catch (error: any) {
      console.error('Error deleting voucher:', error);
      toast.error(error.message || 'Failed to delete voucher');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Code copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Voucher Manager</h1>
          <p className="text-muted-foreground">
            Create and manage credit vouchers for users
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Voucher
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Voucher</DialogTitle>
              <DialogDescription>
                Generate a new voucher code that users can redeem for credits.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateVoucher} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Voucher Code</Label>
                <Input
                  id="code"
                  placeholder="e.g., BONUS100"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    code: e.target.value.toUpperCase() 
                  }))}
                  required
                  maxLength={20}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="credits">Credit Amount</Label>
                <Input
                  id="credits"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.credits}
                  onChange={(e) => setFormData(prev => ({ ...prev, credits: e.target.value }))}
                  required
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxUses">Maximum Uses</Label>
                <Input
                  id="maxUses"
                  type="number"
                  placeholder="1"
                  value={formData.maxUses}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxUses: e.target.value }))}
                  required
                  min="1"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={createLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Voucher
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vouchers</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(vouchers.length)}</div>
            <p className="text-xs text-muted-foreground">
              Created vouchers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vouchers</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(vouchers.filter(v => v.currentUses < v.maxUses).length)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for redemption
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(vouchers.reduce((sum, v) => sum + v.currentUses, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Times vouchers were used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Vouchers</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(vouchers.filter(v => v.currentUses >= v.maxUses).length)}
            </div>
            <p className="text-xs text-muted-foreground">
              Fully redeemed vouchers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vouchers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Vouchers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Credits Value</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vouchers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No vouchers found
                    </TableCell>
                  </TableRow>
                ) : (
                  vouchers.map((voucher) => {
                    const isActive = voucher.currentUses < voucher.maxUses;
                    const isExpired = voucher.currentUses >= voucher.maxUses;
                    
                    return (
                      <TableRow key={voucher.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                              {voucher.code}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(voucher.code)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{formatNumber(voucher.credits)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {voucher.currentUses} / {voucher.maxUses}
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ 
                                width: `${Math.min((voucher.currentUses / voucher.maxUses) * 100, 100)}%` 
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={isExpired ? 'destructive' : isActive ? 'default' : 'secondary'}
                          >
                            {isExpired ? 'Expired' : isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {voucher.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteVoucher(voucher.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}