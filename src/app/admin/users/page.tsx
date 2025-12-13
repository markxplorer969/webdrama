'use client';

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserData } from '@/context/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2, Coins, Crown, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [creditsAmount, setCreditsAmount] = useState<string>('');
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  // Fetch users in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        } as UserData));
        setUsers(usersData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddCredits = async () => {
    if (!selectedUser || !creditsAmount) return;

    const amount = parseInt(creditsAmount);
    if (isNaN(amount) || amount === 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setUpdating(selectedUser.uid);
    try {
      const userRef = doc(db, 'users', selectedUser.uid);
      await updateDoc(userRef, {
        credits: increment(amount)
      });
      
      toast.success(`Added ${amount > 0 ? '+' : ''}${amount} credits to ${selectedUser.displayName}`);
      setCreditsDialogOpen(false);
      setCreditsAmount('');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error adding credits:', error);
      toast.error('Failed to update credits');
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleVIP = async (user: UserData) => {
    setUpdating(user.uid);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        isVip: !user.isVip
      });
      
      toast.success(`${user.displayName} is now ${!user.isVip ? 'VIP' : 'Regular'} user`);
    } catch (error) {
      console.error('Error toggling VIP:', error);
      toast.error('Failed to update VIP status');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteUser = (user: UserData) => {
    console.log(`Delete functionality coming soon for user: ${user.displayName} (${user.email})`);
    toast.info('Delete functionality coming soon - requires Cloud Functions');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage all registered users ({users.length} total)
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Credits</TableHead>
              <TableHead className="text-center">VIP Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={undefined} alt={user.displayName} />
                      <AvatarFallback className="text-xs">
                        {getInitials(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.displayName}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {user.uid.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{user.credits}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    {user.isVip ? (
                      <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                        <Crown className="h-3 w-3 mr-1" />
                        VIP
                      </Badge>
                    ) : (
                      <Badge variant="outline">Regular</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {/* Add Credits */}
                    <Dialog
                      open={creditsDialogOpen && selectedUser?.uid === user.uid}
                      onOpenChange={(open) => {
                        setCreditsDialogOpen(open);
                        if (!open) {
                          setSelectedUser(null);
                          setCreditsAmount('');
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                          disabled={updating === user.uid}
                        >
                          <Coins className="h-4 w-4 mr-1" />
                          Credits
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Manage Credits</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="credits">User: {selectedUser?.displayName}</Label>
                            <p className="text-sm text-muted-foreground">
                              Current credits: {selectedUser?.credits}
                            </p>
                          </div>
                          <div>
                            <Label htmlFor="amount">Amount (use negative to remove)</Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="Enter amount"
                              value={creditsAmount}
                              onChange={(e) => setCreditsAmount(e.target.value)}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setCreditsDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleAddCredits}
                              disabled={updating === user.uid || !creditsAmount}
                            >
                              {updating === user.uid ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Plus className="h-4 w-4 mr-2" />
                              )}
                              Update Credits
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Toggle VIP */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleVIP(user)}
                      disabled={updating === user.uid}
                    >
                      {updating === user.uid ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Crown className={`h-4 w-4 ${user.isVip ? 'text-yellow-500' : ''}`} />
                      )}
                    </Button>

                    {/* Delete User */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {user.displayName}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}
    </div>
  );
}