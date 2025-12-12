'use client';

import { useState, useEffect } from 'react';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, GoogleAuthProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Chrome, Loader2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Firebase is initialized when the module is imported
    // Set ready state immediately
    setIsFirebaseReady(true);
  }, []);

  const createSession = async (user: any) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        toast.success('Successfully signed in!');
        router.push('/');
      } else {
        toast.error('Failed to create session');
      }
    } catch (error) {
      console.error('Session creation error:', error);
      toast.error('Failed to create session');
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseReady) {
      toast.error('Firebase is not ready yet. Please wait...');
      return;
    }

    try {
      setIsLoading(true);
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      await createSession(result.user);
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseReady) {
      toast.error('Firebase is not ready yet. Please wait...');
      return;
    }

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createSession(result.user);
    } catch (error: any) {
      console.error('Email sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isFirebaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Authentication...</h2>
          <p className="text-slate-400">Setting up secure sign-in</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Sign in to Dramaflex
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            Access your personalized drama collection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Chrome className="mr-2 h-4 w-4" />
            )}
            Sign in with Google
          </Button>
          
          <Separator className="bg-slate-700" />
          
          <form onSubmit={handleEmailSignIn} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sign in
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-violet-400 hover:text-violet-300">
                Sign up
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}