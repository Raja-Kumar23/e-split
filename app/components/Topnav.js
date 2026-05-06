'use client';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from './AuthProvider';
import { getInitials } from '../lib/calculations';

export default function Topnav({ activePage, onNav, pendingCount }) {
  const { userData } = useAuth();
  const [open, setOpen] = useState(false);

  // Define navigation tabs and their display labels
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'esplit',    label: 'E-Split' },
    { id: 'connections', label: 'People' },
    { id: 'gifts',    label: 'Gifts' },
    { id: 'profile',  label: 'Profile' },
  ];

  // Handle user logout sequence
  const logout = async () => {
    if (!confirm('Logout?')) return;
    await signOut(auth);
  };

  return (
    <nav className="topnav">
      <div className="nav-logo">E-Split</div>
      <div className="nav-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`nav-tab${activePage === t.id ? ' active' : ''}`}
            onClick={() => onNav(t.id)}
          >
            {t.label}
            {t.id === 'connections' && pendingCount > 0 && <span className="notif-dot" />}
          </button>
        ))}
      </div>
      <div className="nav-right">
        <div className="nav-username">@{userData?.username || 'user'}</div>
        <div className="dropdown-wrap">
          <button
            className="avatar"
            onClick={() => setOpen(v => !v)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          >
            {getInitials(userData?.name || 'U')}
          </button>
          {open && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={() => { onNav('profile'); setOpen(false); }}>
                View Profile
              </div>
              <div className="dropdown-sep" />
              <div className="dropdown-item danger" onClick={logout}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
