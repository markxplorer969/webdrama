'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Plus, 
  Loader2,
  Gift,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { formatNumber } from '@/lib/currency';

interface Voucher {
  id: string;
  code: string;
  credits: number;
  maxUses: number;
  currentUses: number;
  redeemedBy?: string[];
  createdAt: any;
}

interface RedeemModalProps {
  children: React.ReactNode;
}

export function RedeemModal({ children }: RedeemModalProps) {
  const { user, userData } = useAuth();
  const [open, setOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  const handleRedeem = async () => {
    if (!user || !userData) {
      toast.error('Please login to redeem vouchers');
      return;
    }

    if (!voucherCode.trim()) {
      toast.error('Please enter a voucher code');
      return;
    }

    try {
      setRedeeming(true);
      
      // Import dynamically to avoid bundling issues
      const { runTransaction, collection, query, where, getDocs } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      await runTransaction(db, async (transaction) => {
        // 1. Query for the voucher document by code field
        const vouchersRef = collection(db, 'vouchers');
        const q = query(vouchersRef, where('code', '==', voucherCode.trim().toUpperCase()));
        const querySnapshot = await getDocs(q);

        // 2. Validations
        if (querySnapshot.empty) {
          throw new Error('Invalid voucher code');
        }

        // Get the first (and should be only) matching voucher
        const voucherDoc = querySnapshot.docs[0];
        const voucherData = voucherDoc.data() as Voucher;
        
        // Check if voucher is fully used
        if (voucherData.currentUses >= voucherData.maxUses) {
          throw new Error('Voucher has been fully used');
        }

        // Check if user already redeemed this voucher
        if (voucherData.redeemedBy && Array.isArray(voucherData.redeemedBy) && voucherData.redeemedBy.includes(user.uid)) {
          throw new Error('You have already used this voucher code');
        }

        // 3. Reference the user document
        const usersRef = collection(db, 'users');
        const userQuery = query(usersRef, where('uid', '==', user.uid));
        const userQuerySnapshot = await getDocs(userQuery);

        if (userQuerySnapshot.empty) {
          throw new Error('User account not found');
        }

        const userDoc = userQuerySnapshot.docs[0];
        const userData = userDoc.data();

        // 4. Execute atomic updates
        // Update voucher: increment currentUses and add user to redeemedBy array
        transaction.update(voucherDoc.ref, {
          currentUses: voucherData.currentUses + 1,
          redeemedBy: [...(voucherData.redeemedBy || []), user.uid],
          lastRedeemedBy: user.uid,
          lastRedeemedAt: new Date(),
        });

        // Update user: increment credits
        transaction.update(userDoc.ref, {
          credits: (userData.credits || 0) + voucherData.credits,
          lastVoucherRedeemed: voucherCode.trim().toUpperCase(),
          lastVoucherRedeemedAt: new Date(),
        });

        return {
          voucherCredits: voucherData.credits,
          newBalance: (userData.credits || 0) + voucherData.credits,
        };
      });

      // Success feedback
      toast.success(`Successfully redeemed +${formatNumber(voucherCredits)} credits!`);
      setVoucherCode('');
      setOpen(false);
      
    } catch (error: any) {
      console.error('Voucher redemption error:', error);
      
      // Handle specific error messages
      let errorMessage = error.message || 'Failed to redeem voucher';
      
      if (errorMessage.includes('Invalid voucher code')) {
        errorMessage = 'Invalid voucher code';
      } else if (errorMessage.includes('fully used')) {
        errorMessage = 'Voucher has been fully used';
      } else if (errorMessage.includes('already used')) {
        errorMessage = 'You have already used this voucher code';
      } else if (errorMessage.includes('User account not found')) {
        errorMessage = 'Account not found. Please try logging out and back in';
      }

      toast.error(errorMessage);
    } finally {
      setRedeeming(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setVoucherCode(''); // Clear input when closing
    }
  };

  const currentCredits = userData?.credits || 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Top Up Credits
          </DialogTitle>
          <DialogDescription>
            Enter a voucher code to add credits to your account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Balance Display */}
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Current Balance</div>
            <div className="text-3xl font-bold text-primary">
              {formatNumber(currentCredits)}
            </div>
            <div className="text-sm text-muted-foreground">Credits</div>
          </div>

          {/* Voucher Code Input */}
          <div className="space-y-2">
            <Label htmlFor="voucher-code">Enter Voucher Code</Label>
            <div className="relative">
              <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="voucher-code"
                placeholder="e.g., BONUS100"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                className="pl-10 uppercase"
                maxLength={20}
                disabled={redeeming}
              />
            </div>
          </div>

          {/* Redeem Button */}
          <Button 
            onClick={handleRedeem} 
            disabled={redeeming || !voucherCode.trim()}
            className="w-full"
          >
            {redeeming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redeeming...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Redeem Code
              </>
            )}
          </Button>

          {/* Info Cards */}
          <div className="grid gap-3 text-sm">
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-100">Valid Codes</div>
                <div className="text-blue-700 dark:text-blue-300">
                  Only use codes from official sources
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-amber-900 dark:text-amber-100">One-Time Use</div>
                <div className="text-amber-700 dark:text-amber-300">
                  Each voucher can only be used once per account
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-red-900 dark:text-red-100">No Sharing</div>
                <div className="text-red-700 dark:text-red-300">
                  Voucher codes are non-transferable
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3">
          <div className="text-center text-sm text-muted-foreground">
            Need more vouchers? Contact our admin team
          </div>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={redeeming}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}