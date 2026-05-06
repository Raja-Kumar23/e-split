/**
 * Connections Management Interface.
 * Allows users to send, accept, decline, and remove friend requests using their unique @usernames.
 */
'use client';
import { useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from './AuthProvider';
import { useToast } from './Toast';
import { connectionAction } from '../lib/api';
import { getInitials, getAvatarColor } from '../lib/calculations';

export default function Connections({ allConnections, pendingRequests, sentRequests, onRefresh }) {
  const { currentUser, userData } = useAuth();
  const showToast = useToast();
  const [inviteInput, setInviteInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    const username = inviteInput.trim().replace('@', '').toLowerCase();
    if (!username) { showToast('Enter a @username', 'error'); return; }
    
    // Check if user is trying to add themselves
    if (username === (userData?.username || '').toLowerCase()) { showToast("You can't add yourself", 'error'); return; }
    try {
      setLoading(true);

      const snap = await get(ref(db, 'usernames/' + username));
      if (!snap.exists()) { showToast('User @' + username + ' not found', 'error'); return; }
      const targetUid = snap.val();
      await connectionAction('send', currentUser.uid, targetUid);
      setInviteInput('');
      showToast('Request sent to @' + username + ' ', 'success');
      onRefresh();
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const accept  = async (uid) => { try { await connectionAction('accept',  currentUser.uid, uid); showToast('Connected! ', 'success'); onRefresh(); } catch (e) { showToast(e.message, 'error'); } };
  const decline = async (uid) => { try { await connectionAction('decline', currentUser.uid, uid); showToast('Declined',      'info');    onRefresh(); } catch (e) { showToast(e.message, 'error'); } };
  const remove  = async (uid) => { try { await connectionAction('remove',  currentUser.uid, uid); showToast('Removed',       'info');    onRefresh(); } catch (e) { showToast(e.message, 'error'); } };

  return (
    <div className="connections-layout">
      <div>
        <div className="invite-section">
          <div className="invite-title">Connect with Someone</div>
          <div className="invite-sub">Enter their @username to send a connection request</div>
          <div className="invite-input-row">
            <input
              type="text" value={inviteInput}
              onChange={e => setInviteInput(e.target.value)}
              placeholder="@username"
              onKeyDown={e => e.key === 'Enter' && sendRequest()}
            />
            <button className="btn btn-gold" onClick={sendRequest} disabled={loading}>
              {loading ? '…' : 'Send Request'}
            </button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 14 }}>
          <div className="section-header">
            <div className="section-title">Incoming Requests</div>
            <span className="badge badge-gold">{Object.keys(pendingRequests).length}</span>
          </div>
          {!Object.keys(pendingRequests).length ? (
            <div className="empty"><div className="empty-icon"></div><div className="empty-sub">No pending requests</div></div>
          ) : (
            Object.entries(pendingRequests).map(([uid, u]) => (
              <div key={uid} className="request-card">
                <div className="conn-av" style={{ background: getAvatarColor(uid) }}>{getInitials(u.name)}</div>
                <div>
                  <div className="conn-name">{u.name}</div>
                  <div className="conn-handle">@{u.username || 'user'}</div>
                </div>
                <div className="conn-actions">
                  <button className="btn btn-success btn-sm" onClick={() => accept(uid)}>Accept</button>
                  <button className="btn btn-danger btn-sm"  onClick={() => decline(uid)}>Decline</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="section-header">
            <div className="section-title">My Connections</div>
            <span className="badge badge-blue">{Object.keys(allConnections).length}</span>
          </div>
          {!Object.keys(allConnections).length ? (
            <div className="empty"><div className="empty-icon"></div><div className="empty-sub">No connections yet</div></div>
          ) : (
            Object.entries(allConnections).map(([uid, u]) => (
              <div key={uid} className="connection-card">
                <div className="conn-av" style={{ background: getAvatarColor(uid) }}>{getInitials(u.name)}</div>
                <div>
                  <div className="conn-name">{u.name}</div>
                  <div className="conn-handle">@{u.username || 'user'}</div>
                </div>
                <div className="conn-actions">
                  <button className="btn btn-danger btn-sm" onClick={() => remove(uid)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="section-header"><div className="section-title">Sent Requests</div></div>
          {!Object.keys(sentRequests).length ? (
            <div className="empty"><div className="empty-icon"></div><div className="empty-sub">No sent requests</div></div>
          ) : (
            Object.entries(sentRequests).map(([uid, u]) => (
              <div key={uid} className="connection-card">
                <div className="conn-av" style={{ background: getAvatarColor(uid) }}>{getInitials(u.name)}</div>
                <div>
                  <div className="conn-name">{u.name}</div>
                  <div className="conn-handle">@{u.username || 'user'}</div>
                </div>
                <div className="conn-actions"><span className="badge badge-gold">Pending</span></div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 10 }}>My Profile Card</div>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 'var(--r)', padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{userData?.name}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: 'var(--gold)', marginTop: 3 }}>
              @{userData?.username || 'user'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 7 }}>
              Share your @username to let friends connect with you
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
