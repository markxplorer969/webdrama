// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

export { app, analytics, getAuth, GoogleAuthProvider };
export default firebaseConfig;