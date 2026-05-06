/**
 * Core E-Split Interface Component.
 * Handles the creation of groups, addition of expenses, direct payments, and complex settlement logic.
 */
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useToast } from './Toast';
import { createGroup, createExpense, createPayment } from '../lib/api';
import {
  fmt, fmtDate, getInitials, AVATAR_COLORS, getAvatarColor, round2,
  getMyDebts, getMyCredits, getNetBalance, computeSettlementPlan,
} from '../lib/calculations';

export default function ESplit({ allGroups, allConnections, showNewGroup, onNewGroupDone, onGroupsRefresh }) {
  const { currentUser, userData, setUserData } = useAuth();
  const showToast = useToast();
  const uid = currentUser?.uid;

  const [panel, setPanel] = useState('empty');
  const [selectedGid, setSelectedGid] = useState(null);
  const [groupTab, setGroupTab] = useState('balances');
  const [showExpForm, setShowExpForm] = useState(false);
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [ngName, setNgName] = useState('');
  const [ngDesc, setNgDesc] = useState('');
  const [ngSelected, setNgSelected] = useState({});
  const [showPayModal, setShowPayModal] = useState(false);
  const [payTarget, setPayTarget] = useState(null);
  const [payNote, setPayNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDirPay, setShowDirPay] = useState(false);
  const [dpmMerchant, setDpmMerchant] = useState('');
  const [dpmAmount, setDpmAmount] = useState('');
  const [dpmMethod, setDpmMethod] = useState('');
  const [dpmDetail, setDpmDetail] = useState('');

  useEffect(() => {
    if (showNewGroup) { setPanel('new'); setSelectedGid(null); onNewGroupDone(); }
  }, [showNewGroup]);

  const g = selectedGid ? allGroups[selectedGid] : null;

  const myBal = g ? getNetBalance(g, uid) : 0;
  const myDebts = g ? getMyDebts(g, uid) : {};
  const myCredits = g ? getMyCredits(g, uid) : {};
  const plan = g ? computeSettlementPlan(g) : [];
  const memberUids = g ? Object.keys(g.members || {}) : [];
  const perPersonPreview = expAmount && g
    ? round2(parseFloat(expAmount) / memberUids.length)
    : 0;

  const handleCreateGroup = async () => {
    // Check if group name is empty
    if (!ngName.trim()) { showToast('Group name is required', 'error'); return; }

    // Add creator to group members
    Object.entries(ngSelected).forEach(([connUid, checked]) => {
      if (checked && allConnections[connUid]) {
        members[connUid] = {
          name: allConnections[connUid].name || '',
          email: allConnections[connUid].email || '',
          username: allConnections[connUid].username || '',
        };
      }
    });
    try {
      setLoading(true);
      const res = await createGroup({ name: ngName.trim(), desc: ngDesc.trim(), members, createdBy: uid });
      setNgName(''); setNgDesc(''); setNgSelected({});
      showToast(`"${ngName}" created! `, 'success');
      setSelectedGid(res.groupId);
      setPanel('detail');
      setGroupTab('balances');
      onGroupsRefresh();
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    // Validate expense input fields
    if (!expDesc.trim()) { showToast('Description is required', 'error'); return; }
    const amount = parseFloat(expAmount);
    if (!amount || amount <= 0) { showToast('Enter a valid amount', 'error'); return; }
    if (!memberUids.length) { showToast('Group has no members', 'error'); return; }
    try {
      setLoading(true);
      const res = await createExpense(selectedGid, {
        desc: expDesc.trim(), amount, paidBy: uid, splitWith: memberUids,
      });
      // Update local wallet state immediately
      setUserData(d => ({ ...d, balance: res.payerNewBalance, totalSpent: round2((d.totalSpent || 0) + res.perPerson) }));
      setExpDesc(''); setExpAmount(''); setShowExpForm(false);
      showToast(` Added ${fmt(amount)} — ${fmt(res.perPerson)}/person`, 'success');
      onGroupsRefresh();
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSettle = async (creditorUid, amount) => {
    const creditorName = (g.members?.[creditorUid] || {}).name || '?';
    if ((userData?.balance || 0) < amount) {
      showToast(`Insufficient balance. You have ${fmt(userData.balance)}, need ${fmt(amount)}`, 'error');
      return;
    }
    if (!confirm(`Pay ${fmt(amount)} to ${creditorName}?`)) return;
    try {
      setLoading(true);
      const res = await createPayment(selectedGid, {
        from: uid, to: creditorUid, amount, note: 'Settled via E-Split',
      });
      setUserData(d => ({ ...d, balance: res.fromNewBalance }));
      showToast(` Paid ${fmt(amount)} to ${creditorName}!`, 'success');
      onGroupsRefresh();
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSettleAll = async () => {
    // Calculate total debt
    const totalOwe = round2(Object.values(myDebts).reduce((a, b) => a + b, 0));

    // Return if total debt is zero
    if (totalOwe < 0.01) { showToast('Nothing to settle!', 'info'); return; }
    if ((userData?.balance || 0) < totalOwe) {
      showToast(`Need ${fmt(totalOwe)}, wallet has ${fmt(userData?.balance)}`, 'error');
      return;
    }
    const names = Object.entries(myDebts).map(([cUid, amt]) =>
      `${(g.members?.[cUid] || {}).name || '?'} (${fmt(amt)})`
    ).join(', ');
    if (!confirm(`Settle ALL debts?\n${names}\nTotal: ${fmt(totalOwe)}`)) return;
    try {
      setLoading(true);
      let newBal = userData.balance;
      for (const [creditorUid, amount] of Object.entries(myDebts)) {
        // Process each payment
        const res = await createPayment(selectedGid, {
          from: uid, to: creditorUid, amount, note: 'Settle all',
        });
        newBal = res.fromNewBalance;
      }
      setUserData(d => ({ ...d, balance: newBal }));
      showToast(` All settled! ${fmt(totalOwe)} paid.`, 'success');
      onGroupsRefresh();
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectPay = async () => {
    if (!dpmMerchant.trim()) { showToast('Enter what you paid for', 'error'); return; }
    const amount = parseFloat(dpmAmount);

    // Validate payment details
    if (!amount || amount <= 0) { showToast('Enter valid amount', 'error'); return; }
    if (!dpmMethod) { showToast('Select payment method', 'error'); return; }

    // Check wallet balance
    if ((userData?.balance || 0) < amount) {
      showToast(`Insufficient balance. Have ${fmt(userData.balance)}, need ${fmt(amount)}`, 'error');
      return;
    }
    const methodMap = { esewa: 'eSewa', bank: 'Bank Transfer', qr: 'QR Code', cash: 'Cash' };
    try {
      setLoading(true);
      const res = await createExpense(selectedGid, {
        desc: dpmMerchant.trim(),
        amount,
        paidBy: uid,
        splitWith: memberUids,
        isDirectPayment: true,
        paymentMethod: dpmMethod,
        paymentDetail: dpmDetail.trim() || null,
      });
      setUserData(d => ({ ...d, balance: res.payerNewBalance }));
      setDpmMerchant(''); setDpmAmount(''); setDpmMethod(''); setDpmDetail('');
      setShowDirPay(false);
      showToast(`Paid ${fmt(amount)} for ${dpmMerchant} via ${methodMap[dpmMethod]} `, 'success');
      onGroupsRefresh();
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const methodMap = { esewa: 'eSewa', bank: 'Bank Transfer', qr: 'QR Code', cash: 'Cash' };

  return (
    <div className="split-layout">

      {/* ── LEFT: groups list ── */}
      <div className="groups-panel">
        <div className="section-title" style={{ marginBottom: 10 }}>My E-Splits</div>
        {!Object.keys(allGroups).length ? (
          <div className="empty"><div className="empty-icon"></div><div className="empty-sub">No E-Splits yet</div></div>
        ) : (
          Object.entries(allGroups).map(([gid, grp]) => {
            const mc = Object.keys(grp.members || {}).length;
            const bal = getNetBalance(grp, uid);
            let badge;
            if (Math.abs(bal) < 0.01) badge = <span className="badge badge-green">Settled</span>;
            else if (bal < 0) badge = <span className="badge badge-red">Owe {fmt(-bal)}</span>;
            else badge = <span className="badge badge-blue">+{fmt(bal)}</span>;
            return (
              <div
                key={gid}
                className={`group-item${selectedGid === gid ? ' selected' : ''}`}
                onClick={() => { setSelectedGid(gid); setPanel('detail'); setGroupTab('balances'); setShowExpForm(false); }}
              >
                <div className="group-name">{grp.name}</div>
                <div className="group-meta"><span>{mc} member{mc !== 1 ? 's' : ''}</span>{badge}</div>
              </div>
            );
          })
        )}
        <button className="btn btn-gold" style={{ width: '100%', marginTop: 10 }}
          onClick={() => { setPanel('new'); setSelectedGid(null); }}>
          + New E-Split
        </button>
      </div>

      {/* ── RIGHT: detail panel ── */}
      <div className="detail-panel">

        {/* EMPTY */}
        {panel === 'empty' && (
          <div className="empty" style={{ padding: '60px 20px' }}>
            <div className="empty-icon"></div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginTop: 7 }}>Select an E-Split</div>
            <div className="empty-sub" style={{ marginTop: 3 }}>Choose a group or create a new one</div>
          </div>
        )}

        {/* NEW GROUP FORM */}
        {panel === 'new' && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <div className="group-detail-title">Create New E-Split</div>
              <div className="group-detail-sub">Only your connections can be added as members</div>
            </div>
            <div className="fgrp">
              <label>Split Name</label>
              <input type="text" value={ngName} onChange={e => setNgName(e.target.value)} placeholder="e.g. Road Trip, House Rent…" />
            </div>
            <div className="fgrp">
              <label>Description (optional)</label>
              <input type="text" value={ngDesc} onChange={e => setNgDesc(e.target.value)} placeholder="What is this for?" />
            </div>
            <div className="fgrp">
              <label>Add Members from Connections</label>
              {!Object.keys(allConnections).length ? (
                <div style={{ fontSize: 10, color: 'var(--text3)', padding: 7 }}>
                  No connections yet — go to People tab to add friends.
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 5 }}>
                  {Object.entries(allConnections).map(([connUid, u]) => (
                    <div
                      key={connUid}
                      className={`member-check${ngSelected[connUid] ? ' checked' : ''}`}
                      onClick={() => setNgSelected(p => ({ ...p, [connUid]: !p[connUid] }))}
                    >
                      {u.name || u.username || connUid}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="btn-row">
              <button className="btn btn-gold" onClick={handleCreateGroup} disabled={loading}>
                {loading ? 'Creating…' : 'Create E-Split'}
              </button>
              <button className="btn btn-ghost" onClick={() => setPanel('empty')}>Cancel</button>
            </div>
          </div>
        )}

        {/* GROUP DETAIL */}
        {panel === 'detail' && g && (
          <div>
            {/* header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 7 }}>
              <div>
                <div className="group-detail-title">{g.name}</div>
                <div className="group-detail-sub">{memberUids.length} members · {fmtDate(g.createdAt)}</div>
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                <button className="btn btn-outline btn-sm" onClick={() => setShowExpForm(v => !v)}>+ Expense</button>
                <button className="btn btn-blue btn-sm" onClick={() => setShowDirPay(true)}>Record Payment</button>
                {myBal < -0.01 && (
                  <button className="btn btn-gold btn-sm" onClick={handleSettleAll} disabled={loading}>
                    Settle All
                  </button>
                )}
                {myBal > 0.01 && (
                  <button className="btn btn-collect btn-sm"
                    onClick={() => showToast('Reminder sent to friends! ', 'success')}>
                    Remind
                  </button>
                )}
              </div>
            </div>

            {/* balance banner */}
            <div className={`balance-banner ${Math.abs(myBal) < 0.01 ? 'settled' : myBal > 0 ? 'owed' : 'owe'}`}>
              <div className="banner-icon">{Math.abs(myBal) < 0.01 ? '' : myBal > 0 ? '' : ''}</div>
              <div className="banner-content">
                <div className="banner-text">
                  {Math.abs(myBal) < 0.01
                    ? 'All settled up!'
                    : myBal > 0
                      ? `You are owed ${fmt(myBal)}`
                      : `You owe ${fmt(-myBal)}`}
                </div>
                <div className="banner-sub">
                  {Math.abs(myBal) < 0.01
                    ? 'Everyone has paid their share'
                    : myBal > 0
                      ? 'Friends still need to pay you back'
                      : 'Use Settle All to clear your debt instantly'}
                </div>
              </div>
            </div>

            {/* add expense inline form */}
            {showExpForm && (
              <div className="inline-form">
                <div className="inline-form-title">
                  <span>Add Expense — I Paid</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowExpForm(false)}></button>
                </div>
                <div style={{ background: 'linear-gradient(135deg,var(--gold-dim),rgba(200,134,26,0.03))', border: '1px solid rgba(200,134,26,0.18)', borderRadius: 'var(--r)', padding: '9px 12px', marginBottom: 10, fontSize: 11, color: 'var(--gold)', fontWeight: 500 }}>
                  Use this when <b>you paid</b> for something and want to split the cost equally.
                </div>
                <div className="form-row">
                  <div className="fgrp">
                    <label>Description</label>
                    <input type="text" value={expDesc} onChange={e => setExpDesc(e.target.value)} placeholder="e.g. Hotel, Dinner, Fuel…" />
                  </div>
                  <div className="fgrp">
                    <label>Total Amount (NPR)</label>
                    <input type="number" value={expAmount} onChange={e => setExpAmount(e.target.value)} placeholder="0.00" min="0" step="0.01" />
                  </div>
                </div>
                {parseFloat(expAmount) > 0 && memberUids.length > 0 && (
                  <div className="split-preview">
                    <div className="split-preview-label">Split equally among {memberUids.length} members — each pays</div>
                    <div className="split-preview-val">{fmt(perPersonPreview)}</div>
                  </div>
                )}
                <div className="btn-row" style={{ marginTop: 10 }}>
                  <button className="btn btn-gold" onClick={handleAddExpense} disabled={loading}>
                    {loading ? 'Adding…' : 'Add Expense'}
                  </button>
                  <button className="btn btn-ghost" onClick={() => setShowExpForm(false)}>Cancel</button>
                </div>
              </div>
            )}

            {/* balance summary boxes */}
            {(Object.keys(myCredits).length > 0 || Object.keys(myDebts).length > 0) && (
              <div style={{ marginBottom: 16 }}>
                {/* credits — people who owe me */}
                {Object.keys(myCredits).length > 0 && (
                  <div style={{ background: 'linear-gradient(135deg,var(--green-dim),rgba(13,158,78,0.02))', border: '1px solid rgba(13,158,78,0.2)', borderRadius: 'var(--r)', padding: '12px 14px', marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.6px', fontWeight: 700, marginBottom: 2 }}>Friends Owe You</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--green)', fontFamily: "'JetBrains Mono',monospace" }}>
                          {fmt(round2(Object.values(myCredits).reduce((a, b) => a + b, 0)))}
                        </div>
                      </div>
                      <button className="btn btn-sm" style={{ background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(13,158,78,0.2)' }}
                        onClick={() => showToast('Reminder sent! ', 'success')}>Remind All</button>
                    </div>
                    {Object.entries(myCredits).map(([debtorUid, amount]) => {
                      const name = (g.members?.[debtorUid] || {}).name || '?';
                      return (
                        <div key={debtorUid} className="settle-item collect-item" style={{ marginBottom: 5 }}>
                          <div className="mini-av" style={{ background: getAvatarColor(debtorUid), width: 34, height: 34, borderRadius: 9, fontSize: 11, marginRight: 10, flexShrink: 0 }}>
                            {getInitials(name)}
                          </div>
                          <div className="settle-item-info">
                            <div className="settle-item-name">{name} owes you</div>
                            <div className="settle-item-desc">{fmt(amount)} outstanding</div>
                          </div>
                          <div className="settle-item-amount">{fmt(amount)}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* debts — who I owe */}
                {Object.keys(myDebts).length > 0 && (
                  <div style={{ background: 'linear-gradient(135deg,var(--red-dim),rgba(204,62,62,0.02))', border: '1px solid rgba(204,62,62,0.18)', borderRadius: 'var(--r)', padding: '12px 14px', marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.6px', fontWeight: 700, marginBottom: 2 }}>You Owe</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--red)', fontFamily: "'JetBrains Mono',monospace" }}>
                          {fmt(round2(Object.values(myDebts).reduce((a, b) => a + b, 0)))}
                        </div>
                      </div>
                      <button className="btn btn-gold btn-sm" onClick={handleSettleAll} disabled={loading}>Pay All</button>
                    </div>
                    {Object.entries(myDebts).map(([creditorUid, amount]) => {
                      const name = (g.members?.[creditorUid] || {}).name || '?';
                      return (
                        <div key={creditorUid} className="settle-item owe-item" style={{ marginBottom: 5 }}>
                          <div className="mini-av" style={{ background: getAvatarColor(creditorUid), width: 34, height: 34, borderRadius: 9, fontSize: 11, marginRight: 10, flexShrink: 0 }}>
                            {getInitials(name)}
                          </div>
                          <div className="settle-item-info">
                            <div className="settle-item-name">Pay {name}</div>
                            <div className="settle-item-desc">{fmt(amount)} outstanding</div>
                          </div>
                          <div className="settle-item-amount">{fmt(amount)}</div>
                          <button className="settle-btn" onClick={() => handleSettle(creditorUid, amount)} disabled={loading}>
                            Pay Now
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* members chips */}
            <div className="section-title" style={{ marginBottom: 7 }}>Members</div>
            <div className="members-row">
              {Object.entries(g.members || {}).map(([mid, m], i) => (
                <div key={mid} className="member-chip">
                  <div className="mini-av" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>{getInitials(m.name)}</div>
                  <span>{m.name}</span>
                  {mid === uid && <span className="badge badge-gold" style={{ marginLeft: 3 }}>You</span>}
                </div>
              ))}
            </div>
            <hr />

            {/* tabs */}
            <div className="tabs-bar">
              {['balances', 'expenses', 'payments', 'activity'].map(t => (
                <button key={t} className={`tab-btn${groupTab === t ? ' active' : ''}`} onClick={() => setGroupTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* ── BALANCES TAB ── */}
            {groupTab === 'balances' && (
              <div>
                <div className="net-balance-box">
                  <div className="net-balance-header">Your Net Position in This Split</div>
                  <div className="net-row">
                    <span style={{ color: 'var(--text2)' }}>Friends owe you</span>
                    <span style={{ fontWeight: 700, color: 'var(--green)', fontFamily: "'JetBrains Mono',monospace" }}>
                      +{fmt(round2(Object.values(myCredits).reduce((a, b) => a + b, 0)))}
                    </span>
                  </div>
                  <div className="net-row">
                    <span style={{ color: 'var(--text2)' }}>You owe others</span>
                    <span style={{ fontWeight: 700, color: 'var(--red)', fontFamily: "'JetBrains Mono',monospace" }}>
                      -{fmt(round2(Object.values(myDebts).reduce((a, b) => a + b, 0)))}
                    </span>
                  </div>
                  <div className="net-row" style={{ borderBottom: 'none' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>Net Balance</span>
                    <span style={{ fontWeight: 800, color: myBal >= 0 ? 'var(--green)' : 'var(--red)', fontFamily: "'JetBrains Mono',monospace" }}>
                      {myBal >= 0 ? '+' : ''}{fmt(myBal)}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text3)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.6px' }}>
                  Minimum Settlement Plan — Who Pays Whom
                </div>
                {!plan.length ? (
                  <div className="empty"><div className="empty-icon"></div><div className="empty-sub">All balances are zero — fully settled!</div></div>
                ) : (
                  plan.map((o, i) => {
                    const fn = (g.members[o.from] || {}).name || o.from;
                    const tn = (g.members[o.to] || {}).name || o.to;
                    const isFrom = o.from === uid;
                    const isTo = o.to === uid;
                    return (
                      <div key={i} className="owe-row">
                        <div className="owe-person" style={isFrom ? { color: 'var(--red)', fontWeight: 700 } : {}}>{isFrom ? ' You' : fn}</div>
                        <div style={{ color: 'var(--text3)', fontSize: 12 }}>→</div>
                        <div className="owe-person" style={isTo ? { color: 'var(--green)', fontWeight: 700 } : {}}>{isTo ? ' You' : tn}</div>
                        <div className="owe-amount">{fmt(o.amount)}</div>
                        {isFrom && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleSettle(o.to, o.amount)} disabled={loading}>
                            Settle
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ── EXPENSES TAB ── */}
            {groupTab === 'expenses' && (
              <div>
                {!Object.values(g.expenses || {}).length ? (
                  <div className="empty"><div className="empty-icon"></div><div className="empty-sub">No expenses yet</div></div>
                ) : (
                  Object.values(g.expenses || {})
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map((e, i) => {
                      const pn = (g.members[e.paidBy] || {}).name || e.paidBy;
                      const isMe = e.paidBy === uid;
                      const sw = e.splitWith?.length ? e.splitWith : memberUids;
                      const pp = round2(e.amount / sw.length);
                      const isDirect = e.isDirectPayment || false;
                      return (
                        <div key={i} className="exp-row" style={isDirect ? { border: '1px solid rgba(61,111,240,0.15)', background: 'linear-gradient(135deg,rgba(61,111,240,0.03),var(--surface2))' } : {}}>
                          <div className="exp-row-header">
                            <div>
                              <div className="exp-desc">{e.desc}</div>
                              <div className="exp-by">
                                {isDirect
                                  ? ` Paid via ${methodMap[e.paymentMethod] || e.paymentMethod}${e.paymentDetail ? ` (${e.paymentDetail})` : ''}`
                                  : isMe ? ' You paid' : `Paid by ${pn}`}
                                {' · '}{fmtDate(e.createdAt)}
                              </div>
                            </div>
                            <div>
                              <div className="exp-amount">{fmt(e.amount)}</div>
                              <div className="exp-per">{fmt(pp)}/person · {sw.length} people</div>
                            </div>
                          </div>
                          {isMe && sw.filter(m => m !== uid).length > 0 && !isDirect && (
                            <div style={{ marginTop: 7 }}>
                              <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 4, fontWeight: 700 }}> Collecting from:</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                {sw.filter(m => m !== uid).map((mid, j) => {
                                  const name = (g.members[mid] || {}).name || 'User';
                                  return (
                                    <span key={j} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px 3px 3px', borderRadius: 20, fontSize: 9, fontWeight: 600, background: 'var(--red-dim)', border: '1px solid rgba(204,62,62,0.2)', color: 'var(--red)' }}>
                                      <span style={{ width: 16, height: 16, borderRadius: '50%', background: AVATAR_COLORS[j % AVATAR_COLORS.length], display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 6, fontWeight: 700, color: '#000' }}>
                                        {getInitials(name)}
                                      </span>
                                      {name}: {fmt(pp)}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {!isMe && sw.includes(uid) && (
                            <div style={{ marginTop: 7, fontSize: 10, color: 'var(--red)', fontWeight: 600 }}>
                              Your share: {fmt(pp)}
                            </div>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            )}

            {/* ── PAYMENTS TAB ── */}
            {groupTab === 'payments' && (
              <div>
                {!Object.values(g.payments || {}).length ? (
                  <div className="empty"><div className="empty-icon"></div><div className="empty-sub">No payments recorded yet</div></div>
                ) : (
                  Object.values(g.payments || {})
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map((p, i) => {
                      const fn = (g.members[p.from] || {}).name || '?';
                      const tn = (g.members[p.to] || {}).name || '?';
                      const isFromMe = p.from === uid;
                      const isToMe = p.to === uid;
                      return (
                        <div key={i} className="activity-item">
                          <div className="activity-icon"></div>
                          <div>
                            <div className="activity-name">{isFromMe ? 'You' : fn} → {isToMe ? 'You' : tn}</div>
                            <div className="activity-desc">{p.note} · {fmtDate(p.createdAt)}</div>
                          </div>
                          <div>
                            <div className={`activity-val ${isToMe ? 'pos' : 'neg'}`}>
                              {isToMe ? '+' : '-'}{fmt(p.amount)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            )}

            {/* ── ACTIVITY TAB ── */}
            {groupTab === 'activity' && (
              <div>
                {(() => {
                  const acts = [
                    ...Object.values(g.expenses || {}).map(e => ({ ...e, _type: 'expense' })),
                    ...Object.values(g.payments || {}).map(p => ({ ...p, _type: 'payment' })),
                  ].sort((a, b) => b.createdAt - a.createdAt);
                  if (!acts.length) return <div className="empty"><div className="empty-icon"></div><div className="empty-sub">No activity yet</div></div>;
                  return acts.map((act, i) => {
                    if (act._type === 'expense') {
                      const pn = (g.members[act.paidBy] || {}).name || '?';
                      const sw = act.splitWith || memberUids;
                      const pp = round2(act.amount / (sw.length || 1));
                      return (
                        <div key={i} className="activity-item">
                          <div className="activity-icon">{act.isDirectPayment ? '' : ''}</div>
                          <div>
                            <div className="activity-name">{act.paidBy === uid ? 'You' : pn} · {act.desc}</div>
                            <div className="activity-desc">{sw.length} members · {fmt(pp)} each · {fmtDate(act.createdAt)}</div>
                          </div>
                          <div><div className="activity-val pos">{fmt(act.amount)}</div></div>
                        </div>
                      );
                    } else {
                      const fn = (g.members[act.from] || {}).name || '?';
                      const tn = (g.members[act.to] || {}).name || '?';
                      const isFromMe = act.from === uid;
                      const isToMe = act.to === uid;
                      return (
                        <div key={i} className="activity-item">
                          <div className="activity-icon"></div>
                          <div>
                            <div className="activity-name">{isFromMe ? 'You' : fn} → {isToMe ? 'You' : tn}</div>
                            <div className="activity-desc">{act.note} · {fmtDate(act.createdAt)}</div>
                          </div>
                          <div>
                            <div className={`activity-val ${isToMe ? 'pos' : 'neg'}`}>{isToMe ? '+' : '-'}{fmt(act.amount)}</div>
                          </div>
                        </div>
                      );
                    }
                  });
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── DIRECT PAYMENT MODAL ── */}
      {showDirPay && (
        <div className="pay-overlay" onClick={e => e.target === e.currentTarget && setShowDirPay(false)}>
          <div className="pay-modal">
            <div style={{ padding: '0 0 16px 0', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
              <div className="pay-modal-title">Record a Trip Payment</div>
              <div className="pay-modal-sub">Log a payment you made on behalf of the group — cost will be split equally</div>
            </div>
            <div className="fgrp">
              <label>What did you pay for? *</label>
              <input type="text" value={dpmMerchant} onChange={e => setDpmMerchant(e.target.value)} placeholder="e.g. Hotel, Lunch, Taxi, Tickets…" />
            </div>
            <div className="fgrp">
              <label>Total Amount (NPR) *</label>
              <input type="number" value={dpmAmount} onChange={e => setDpmAmount(e.target.value)} placeholder="0.00" min="0" step="0.01" />
            </div>
            <div className="fgrp">
              <label>Payment Method *</label>
              <select value={dpmMethod} onChange={e => setDpmMethod(e.target.value)}>
                <option value="">— Select —</option>
                <option value="esewa">eSewa</option>
                <option value="bank">Bank Transfer</option>
                <option value="qr">QR Code</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            {(dpmMethod === 'esewa' || dpmMethod === 'bank') && (
              <div className="fgrp">
                <label>{dpmMethod === 'esewa' ? 'eSewa Phone Number' : 'Bank Account Number'}</label>
                <input type="text" value={dpmDetail} onChange={e => setDpmDetail(e.target.value)}
                  placeholder={dpmMethod === 'esewa' ? '98XXXXXXXX' : 'Account number'} />
              </div>
            )}
            {parseFloat(dpmAmount) > 0 && memberUids.length > 0 && (
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', marginBottom: 10 }}>
                  Split among {memberUids.length} members:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {Object.entries(g?.members || {}).map(([muid, m]) => (
                    <span key={muid} style={{ background: muid === uid ? 'var(--blue-dim)' : 'var(--surface3)', padding: '4px 10px', borderRadius: 5, fontSize: 10, fontWeight: 500, border: muid === uid ? '1px solid rgba(61,111,240,0.2)' : 'none' }}>
                      {m.name}{muid === uid ? ' (You)' : ''}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Each person pays:</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--green)', fontFamily: "'JetBrains Mono',monospace" }}>
                  {fmt(round2(parseFloat(dpmAmount) / memberUids.length))}
                </div>
              </div>
            )}
            <div style={{ background: 'var(--blue-dim)', border: '1px solid rgba(61,111,240,0.2)', borderRadius: 'var(--r-sm)', padding: '9px 12px', fontSize: 10, color: 'var(--blue)', fontWeight: 500, marginBottom: 12 }}>
              Your share ({g ? fmt(round2(parseFloat(dpmAmount || 0) / memberUids.length)) : '0.00'}) will be deducted from your wallet immediately.
            </div>
            <div className="btn-row">
              <button className="btn btn-blue" style={{ flex: 1 }} onClick={handleDirectPay} disabled={loading}>
                {loading ? 'Recording…' : 'Record Payment'}
              </button>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowDirPay(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
