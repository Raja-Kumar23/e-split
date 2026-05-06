'use client';
import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from '../lib/firebase';
import { generateUsername } from '../lib/calculations';
import { useToast } from './Toast';

const GoogleIcon = () => (
  <svg className="google-icon" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [signupErr, setSignupErr] = useState('');
  const [preview, setPreview] = useState('');
  const showToast = useToast();

  const handleLogin = async () => {
    // Clear previous errors
    setLoginErr('');
    // Check if fields are empty
    if (!loginEmail || !loginPass) { setLoginErr('Please fill in all fields.'); return; }
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPass);
      showToast('Welcome back! ', 'success');
    } catch { setLoginErr('Invalid email or password.'); }
  };

  const handleSignup = async () => {
    setSignupErr('');
    
    // Validate input fields
    if (!signupName || !signupEmail || !signupPass) { setSignupErr('Please fill all fields.'); return; }
    if (signupPass.length < 6) { setSignupErr('Password must be ≥6 characters.'); return; }
    try {
      // Generate username from full name
      const username = generateUsername(signupName);
      const cred = await createUserWithEmailAndPassword(auth, signupEmail, signupPass);
      
      // Save user to database and add initial balance
      await set(ref(db, 'users/' + cred.user.uid), {
        name: signupName, email: signupEmail, username,
        balance: 20000, totalSpent: 0, createdAt: Date.now(),
      });
      await set(ref(db, 'usernames/' + username), cred.user.uid);
      showToast('Account created! @' + username + ' ', 'success');
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') setSignupErr('Email already in use.');
      else setSignupErr(e.message);
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists
      const snap = await get(ref(db, 'users/' + user.uid));
      if (!snap.exists()) {
        // Use email if name is not available
        const name = user.displayName || user.email.split('@')[0];
        const username = generateUsername(name);
        await set(ref(db, 'users/' + user.uid), {
          name, email: user.email, username,
          balance: 20000, totalSpent: 0, createdAt: Date.now(),
        });
        await set(ref(db, 'usernames/' + username), user.uid);
        showToast('Welcome ' + name + '! ', 'success');
      } else {
        showToast('Welcome back! ', 'success');
      }
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') showToast('Google sign-in failed', 'error');
    }
  };

  const onNameInput = (v) => {
    setSignupName(v);
    setPreview(v.trim().length > 2 ? '@' + generateUsername(v) : '');
  };

  return (
    <div className="auth-screen">
      <div className="auth-mesh" />
      <div className="auth-grid" />
      <div className="auth-wrap">
        <div className="auth-brand">
          <div className="auth-brand-logo">E-Split</div>
          <div className="auth-brand-sub">Expense splitting platform</div>
        </div>
        <div className="auth-card">
          <div className="auth-tabs">
            <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
            <button className={`auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => setTab('signup')}>Create Account</button>
          </div>
          {tab === 'login' ? (
            <div>
              <div className="fgroup"><label>Email</label><input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="student@university.edu" onKeyDown={e => e.key === 'Enter' && handleLogin()} /></div>
              <div className="fgroup"><label>Password</label><input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()} /></div>
              {loginErr && <div className="auth-err">{loginErr}</div>}
              <button className="btn-auth" style={{ marginTop: loginErr ? 10 : 0 }} onClick={handleLogin}>Sign In →</button>
              <div className="auth-divider">or</div>
              <button className="btn-google" onClick={handleGoogle}><GoogleIcon />Continue with Google</button>
            </div>
          ) : (
            <div>
              <div className="fgroup"><label>Full Name</label><input type="text" value={signupName} onChange={e => onNameInput(e.target.value)} placeholder="Student Name" /></div>
              <div className="fgroup"><label>Email</label><input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="student@university.edu" /></div>
              <div className="fgroup"><label>Password (min 6 chars)</label><input type="password" value={signupPass} onChange={e => setSignupPass(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleSignup()} /></div>
              {preview && <div className="username-preview">Your username: {preview}</div>}
              {signupErr && <div className="auth-err">{signupErr}</div>}
              <button className="btn-auth" style={{ marginTop: 8 }} onClick={handleSignup}>Create Account →</button>
              <div className="auth-divider">or</div>
              <button className="btn-google" onClick={handleGoogle}><GoogleIcon />Sign up with Google</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
