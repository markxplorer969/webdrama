'use client';

import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Firebase is initialized when the module is imported
    // Set ready state immediately
    setIsFirebaseReady(true);
  }, []);

  useEffect(() => {
    // Firebase is initialized when module is imported
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
        toast.success('Account created successfully!');
        router.push('/');
      } else {
        toast.error('Failed to create session');
      }
    } catch (error) {
      console.error('Session creation error:', error);
      toast.error('Failed to create session');
    }
  };

  const createUserProfile = async (user: any) => {
    try {
      const response = await fetch('/api/auth/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          displayName: user.displayName,
          uid: user.uid,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Profile created with 20 free credits!');
      } else {
        toast.error(data.error || 'Failed to create user profile');
      }
    } catch (error: any) {
      console.error('Profile creation error:', error);
      toast.error(error.message || 'Failed to create user profile');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFirebaseReady) {
      toast.error('Firebase is not ready yet. Please wait...');
      return;
    }
    
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      
      // Step A: Create User in Firebase Authentication (client-side)
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Update profile with display name if provided
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      
      // Step B: Create Firestore document (server-side)
      await createUserProfile(user);
      
      // Step C: Create session
      await createSession(user);
      
      toast.success('Account created successfully with 20 free credits!');
      router.push('/');
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = 'Failed to create account';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
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
          <p className="text-slate-400">Setting up secure sign-up</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            Join Dramaflex to access your personalized drama collection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-slate-300">
                Display Name (Optional)
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Enter your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-300">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-t-transparent border-slate-600 border-b-slate-600 animate-spin"></div>
                  <span className="ml-2">Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Create Account</span>
                </div>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-400">Already have an account?</span>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="/login" 
              className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
            >
              Sign in instead
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}