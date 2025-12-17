'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Eye, EyeOff, Mail, Lock, User, ArrowLeft, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error('Nama lengkap harus diisi');
      return false;
    }

    if (!formData.email.trim()) {
      toast.error('Email harus diisi');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Format email tidak valid');
      return false;
    }

    if (!formData.password) {
      toast.error('Password harus diisi');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok');
      return false;
    }

    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Use real Firebase authentication
      await signUpWithEmail(formData.email, formData.password, formData.fullName);
      
      // TODO: Handle referral code if provided
      if (formData.referralCode.trim()) {
        console.log('Referral code provided:', formData.referralCode);
        // TODO: Implement referral code logic
      }
      
      toast.success('Akun berhasil dibuat!');
      router.push('/');
      
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email sudah digunakan. Silakan gunakan email lain atau login.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Email tidak valid.');
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error('Pendaftaran dengan email/password tidak diizinkan.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password terlalu lemah. Gunakan password yang lebih kuat.');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Terlalu banyak percobaan pendaftaran. Silakan coba lagi nanti.');
      } else {
        toast.error(error.message || 'Pendaftaran gagal. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      
      // Use real Firebase Google authentication
      await signInWithGoogle();
      
      toast.success('Akun Google berhasil dibuat!');
      router.push('/');
      
    } catch (error: any) {
      console.error('Google sign up error:', error);
      toast.error(error.message || 'Pendaftaran dengan Google gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-zinc-900/90 border-zinc-800 backdrop-blur-sm">
      <CardHeader className="space-y-2 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-rose-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">DF</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
        <p className="text-zinc-400">Join DramaFlex and start watching</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Full Name Input */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-zinc-300">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-rose-600 focus:ring-rose-600"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-rose-600 focus:ring-rose-600"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="•••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-rose-600 focus:ring-rose-600"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="•••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`pl-10 pr-10 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-rose-600 focus:ring-rose-600 ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-red-500 focus:border-red-500'
                    : ''
                }`}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-sm text-red-500">Password tidak cocok</p>
            )}
          </div>

          {/* Referral Code - Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="referral" className="border-zinc-700">
              <AccordionTrigger className="text-zinc-300 hover:text-white py-3">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  <span>Kode Referral (Opsional)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-0">
                <div className="space-y-2">
                  <Input
                    name="referralCode"
                    type="text"
                    placeholder="Punya kode teman? Masukkan di sini"
                    value={formData.referralCode}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-rose-600 focus:ring-rose-600"
                  />
                  <p className="text-xs text-zinc-500">
                    Masukkan kode referral untuk mendapatkan bonus kredit
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Sign Up Button */}
          <Button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <Separator className="bg-zinc-700" />
          <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-900 px-3 text-xs text-zinc-500">
            Or continue with
          </span>
        </div>

        {/* Google Sign Up */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignUp}
          className="w-full bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:border-zinc-600"
          disabled={isLoading}
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Footer */}
        <div className="text-center text-sm text-zinc-400">
          Sudah punya akun?{' '}
          <Link 
            href="/signin" 
            className="text-rose-600 hover:text-rose-500 transition-colors font-medium"
          >
            Sign In
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}