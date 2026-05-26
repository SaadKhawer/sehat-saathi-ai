import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { firebaseAuth, googleProvider } from '../api/firebase';
import { authAPI } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Try to load profile from backend — silently fail if backend is down
        try {
          const res = await authAPI.getMe();
          setUserData(res.data?.data || null);
        } catch {
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  /* ── Signup ── */
  const signup = async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await updateProfile(cred.user, { displayName: name });
    // Try to register in backend — don't crash if Firestore not ready
    try {
      await authAPI.register({ name });
      const res = await authAPI.getMe();
      setUserData(res.data?.data || null);
    } catch {
      setUserData({ name, email });   // fallback local data
    }
    return cred.user;
  };

  /* ── Login ── */
  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
    try {
      const res = await authAPI.getMe();
      setUserData(res.data?.data || null);
    } catch {
      // Backend not available — try to create profile
      try {
        await authAPI.register({ name: cred.user.displayName || '' });
        const res = await authAPI.getMe();
        setUserData(res.data?.data || null);
      } catch {
        setUserData({ name: cred.user.displayName || email, email });
      }
    }
    return cred.user;
  };

  /* ── Google Login ── */
  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(firebaseAuth, googleProvider);
    try {
      const res = await authAPI.getMe();
      setUserData(res.data?.data || null);
    } catch {
      try {
        await authAPI.register({ name: cred.user.displayName || '' });
        const res = await authAPI.getMe();
        setUserData(res.data?.data || null);
      } catch {
        setUserData({ name: cred.user.displayName || '', email: cred.user.email });
      }
    }
    return cred.user;
  };

  /* ── Logout ── */
  const logout = async () => {
    await signOut(firebaseAuth);
    setUser(null);
    setUserData(null);
  };

  /* ── Update Profile ── */
  const updateUserData = async (data) => {
    try {
      await authAPI.updateMe(data);
    } catch {}
    setUserData((prev) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, signup, login, loginWithGoogle, logout, updateUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
