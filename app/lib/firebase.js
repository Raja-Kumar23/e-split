/**
 * Firebase Client Initialization.
 * Ensures a single Firebase app instance is created and provides auth/db exports.
 */
'use client';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDuYkJ6kz0W7UfVfE8MB5uV-yBLfD7a2uo',
  authDomain: 'kslcaptain.firebaseapp.com',
  databaseURL: 'https://kslcaptain-default-rtdb.firebaseio.com',
  projectId: 'kslcaptain',
  storageBucket: 'kslcaptain.firebasestorage.app',
  messagingSenderId: '975351727139',
  appId: '1:975351727139:web:a353c7a8c992b6fcfb5d96',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getDatabase(app);
