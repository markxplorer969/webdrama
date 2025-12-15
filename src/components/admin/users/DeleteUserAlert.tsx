'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Mail, User, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { UserData } from '@/context/AuthContext';

interface DeleteUserAlertProps {
  user: UserData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserDeleted: () => void;
}

export function DeleteUserAlert({ 
  user, 
  open, 
  onOpenChange, 
  onUserDeleted 
}: DeleteUserAlertProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Import dynamically to avoid bundling issues
      const { deleteDoc, doc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      await deleteDoc(doc(db, 'users', user.uid));

      toast.success('User deleted successfully');
      onUserDeleted();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete User
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the user's data and credits permanently. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* User Info */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg my-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL} />
            <AvatarFallback>
              {user.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{user.displayName}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user.email}
            </p>
            <div className="flex items-center gap-2 mt-1">
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
        </div>

        {/* Warning Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>⚠️ User will lose access to their account</p>
          <p>⚠️ All user data will be permanently deleted</p>
          <p>⚠️ Credits and VIP status will be revoked</p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}