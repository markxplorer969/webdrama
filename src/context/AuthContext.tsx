'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// Types
export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  credits: number;
  role?: string; // 'admin' | 'user'
  isVip?: boolean;
  unlocked_episodes: string[]; // Array of Episode IDs
  history: string[]; // Array of Drama IDs
  createdAt?: any;
  lastLogin?: any;
}

// Use a type for User since we're importing dynamically
type User = any;

interface AuthContextType {
  user: User | null;
  userData: UserProfile | null;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseModules, setFirebaseModules] = useState<any>(null);

  // Load Firebase modules dynamically
  useEffect(() => {
    const loadFirebase = async () => {
      try {
        const authModule = await import('firebase/auth');
        const firestoreModule = await import('firebase/firestore');
        const firebaseConfig = await import('@/lib/firebase');

        setFirebaseModules({
          getAuth: authModule.getAuth,
          User: authModule.User,
          signInWithPopup: authModule.signInWithPopup,
          signInWithEmailAndPassword: authModule.signInWithEmailAndPassword,
          createUserWithEmailAndPassword: authModule.createUserWithEmailAndPassword,
          updateProfile: authModule.updateProfile,
          firebaseSignOut: authModule.signOut,
          onAuthStateChanged: authModule.onAuthStateChanged,
          doc: firestoreModule.doc,
          setDoc: firestoreModule.setDoc,
          getDoc: firestoreModule.getDoc,
          updateDoc: firestoreModule.updateDoc,
          serverTimestamp: firestoreModule.serverTimestamp,
          auth: firebaseConfig.auth,
          db: firebaseConfig.db,
          googleProvider: firebaseConfig.googleProvider
        });
      } catch (error) {
        console.error('Failed to load Firebase modules:', error);
        toast.error('Failed to initialize authentication');
        setLoading(false);
      }
    };

    loadFirebase();
  }, []);

  const migrateUserDocument = async (user: User): Promise<UserProfile | null> => {
    if (!firebaseModules) return null;
    
    try {
      const { getDoc, updateDoc, serverTimestamp, doc } = firebaseModules;
      const userRef = doc(firebaseModules.db, 'users', user.uid);
      
      // Fetch current document
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create new user document
        const newUserData: UserProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || user.email!.split('@')[0],
          role: 'user',
          credits: 0,
          isVip: false,
          photoURL: user.photoURL || null,
          unlocked_episodes: [],
          history: [],
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        };

        await updateDoc(userRef, newUserData);
        return newUserData;
      }

      const existingData = userDoc.data() as any;
      
      // Determine what needs to be updated
      const updates: Partial<UserProfile> = {
        lastLogin: serverTimestamp() // Always update last login
      };

      // Sync photoURL if different
      if (user.photoURL && user.photoURL !== existingData.photoURL) {
        updates.photoURL = user.photoURL;
      }

      // Initialize arrays if they don't exist
      if (!existingData.unlocked_episodes) {
        updates.unlocked_episodes = [];
      }
      
      if (!existingData.history) {
        updates.history = [];
      }

      // Only apply updates if there are changes
      if (Object.keys(updates).length > 0) {
        await updateDoc(userRef, updates, { merge: true });
      }

      // Return merged data
      const mergedData: UserProfile = {
        ...existingData,
        ...updates
      };

      return mergedData;
    } catch (error) {
      console.error('Error migrating user document:', error);
      return null;
    }
  };

  const createUserData = async (user: User, method: 'google' | 'email'): Promise<UserProfile> => {
    if (!firebaseModules) throw new Error('Firebase not initialized');
    
    const { doc, setDoc, serverTimestamp } = firebaseModules;
    const userData: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || user.email!.split('@')[0],
      role: 'user',
      credits: 0,
      isVip: false,
      photoURL: user.photoURL || null,
      unlocked_episodes: [],
      history: [],
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    };

    await setDoc(doc(firebaseModules.db, 'users', user.uid), userData);
    
    // Trigger Discord webhook for new user
    await triggerDiscordWebhook(userData.email, userData.displayName, userData.uid, method);

    return userData;
  };

  const signInWithGoogle = async () => {
    if (!firebaseModules) return;
    
    try {
      setLoading(true);
      const { signInWithPopup, auth, googleProvider } = firebaseModules;
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Migrate user document
      const migratedUserData = await migrateUserDocument(user);

      if (migratedUserData) {
        setUserData(migratedUserData);
        toast.success('Account migrated successfully!');
      } else {
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
    if (!firebaseModules) return;
    
    try {
      setLoading(true);
      const { signInWithEmailAndPassword, auth } = firebaseModules;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Migrate user document
      const migratedUserData = await migrateUserDocument(user);
      
      if (migratedUserData) {
        setUserData(migratedUserData);
        toast.success('Account migrated successfully!');
      } else {
        toast.error('User account not found. Please sign up first.');
      }

      setUser(user);
    } catch (error: any) {
      console.error('Email sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    if (!firebaseModules) return;
    
    try {
      setLoading(true);
      const { createUserWithEmailAndPassword, updateProfile, auth } = firebaseModules;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, { displayName });

      // Create and migrate user document
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
    if (!firebaseModules) return;
    
    try {
      const { firebaseSignOut, auth } = firebaseModules;
      await firebaseSignOut(auth);
      setUser(null);
      setUserData(null);
      toast.success('Signed out successfully!');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
    }
  };

  // Set up auth state listener
  useEffect(() => {
    if (!firebaseModules) return;

    const { onAuthStateChanged, auth } = firebaseModules;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        const data = await migrateUserDocument(user);
        setUserData(data);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [firebaseModules]);

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