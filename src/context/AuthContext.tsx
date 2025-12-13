'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

import { auth, db, googleProvider } from '@/lib/firebase';

// Types
export type UserRole = 'admin' | 'user';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  credits: number;
  isVip: boolean;
  createdAt: any;
  lastLogin?: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const triggerDiscordWebhook = async (email: string, displayName: string, uid: string, method: 'google' | 'email') => {
  try {
    const response = await fetch('/api/webhooks/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        displayName,
        uid,
        method
      }),
    });

    if (!response.ok) {
      console.error('Discord webhook failed:', response.statusText);
    } else {
      console.log('Discord webhook sent successfully');
    }
  } catch (error) {
    console.error('Failed to trigger Discord webhook:', error);
  }
};

const createUserData = async (user: User, method: 'google' | 'email'): Promise<UserData> => {
  const userData: UserData = {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName || user.email!.split('@')[0],
    role: 'user',
    credits: 0,
    isVip: false,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp()
  };

  await setDoc(doc(db, 'users', user.uid), userData);
  
  // Trigger Discord webhook for new user
  await triggerDiscordWebhook(userData.email, userData.displayName, userData.uid, method);

  return userData;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (user: User): Promise<UserData | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        // Update last login
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: serverTimestamp()
        });
        return { ...data, lastLogin: new Date() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user document exists
      const existingUserData = await fetchUserData(user);

      if (!existingUserData) {
        // Create new user document and trigger webhook
        const newUserData = await createUserData(user, 'google');
        setUserData(newUserData);
        toast.success('Account created successfully!');
      } else {
        setUserData(existingUserData);
        toast.success('Signed in successfully!');
      }

      setUser(user);
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data
      const existingUserData = await fetchUserData(user);
      
      if (existingUserData) {
        setUserData(existingUserData);
        setUser(user);
        toast.success('Signed in successfully!');
      } else {
        toast.error('User account not found. Please sign up first.');
      }
    } catch (error: any) {
      console.error('Email sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, { displayName });

      // Create user document and trigger webhook
      const newUserData = await createUserData(user, 'email');
      
      setUserData(newUserData);
      setUser(user);
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Email sign up error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserData(null);
      toast.success('Signed out successfully!');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        const data = await fetchUserData(user);
        setUserData(data);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};