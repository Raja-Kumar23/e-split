/**
 * User Dashboard Component.
 * Aggregates global statistics, wallet balances, recent activity, and pending contributions.
 */
'use client';
import { useAuth } from './AuthProvider';
import { fmt, fmtDate, getInitials, getAvatarColor, round2, getMyCredits, getMyDebts, getNetBalance } from '../lib/calculations';

export default function Dashboard({ allGroups, onNav }) {
  const { currentUser, userData } = useAuth();
  const uid = currentUser?.uid;

  // Calculate total money stats across all groups
  let totalOwed = 0, totalOwe = 0, totalSpent = 0;

  Object.values(allGroups).forEach(g => {
    Object.values(g.expenses || {}).forEach(exp => {
      if (exp.paidBy === uid) totalSpent = round2(totalSpent + exp.amount);
    });
    const credits = getMyCredits(g, uid);
    const debts   = getMyDebts(g, uid);
    Object.values(credits).forEach(a => { totalOwed = round2(totalOwed + a); });
    Object.values(debts).forEach(a => { totalOwe   = round2(totalOwe   + a); });
  });

  const contribs = {};
  Object.values(allGroups).forEach(g => {
    const credits = getMyCredits(g, uid);
    Object.entries(credits).forEach(([debtorUid, amount]) => {
      if (!contribs[debtorUid]) {
        contribs[debtorUid] = {
          name:  (g.members?.[debtorUid] || {}).name || 'User',
          total: 0,
          count: 0,
        };
      }
      contribs[debtorUid].total = round2(contribs[debtorUid].total + amount);
      contribs[debtorUid].count += 1;
    });
  });
  const contribEntries = Object.entries(contribs).filter(([, c]) => c.total > 0.01);

  // Create activity feed array
  const feed = [];
  Object.values(allGroups).forEach(g => {
    Object.values(g.expenses || {}).forEach(e => {
      const isMe = e.paidBy === uid;
      const sw = e.splitWith || [];
      if (isMe) {
        const others = sw.filter(m => m !== uid).length;
        if (others > 0) {
          feed.push({
            icon: '', name: e.desc,
            desc: `in ${g.name} — you paid for ${others} other${others !== 1 ? 's' : ''}`,
            val: '+' + fmt(e.amount), pos: true, time: e.createdAt,
          });
        }
      } else if (sw.includes(uid)) {
        const share = round2(e.amount / (sw.length || 1));
        feed.push({
          icon: '', name: e.desc,
          desc: `in ${g.name} — your share`,
          val: '-' + fmt(share), pos: false, time: e.createdAt,
        });
      }
    });
    Object.values(g.payments || {}).forEach(p => {
      const isFrom = p.from === uid, isTo = p.to === uid;
      if (!isFrom && !isTo) return;
      const fn = (g.members?.[p.from] || {}).name || '?';
      const tn = (g.members?.[p.to]   || {}).name || '?';
      feed.push({
        icon: '',
        name: isFrom ? `You → ${tn}` : `${fn} → You`,
        desc: `Payment in ${g.name}`,
        val: (isTo ? '+' : '-') + fmt(p.amount),
        pos: isTo, time: p.createdAt,
      });
    });
  });
  feed.sort((a, b) => b.time - a.time);

  return (
    <div>
      <div className="stat-row">
        <div className="stat-card gold">
          <div className="stat-label">Wallet Balance</div>
          <div className="stat-val">{fmt(userData?.balance || 0)}</div>
          <div className="stat-sub">Available</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Owed to You</div>
          <div className="stat-val">{fmt(totalOwed)}</div>
          <div className="stat-sub">From friends</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">You Owe</div>
          <div className="stat-val">{fmt(totalOwe)}</div>
          <div className="stat-sub">To friends</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Total Spent</div>
          <div className="stat-val">{fmt(userData?.totalSpent || 0)}</div>
          <div className="stat-sub">All time</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-chip"></div>
          <div>
            <div className="dash-card-balance-label">Current Balance</div>
            <div className="dash-card-balance">{fmt(userData?.balance || 0)}</div>
          </div>
          <div className="dash-card-number">Student Account</div>
          <div className="dash-card-footer">
            <div>
              <div className="dash-card-name">{(userData?.name || 'User').toUpperCase()}</div>
              <div className="dash-card-handle">@{userData?.username || 'user'} · Internal Wallet</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '.5px', marginBottom: 2 }}>Status</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#fff', fontWeight: 600 }}>Active</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 10 }}>Quick Actions</div>
          <div className="quick-action" onClick={() => onNav('esplit', true)}>
            <div className="quick-action-icon"></div>
            <div>
              <div className="quick-action-title">Create E-Split</div>
              <div className="quick-action-sub">Split bills with friends</div>
            </div>
          </div>
          <div className="quick-action" onClick={() => onNav('connections')}>
            <div className="quick-action-icon"></div>
            <div>
              <div className="quick-action-title">Add Connection</div>
              <div className="quick-action-sub">Connect via @username</div>
            </div>
          </div>
          <div className="quick-action" onClick={() => onNav('gifts')}>
            <div className="quick-action-icon"></div>
            <div>
              <div className="quick-action-title">Send Gift Card</div>
              <div className="quick-action-sub">Surprise a friend</div>
            </div>
          </div>
        </div>
      </div>

      {contribEntries.length > 0 && (
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="section-header">
            <div className="section-title">Waiting on Contributions</div>
          </div>
          {contribEntries.map(([debtorUid, data]) => (
            <div key={debtorUid} className="activity-item">
              <div className="activity-icon" style={{ background: getAvatarColor(debtorUid), color: '#000' }}>
                {getInitials(data.name)}
              </div>
              <div>
                <div className="activity-name">{data.name}</div>
                <div className="activity-desc">Owes you across {data.count} group{data.count !== 1 ? 's' : ''}</div>
              </div>
              <div>
                <div className="activity-val pos">{fmt(data.total)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="section-header">
          <div className="section-title">Recent Activity</div>
        </div>
        {!feed.length ? (
          <div className="empty"><div className="empty-icon"></div><div className="empty-sub">No activity yet</div></div>
        ) : (
          feed.slice(0, 10).map((item, i) => (
            <div key={i} className="activity-item">
              <div className="activity-icon">{item.icon}</div>
              <div>
                <div className="activity-name">{item.name}</div>
                <div className="activity-desc">{item.desc}</div>
              </div>
              <div>
                <div className={`activity-val ${item.pos ? 'pos' : 'neg'}`}>{item.val}</div>
                <div className="activity-time">{fmtDate(item.time)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
