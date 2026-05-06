'use client';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from './AuthProvider';
import { useToast } from './Toast';
import { fmt, fmtDate, getInitials } from '../lib/calculations';

export default function Profile({ allGroups, allConnections }) {
  const { currentUser, userData } = useAuth();
  const showToast = useToast();

  return (
    <div>
      {/* Display user details and account statistics */}
      <div className="card-lg" style={{ marginBottom: 14 }}>
        <div className="profile-header">
          <div className="profile-av-big">{getInitials(userData?.name || 'U')}</div>
          <div>
            <div className="profile-name">{userData?.name}</div>
            <div className="profile-handle">@{userData?.username || 'user'}</div>
            <div className="profile-email-txt">{currentUser?.email}</div>
          </div>
        </div>
        <div className="detail-grid">
          <div className="detail-box">
            <div className="detail-box-label">Balance</div>
            <div className="detail-box-val" style={{ color: 'var(--gold)' }}>{fmt(userData?.balance || 0)}</div>
          </div>
          <div className="detail-box">
            <div className="detail-box-label">Member Since</div>
            <div className="detail-box-val">{fmtDate(userData?.createdAt)}</div>
          </div>
          <div className="detail-box">
            <div className="detail-box-label">E-Splits</div>
            <div className="detail-box-val">{Object.keys(allGroups).length}</div>
          </div>
          <div className="detail-box">
            <div className="detail-box-label">Connections</div>
            <div className="detail-box-val">{Object.keys(allConnections).length}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Render available payment options and linked accounts */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 10 }}>Payment Methods</div>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 12, marginBottom: 7, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 12 }}>Primary Bank Account</div>
              <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 1 }}>Linked Account</div>
            </div>
            <span className="badge badge-green">Primary</span>
          </div>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 12 }}>Internal Wallet</div>
              <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 1 }}>Balance: {fmt(userData?.balance || 0)}</div>
            </div>
            <span className="badge badge-gold">Digital</span>
          </div>
        </div>

        {/* Application settings and user actions */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 10 }}>Settings</div>
          <div className="settings-row" onClick={() => showToast('Notifications — coming soon', 'info')}>
            <div className="settings-row-left">Notifications</div><span style={{ color: 'var(--text3)' }}>›</span>
          </div>
          <div className="settings-row" onClick={() => showToast('Privacy — coming soon', 'info')}>
            <div className="settings-row-left">Privacy</div><span style={{ color: 'var(--text3)' }}>›</span>
          </div>
          <div className="settings-row" onClick={() => showToast('Help — coming soon', 'info')}>
            <div className="settings-row-left">Help & Support</div><span style={{ color: 'var(--text3)' }}>›</span>
          </div>
          {/* Handle user sign out process */}
          <div className="settings-row"
            style={{ marginTop: 8, borderColor: 'rgba(204,62,62,0.2)' }}
            onClick={async () => { if (!confirm('Logout?')) return; await signOut(auth); }}>
            <div className="settings-row-left" style={{ color: 'var(--red)' }}>Logout</div>
            <span style={{ color: 'var(--red)' }}>›</span>
          </div>
        </div>
      </div>
    </div>
  );
}
