import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOiJQXazL2FgQ1MgrKANg0PEKW10CACY8",
  authDomain: "dramaflex-38877.firebaseapp.com",
  projectId: "dramaflex-38877",
  storageBucket: "dramaflex-38877.firebasestorage.app",
  messagingSenderId: "763568215994",
  appId: "1:763568215994:web:779a8f88af851c1670ef83",
  measurementId: "G-MN834BS62C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;