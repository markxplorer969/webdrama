import { initializeApp, getApps } from 'firebase/app'
import { getAuth, getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase Client Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOiJQXazL2FgQ1MgrKANg0PEKW10CACY8",
  authDomain: "dramaflex-38877.firebaseapp.com",
  projectId: "dramaflex-38877",
  storageBucket: "dramaflex-38877.firebasestorage.app",
  messagingSenderId: "763568215994",
  appId: "1:763568215994:web:779a8f88af851c1670ef83",
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

// Export Firebase services for client-side usage
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
