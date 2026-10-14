import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if valid Firebase configuration is supplied
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your-firebase-api-key' &&
  !firebaseConfig.apiKey.includes('YOUR_') &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'your-project-id'
);

let app = null;
let auth = null;
let googleProvider = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    db = getFirestore(app);
  } catch (err) {
    console.warn('[Firebase Init Warning]:', err.message);
  }
} else {
  // Graceful development mode note
  console.info(
    'ℹ️ [Firebase Auth]: Running in demo/preview mode. Add VITE_FIREBASE_* keys to FRONTEND/.env for production Firebase connectivity.'
  );
}

export {
  app,
  auth,
  googleProvider,
  db,
  // Auth methods
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  // Firestore methods
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
};
