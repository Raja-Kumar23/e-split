/**
 * Gifts Feature Component.
 * Enables users to send and receive virtual gift cards utilizing their wallet balance.
 */
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useToast } from './Toast';
import { fetchGifts, sendGiftApi } from '../lib/api';
import { fmt, fmtDate, round2 } from '../lib/calculations';

const GIFT_CARDS = [
  { id: 'birthday', emoji: '', name: 'Birthday Card' },
  { id: 'coffee',   emoji: '', name: 'Coffee Gift' },
  { id: 'food',     emoji: '', name: 'Food Treat' },
  { id: 'movie',    emoji: '', name: 'Movie Night' },
  { id: 'shopping', emoji: '️', name: 'Shopping Card' },
  { id: 'travel',   emoji: '️', name: 'Travel Voucher' },
  { id: 'gaming',   emoji: '', name: 'Gaming Gift' },
  { id: 'flower',   emoji: '', name: 'Flower Bouquet' },
];

export default function Gifts({ allConnections }) {
  const { currentUser, userData, setUserData } = useAuth();
  const showToast = useToast();
  const [selected,   setSelected]   = useState(GIFT_CARDS[0]);
  const [giftTo,     setGiftTo]     = useState('');
  const [giftAmount, setGiftAmount] = useState('');
  const [giftMsg,    setGiftMsg]    = useState('');
  const [history,    setHistory]    = useState([]);
  const [loading,    setLoading]    = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    fetchGifts(currentUser.uid).then(setHistory).catch(console.error);
  }, [currentUser]);

  const handleSend = async () => {
    if (!giftTo)     { showToast('Select a connection', 'error'); return; }
    const amount = parseFloat(giftAmount);
    if (!amount || amount <= 0) { showToast('Enter a valid amount', 'error'); return; }
    try {
      setLoading(true);
      const res = await sendGiftApi({
        from:      currentUser.uid,
        to:        giftTo,
        amount,
        cardId:    selected.id,
        cardEmoji: selected.emoji,
        cardName:  selected.name,
        message:   giftMsg,
      });
      setUserData(d => ({ ...d, balance: res.senderNewBalance }));
      setGiftAmount(''); setGiftMsg('');
      showToast(`${selected.emoji} Gift sent to ${allConnections[giftTo]?.name}! `, 'success');
      const updated = await fetchGifts(currentUser.uid);
      setHistory(updated);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const toUser = giftTo && allConnections[giftTo] ? allConnections[giftTo] : null;

  return (
    <div className="gift-layout">
      <div>
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="section-title" style={{ marginBottom: 3 }}> Send a Gift Card</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 14 }}>Choose a card, set amount, add a message</div>

          <div className="fgrp">
            <label>Choose Gift Card</label>
            <div className="gift-cards-grid">
              {GIFT_CARDS.map(gc => (
                <div key={gc.id}
                  className={`gift-card-opt${selected.id === gc.id ? ' selected' : ''}`}
                  onClick={() => setSelected(gc)}>
                  <div className="gift-card-emoji">{gc.emoji}</div>
                  <div className="gift-card-name">{gc.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="fgrp">
            <label>Send To</label>
            <select value={giftTo} onChange={e => setGiftTo(e.target.value)}>
              <option value="">— Select a connection —</option>
              {Object.entries(allConnections).map(([uid, u]) => (
                <option key={uid} value={uid}>{u.name} (@{u.username || 'user'})</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="fgrp">
              <label>Amount (NPR)</label>
              <input type="number" value={giftAmount} onChange={e => setGiftAmount(e.target.value)} placeholder="0.00" min="0" />
            </div>
            <div className="fgrp">
              <label>Message (optional)</label>
              <input type="text" value={giftMsg} onChange={e => setGiftMsg(e.target.value)} placeholder="Happy birthday! " />
            </div>
          </div>

          <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 10 }}>
            Wallet balance: <b style={{ color: 'var(--gold)' }}>{fmt(userData?.balance || 0)}</b>
          </div>

          <button className="btn btn-gold" style={{ width: '100%' }} onClick={handleSend} disabled={loading}>
            {loading ? 'Sending…' : ' Send Gift Card'}
          </button>
        </div>

        <div className="card">
          <div className="section-header"><div className="section-title"> Gift History</div></div>
          {!history.length ? (
            <div className="empty"><div className="empty-icon"></div><div className="empty-sub">No gifts yet</div></div>
          ) : (
            history.slice(0, 15).map((g, i) => {
              const isSent = g.from === currentUser?.uid;
              return (
                <div key={i} className="gift-history-item">
                  <div style={{ fontSize: 22 }}>{g.cardEmoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text)' }}>{g.cardName}</div>
                    <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 1 }}>
                      {isSent ? `To: ${g.toName}` : `From: ${g.fromName}`} · {fmtDate(g.createdAt)}
                    </div>
                    {g.message && <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2, fontStyle: 'italic' }}>"{g.message}"</div>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={`activity-val ${isSent ? 'neg' : 'pos'}`}>{isSent ? '-' : '+'}{fmt(g.amount)}</div>
                    <span className={`badge ${isSent ? 'badge-red' : 'badge-green'}`} style={{ marginTop: 3 }}>
                      {isSent ? 'Sent' : 'Received'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* live preview */}
      <div className="gift-preview">
        <div className="gift-preview-orb" />
        <div className="gift-preview-emoji">{selected.emoji}</div>
        <div className="gift-preview-name">{selected.name}</div>
        <div className="gift-preview-amount">{fmt(parseFloat(giftAmount) || 0)}</div>
        <div className="gift-preview-to">To: {toUser ? toUser.name : '—'}</div>
        {giftMsg && <div className="gift-preview-msg">"{giftMsg}"</div>}
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 3 }}>From</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
            @{userData?.username || 'you'}
          </div>
        </div>
      </div>
    </div>
  );
}
