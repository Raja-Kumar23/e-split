/**
 * Core Financial Calculation Engine.
 * Manages expense splitting, balance computation, and settlement algorithms.
 * Used consistently across server routes and client components.
 */

export const round2 = (n) => Math.round(n * 100) / 100;

export const fmt = (n) => parseFloat(n || 0).toFixed(2);
export const fmtDate = (ts) =>
  ts
    ? new Date(ts).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

export const getInitials = (name) =>
  (name || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export const AVATAR_COLORS = [
  '#e8a020', '#22c97a', '#5b8af0', '#a06af0',
  '#f06090', '#20c8c0', '#f05060', '#f0a030',
];

export const getAvatarColor = (uid) =>
  AVATAR_COLORS[(uid || '').charCodeAt(0) % AVATAR_COLORS.length];

export const generateUsername = (name) => {
  const clean = (name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
  return (clean.slice(0, 8) || 'user') + Math.floor(100 + Math.random() * 900);
};

function resolveParticipants(exp, allMemberUids) {
  if (Array.isArray(exp.splitWith) && exp.splitWith.length > 0) {
    return exp.splitWith;
  }
  return allMemberUids;
}

export function computeRawBalances(group) {
  const memberUids = Object.keys(group.members || {});
  const bals = {};
  
  // Set initial balance to zero
  memberUids.forEach((m) => { bals[m] = 0; });

  for (const exp of Object.values(group.expenses || {})) {
    if (!bals.hasOwnProperty(exp.paidBy)) continue;
    const sw = resolveParticipants(exp, memberUids);
    if (sw.length === 0) continue;
    
    // Calculate share for each person
    const share = round2(exp.amount / sw.length);

    const otherCount = sw.filter((m) => m !== exp.paidBy).length;
    bals[exp.paidBy] = round2(bals[exp.paidBy] + otherCount * share);

    for (const mid of sw) {
      if (mid !== exp.paidBy && bals.hasOwnProperty(mid)) {
        bals[mid] = round2(bals[mid] - share);
      }
    }
  }

  for (const pay of Object.values(group.payments || {})) {
    if (bals.hasOwnProperty(pay.from)) bals[pay.from] = round2(bals[pay.from] - pay.amount);
    if (bals.hasOwnProperty(pay.to))   bals[pay.to]   = round2(bals[pay.to]   + pay.amount);
  }

  return bals;
}

export function getNetBalance(group, uid) {
  const bals = computeRawBalances(group);
  return round2(bals[uid] || 0);
}

export function getMyDebts(group, uid) {
  const memberUids = Object.keys(group.members || {});
  const owed = {}; // { creditorUid: raw amount }

  for (const exp of Object.values(group.expenses || {})) {
    if (exp.paidBy === uid) continue; // I paid — I'm the creditor here
    const sw = resolveParticipants(exp, memberUids);
    if (!sw.includes(uid) || sw.length === 0) continue;
    const share = round2(exp.amount / sw.length);
    owed[exp.paidBy] = round2((owed[exp.paidBy] || 0) + share);
  }

  for (const pay of Object.values(group.payments || {})) {
    if (pay.from === uid && pay.to) {
      owed[pay.to] = round2((owed[pay.to] || 0) - pay.amount);
    }
  }

  const result = {};
  for (const [creditor, amt] of Object.entries(owed)) {
    if (amt > 0.005) result[creditor] = round2(amt);
  }
  return result;
}

export function getMyCredits(group, uid) {
  const memberUids = Object.keys(group.members || {});
  const owed = {}; // { debtorUid: raw amount }

  for (const exp of Object.values(group.expenses || {})) {
    if (exp.paidBy !== uid) continue; // Only expenses I paid
    const sw = resolveParticipants(exp, memberUids);
    if (sw.length === 0) continue;
    const share = round2(exp.amount / sw.length);
    for (const mid of sw) {
      if (mid !== uid) {
        owed[mid] = round2((owed[mid] || 0) + share);
      }
    }
  }

  for (const pay of Object.values(group.payments || {})) {
    if (pay.to === uid && pay.from) {
      owed[pay.from] = round2((owed[pay.from] || 0) - pay.amount);
    }
  }

  const result = {};
  for (const [debtor, amt] of Object.entries(owed)) {
    if (amt > 0.005) result[debtor] = round2(amt);
  }
  return result;
}

export function computeSettlementPlan(group) {
  // Calculate minimum settlement transactions
  const bals = computeRawBalances(group);

  const creditors = []; // Users who are owed money
  const debtors   = []; // Users who owe money

  for (const [uid, bal] of Object.entries(bals)) {
    if (bal > 0.005)  creditors.push({ uid, amt: bal });
    else if (bal < -0.005) debtors.push({ uid, amt: -bal }); // store as positive
  }

  creditors.sort((a, b) => b.amt - a.amt);
  debtors.sort((a, b) => b.amt - a.amt);

  const transfers = [];
  let i = 0, j = 0;

  while (i < creditors.length && j < debtors.length) {
    const transfer = Math.min(creditors[i].amt, debtors[j].amt);
    if (transfer > 0.005) {
      transfers.push({
        from:   debtors[j].uid,
        to:     creditors[i].uid,
        amount: round2(transfer),
      });
    }
    creditors[i].amt = round2(creditors[i].amt - transfer);
    debtors[j].amt   = round2(debtors[j].amt   - transfer);
    if (creditors[i].amt < 0.005) i++;
    if (debtors[j].amt   < 0.005) j++;
  }

  return transfers;
}

export function getGroupSummary(group, uid) {
  const netBal  = getNetBalance(group, uid);
  const debts   = getMyDebts(group, uid);
  const credits = getMyCredits(group, uid);
  const plan    = computeSettlementPlan(group);

  const totalOwed = round2(Object.values(credits).reduce((a, b) => a + b, 0));
  const totalOwe  = round2(Object.values(debts).reduce((a, b) => a + b, 0));

  return { netBal, debts, credits, plan, totalOwed, totalOwe };
}
