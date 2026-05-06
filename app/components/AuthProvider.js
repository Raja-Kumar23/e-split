'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, db } from '../lib/firebase';
import { generateUsername } from '../lib/calculations';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const snap = await get(ref(db, 'users/' + user.uid));
          if (snap.exists()) {
            setUserData(snap.val());
          } else {
            const name = user.displayName || user.email.split('@')[0];
            const username = generateUsername(name);
            const newData = {
              name,
              email: user.email,
              username,
              balance: 20000,
              totalSpent: 0,
              createdAt: Date.now(),
            };
            await set(ref(db, 'users/' + user.uid), newData);
            await set(ref(db, 'usernames/' + username), user.uid);
            setUserData(newData);
          }
        } catch (e) {
          console.error('Auth load error', e);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthCtx.Provider value={{ currentUser, userData, setUserData, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
