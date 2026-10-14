import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import {
  auth,
  googleProvider,
  db,
  isFirebaseConfigured,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from '../config/firebase';

export const AuthContext = createContext();

const LOCAL_STORAGE_KEY = 'omnimind_voxai_user';

// Synchronize backend JWT token for API requests
const ensureBackendToken = async (email = 'demo@omnimind.ai', password = 'password123', name = 'Demo User') => {
  try {
    const res = await api.post('/auth/login', { email, password }).catch(async () => {
      return await api.post('/auth/register', { name, email, password });
    });
    if (res?.data?.token) {
      localStorage.setItem('scamkavach_token', res.data.token);
      localStorage.setItem('scamkavach_user', JSON.stringify(res.data.user || { email, name }));
      return res.data.token;
    }
  } catch (e) {
    if (!localStorage.getItem('scamkavach_token')) {
      localStorage.setItem('scamkavach_token', 'local_jwt_session_valid');
    }
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync profile document with Firestore
  const syncFirestoreProfile = async (firebaseUser, additionalData = {}) => {
    if (!db || !firebaseUser) return null;
    const userRef = doc(db, 'users', firebaseUser.uid);
    try {
      const docSnap = await getDoc(userRef);
      const now = new Date().toISOString();

      if (!docSnap.exists()) {
        const newProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || additionalData.name || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || null,
          provider: additionalData.provider || firebaseUser.providerData?.[0]?.providerId || 'password',
          emailVerified: firebaseUser.emailVerified || false,
          createdAt: now,
          lastLoginAt: now,
        };
        await setDoc(userRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
        return newProfile;
      } else {
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp(),
        });
        const existing = docSnap.data();
        return {
          ...existing,
          name: firebaseUser.displayName || existing.name,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || existing.photoURL,
          emailVerified: firebaseUser.emailVerified,
          lastLoginAt: now,
        };
      }
    } catch (err) {
      console.warn('[Firestore sync warning]:', err.message);
      return {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || additionalData.name || 'User',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || null,
        provider: additionalData.provider || 'firebase',
        emailVerified: firebaseUser.emailVerified || false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
    }
  };

  // Persistent session listener on mount
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const profile = await syncFirestoreProfile(firebaseUser);
          const userData = {
            uid: firebaseUser.uid,
            id: firebaseUser.uid,
            name: profile?.name || firebaseUser.displayName || 'User',
            email: firebaseUser.email,
            photoURL: profile?.photoURL || firebaseUser.photoURL || null,
            provider: profile?.provider || (firebaseUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'password'),
            emailVerified: firebaseUser.emailVerified,
            createdAt: profile?.createdAt || new Date().toISOString(),
            lastLoginAt: profile?.lastLoginAt || new Date().toISOString(),
          };
          setUser(userData);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local preview mode persistence
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (e) {
        setUser(null);
      }
      setLoading(false);
    }
  }, []);

  /**
   * 1. Sign In With Google (Popup Flow)
   */
  const signInWithGoogle = async () => {
    if (isFirebaseConfigured && auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const profile = await syncFirestoreProfile(result.user, { provider: 'google' });
        const userData = {
          uid: result.user.uid,
          id: result.user.uid,
          name: profile?.name || result.user.displayName || 'Google User',
          email: result.user.email,
          photoURL: profile?.photoURL || result.user.photoURL,
          provider: 'google',
          emailVerified: true,
          createdAt: profile?.createdAt || new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        setUser(userData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
        return userData;
      } catch (err) {
        throw formatAuthError(err);
      }
    } else {
      // Preview / Offline Simulation Mode
      const simulatedGoogleUser = {
        uid: 'google-usr-' + Math.random().toString(36).substring(2, 9),
        id: 'google-usr-' + Math.random().toString(36).substring(2, 9),
        name: 'Alex Johnson (Google)',
        email: 'alex.johnson@gmail.com',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        provider: 'google',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isSimulated: true,
      };
      setUser(simulatedGoogleUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(simulatedGoogleUser));
      return simulatedGoogleUser;
    }
  };

  /**
   * 2. Sign Up With Email and Password
   */
  const signUp = async (fullName, email, password) => {
    // Validation: 8+ chars, at least 1 letter and 1 number
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      throw new Error('Password must contain at least one letter and one number.');
    }

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });

        const profile = await syncFirestoreProfile(userCredential.user, {
          name: fullName,
          provider: 'password',
        });

        // Send verification email
        try {
          await sendEmailVerification(userCredential.user);
        } catch (vErr) {
          console.warn('Verification email dispatch notice:', vErr.message);
        }

        const userData = {
          uid: userCredential.user.uid,
          id: userCredential.user.uid,
          name: fullName,
          email: userCredential.user.email,
          photoURL: null,
          provider: 'password',
          emailVerified: false,
          createdAt: profile?.createdAt || new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        setUser(userData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
        return { user: userData, needsVerification: true };
      } catch (err) {
        throw formatAuthError(err);
      }
    } else {
      // Preview / Offline Simulation Mode
      const simulatedUser = {
        uid: 'usr-' + Math.random().toString(36).substring(2, 9),
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        name: fullName,
        email: email,
        photoURL: null,
        provider: 'password',
        emailVerified: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isSimulated: true,
      };
      setUser(simulatedUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(simulatedUser));
      return { user: simulatedUser, needsVerification: true };
    }
  };

  /**
   * 3. Login with Email and Password
   */
  const login = async (email, password) => {
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const profile = await syncFirestoreProfile(userCredential.user);

        const userData = {
          uid: userCredential.user.uid,
          id: userCredential.user.uid,
          name: profile?.name || userCredential.user.displayName || 'User',
          email: userCredential.user.email,
          photoURL: profile?.photoURL || userCredential.user.photoURL,
          provider: 'password',
          emailVerified: userCredential.user.emailVerified,
          createdAt: profile?.createdAt || new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        setUser(userData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
        return userData;
      } catch (err) {
        throw formatAuthError(err);
      }
    } else {
      // Preview / Offline Simulation Mode
      const simulatedUser = {
        uid: 'demo-user-123',
        id: 'demo-user-123',
        name: email.split('@')[0].replace(/[._]/g, ' ') || 'Demo User',
        email: email,
        photoURL: null,
        provider: 'password',
        emailVerified: true,
        createdAt: '2026-01-01T00:00:00.000Z',
        lastLoginAt: new Date().toISOString(),
        isSimulated: true,
      };
      setUser(simulatedUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(simulatedUser));
      return simulatedUser;
    }
  };

  /**
   * 4. Forgot / Reset Password
   */
  const resetPassword = async (email) => {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (isFirebaseConfigured && auth) {
      try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: 'Password reset email sent successfully.' };
      } catch (err) {
        throw formatAuthError(err);
      }
    } else {
      // Preview / Offline Simulation Mode
      return { success: true, message: 'Password reset link sent to ' + email + ' (Simulation mode).' };
    }
  };

  /**
   * Resend Verification Email
   */
  const sendVerification = async () => {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        return { success: true };
      } catch (err) {
        throw formatAuthError(err);
      }
    } else {
      return { success: true };
    }
  };

  /**
   * 5. Logout
   */
  const logout = async () => {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
    } finally {
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem('scamkavach_token');
      localStorage.removeItem('scamkavach_user');
    }
  };

  // Convert Firebase error codes into human-readable messages
  const formatAuthError = (error) => {
    const code = error?.code || '';
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return new Error('Incorrect password. Please verify your credentials or reset your password.');
      case 'auth/user-not-found':
        return new Error('No account found with this email. Please check your spelling or sign up.');
      case 'auth/email-already-in-use':
        return new Error('This email is already registered. Please log in or use password reset.');
      case 'auth/too-many-requests':
        return new Error('Too many failed attempts. Access temporarily locked for security. Please try again later.');
      case 'auth/account-exists-with-different-credential':
        return new Error('An account already exists with this email via Google Sign-In. Please sign in with Google.');
      case 'auth/invalid-email':
        return new Error('Please enter a valid email address format.');
      case 'auth/weak-password':
        return new Error('Password must be at least 8 characters long with letters and numbers.');
      case 'auth/popup-closed-by-user':
        return new Error('Google Sign-In popup was closed before completing.');
      case 'auth/network-request-failed':
        return new Error('Network error. Please check your internet connection.');
      default:
        return new Error(error?.message || 'Authentication operation failed. Please try again.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        isFirebaseConfigured,
        signInWithGoogle,
        signUp,
        login,
        logout,
        resetPassword,
        sendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth } from '../hooks/useAuth';
