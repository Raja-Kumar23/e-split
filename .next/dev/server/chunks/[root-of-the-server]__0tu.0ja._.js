module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/lib/firebaseAdmin.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dbDelete",
    ()=>dbDelete,
    "dbGet",
    ()=>dbGet,
    "dbPush",
    ()=>dbPush,
    "dbSet",
    ()=>dbSet,
    "dbUpdate",
    ()=>dbUpdate
]);
// Server-side Firebase Database access via REST API
// Used by all API routes — no client SDK on the server
const DB_URL = 'https://kslcaptain-default-rtdb.firebaseio.com';
async function dbGet(path) {
    const res = await fetch(`${DB_URL}/${path}.json`);
    if (!res.ok) throw new Error(`DB GET failed: ${path} ${res.status}`);
    return res.json();
}
async function dbSet(path, data) {
    const res = await fetch(`${DB_URL}/${path}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`DB SET failed: ${path} ${res.status}`);
    return res.json();
}
async function dbPush(path, data) {
    const res = await fetch(`${DB_URL}/${path}.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`DB PUSH failed: ${path} ${res.status}`);
    return res.json(); // returns { name: "-NEWKEY" }
}
async function dbUpdate(path, data) {
    const res = await fetch(`${DB_URL}/${path}.json`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`DB UPDATE failed: ${path} ${res.status}`);
    return res.json();
}
async function dbDelete(path) {
    const res = await fetch(`${DB_URL}/${path}.json`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error(`DB DELETE failed: ${path} ${res.status}`);
    return true;
}
;
}),
"[project]/app/lib/calculations.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * E-Split Calculation Engine
 * All money math is centralised here. Used on both server (API routes)
 * and client (display components).
 *
 * PRINCIPLE
 *  - Every expense has a payer (paidBy) and a list of participants (splitWith).
 *  - The payer fronted the full amount; each participant (including the payer)
 *    owes their equal share.
 *  - Net balance: POSITIVE = others owe you | NEGATIVE = you owe others
 *  - Payments recorded in the `payments` node reduce outstanding balances.
 */ __turbopack_context__.s([
    "AVATAR_COLORS",
    ()=>AVATAR_COLORS,
    "computeRawBalances",
    ()=>computeRawBalances,
    "computeSettlementPlan",
    ()=>computeSettlementPlan,
    "fmt",
    ()=>fmt,
    "fmtDate",
    ()=>fmtDate,
    "generateUsername",
    ()=>generateUsername,
    "getAvatarColor",
    ()=>getAvatarColor,
    "getGroupSummary",
    ()=>getGroupSummary,
    "getInitials",
    ()=>getInitials,
    "getMyCredits",
    ()=>getMyCredits,
    "getMyDebts",
    ()=>getMyDebts,
    "getNetBalance",
    ()=>getNetBalance,
    "round2",
    ()=>round2
]);
const round2 = (n)=>Math.round(n * 100) / 100;
const fmt = (n)=>parseFloat(n || 0).toFixed(2);
const fmtDate = (ts)=>ts ? new Date(ts).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) : '—';
const getInitials = (name)=>(name || 'U').split(' ').map((w)=>w[0]).join('').toUpperCase().slice(0, 2);
const AVATAR_COLORS = [
    '#e8a020',
    '#22c97a',
    '#5b8af0',
    '#a06af0',
    '#f06090',
    '#20c8c0',
    '#f05060',
    '#f0a030'
];
const getAvatarColor = (uid)=>AVATAR_COLORS[(uid || '').charCodeAt(0) % AVATAR_COLORS.length];
const generateUsername = (name)=>{
    const clean = (name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
    return (clean.slice(0, 8) || 'user') + Math.floor(100 + Math.random() * 900);
};
// ─── core balance calculations ──────────────────────────────────────────────
/**
 * Resolve the participant list for one expense.
 * Falls back to all group members when splitWith is empty/missing.
 */ function resolveParticipants(exp, allMemberUids) {
    if (Array.isArray(exp.splitWith) && exp.splitWith.length > 0) {
        return exp.splitWith;
    }
    return allMemberUids;
}
function computeRawBalances(group) {
    const memberUids = Object.keys(group.members || {});
    const bals = {};
    memberUids.forEach((m)=>{
        bals[m] = 0;
    });
    // ── Expenses ──
    for (const exp of Object.values(group.expenses || {})){
        if (!bals.hasOwnProperty(exp.paidBy)) continue;
        const sw = resolveParticipants(exp, memberUids);
        if (sw.length === 0) continue;
        const share = round2(exp.amount / sw.length);
        // Payer gets credited for every OTHER participant's share
        const otherCount = sw.filter((m)=>m !== exp.paidBy).length;
        bals[exp.paidBy] = round2(bals[exp.paidBy] + otherCount * share);
        // Each non-payer participant is debited their share
        for (const mid of sw){
            if (mid !== exp.paidBy && bals.hasOwnProperty(mid)) {
                bals[mid] = round2(bals[mid] - share);
            }
        }
    }
    // ── Payments (settlements already made) ──
    for (const pay of Object.values(group.payments || {})){
        if (bals.hasOwnProperty(pay.from)) bals[pay.from] = round2(bals[pay.from] - pay.amount);
        if (bals.hasOwnProperty(pay.to)) bals[pay.to] = round2(bals[pay.to] + pay.amount);
    }
    return bals;
}
function getNetBalance(group, uid) {
    const bals = computeRawBalances(group);
    return round2(bals[uid] || 0);
}
function getMyDebts(group, uid) {
    const memberUids = Object.keys(group.members || {});
    const owed = {}; // { creditorUid: raw amount }
    for (const exp of Object.values(group.expenses || {})){
        if (exp.paidBy === uid) continue; // I paid — I'm the creditor here
        const sw = resolveParticipants(exp, memberUids);
        if (!sw.includes(uid) || sw.length === 0) continue;
        const share = round2(exp.amount / sw.length);
        owed[exp.paidBy] = round2((owed[exp.paidBy] || 0) + share);
    }
    // Subtract payments I've already made
    for (const pay of Object.values(group.payments || {})){
        if (pay.from === uid && pay.to) {
            owed[pay.to] = round2((owed[pay.to] || 0) - pay.amount);
        }
    }
    // Return only positive outstanding debts
    const result = {};
    for (const [creditor, amt] of Object.entries(owed)){
        if (amt > 0.005) result[creditor] = round2(amt);
    }
    return result;
}
function getMyCredits(group, uid) {
    const memberUids = Object.keys(group.members || {});
    const owed = {}; // { debtorUid: raw amount }
    for (const exp of Object.values(group.expenses || {})){
        if (exp.paidBy !== uid) continue; // Only expenses I paid
        const sw = resolveParticipants(exp, memberUids);
        if (sw.length === 0) continue;
        const share = round2(exp.amount / sw.length);
        for (const mid of sw){
            if (mid !== uid) {
                owed[mid] = round2((owed[mid] || 0) + share);
            }
        }
    }
    // Subtract payments already received
    for (const pay of Object.values(group.payments || {})){
        if (pay.to === uid && pay.from) {
            owed[pay.from] = round2((owed[pay.from] || 0) - pay.amount);
        }
    }
    // Return only positive outstanding credits
    const result = {};
    for (const [debtor, amt] of Object.entries(owed)){
        if (amt > 0.005) result[debtor] = round2(amt);
    }
    return result;
}
function computeSettlementPlan(group) {
    const bals = computeRawBalances(group);
    const creditors = []; // uid owes money to others  (balance > 0)
    const debtors = []; // uid is owed money by others(balance < 0)
    for (const [uid, bal] of Object.entries(bals)){
        if (bal > 0.005) creditors.push({
            uid,
            amt: bal
        });
        else if (bal < -0.005) debtors.push({
            uid,
            amt: -bal
        }); // store as positive
    }
    creditors.sort((a, b)=>b.amt - a.amt);
    debtors.sort((a, b)=>b.amt - a.amt);
    const transfers = [];
    let i = 0, j = 0;
    while(i < creditors.length && j < debtors.length){
        const transfer = Math.min(creditors[i].amt, debtors[j].amt);
        if (transfer > 0.005) {
            transfers.push({
                from: debtors[j].uid,
                to: creditors[i].uid,
                amount: round2(transfer)
            });
        }
        creditors[i].amt = round2(creditors[i].amt - transfer);
        debtors[j].amt = round2(debtors[j].amt - transfer);
        if (creditors[i].amt < 0.005) i++;
        if (debtors[j].amt < 0.005) j++;
    }
    return transfers;
}
function getGroupSummary(group, uid) {
    const netBal = getNetBalance(group, uid);
    const debts = getMyDebts(group, uid);
    const credits = getMyCredits(group, uid);
    const plan = computeSettlementPlan(group);
    const totalOwed = round2(Object.values(credits).reduce((a, b)=>a + b, 0));
    const totalOwe = round2(Object.values(debts).reduce((a, b)=>a + b, 0));
    return {
        netBal,
        debts,
        credits,
        plan,
        totalOwed,
        totalOwe
    };
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/lib/apiHelpers.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "err",
    ()=>err,
    "ok",
    ()=>ok,
    "serverErr",
    ()=>serverErr
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
function ok(data, status = 200) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true,
        data
    }, {
        status
    });
}
function err(message, status = 400) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: false,
        error: message
    }, {
        status
    });
}
function serverErr(e) {
    console.error('[API ERROR]', e);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: false,
        error: e?.message || 'Internal server error'
    }, {
        status: 500
    });
}
}),
"[project]/app/api/gifts/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
/**
 * /api/gifts
 * GET  ?uid=xxx             → fetch gifts sent or received by uid
 * POST { from, to, amount, cardId, cardEmoji, cardName, message? } → send gift
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebaseAdmin.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$calculations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/calculations.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/apiHelpers.js [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get('uid');
        if (!uid) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('uid required');
        const allGifts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbGet"])('gifts');
        if (!allGifts) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])([]);
        const myGifts = Object.entries(allGifts).filter(([, g])=>g.from === uid || g.to === uid).map(([id, g])=>({
                id,
                ...g
            })).sort((a, b)=>b.createdAt - a.createdAt);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])(myGifts);
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serverErr"])(e);
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { from, to, amount, cardId, cardEmoji, cardName, message } = body;
        // ── Validation ──
        if (!from || !to) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('from and to are required');
        if (from === to) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('Cannot send gift to yourself');
        if (!amount || isNaN(amount) || amount <= 0) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('Amount must be a positive number');
        if (!cardId || !cardName) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('Gift card details required');
        const parsedAmount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$calculations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["round2"])(parseFloat(amount));
        // ── Fetch both users ──
        const [fromUser, toUser] = await Promise.all([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbGet"])(`users/${from}`),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbGet"])(`users/${to}`)
        ]);
        if (!fromUser) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('Sender not found', 404);
        if (!toUser) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('Recipient not found', 404);
        // ── Check sender balance ──
        if ((fromUser.balance || 0) < parsedAmount) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])(`Insufficient balance. Have ${(fromUser.balance || 0).toFixed(2)}, need ${parsedAmount.toFixed(2)}`);
        }
        // ── Check they are connected ──
        const connection = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbGet"])(`connections/${from}/accepted/${to}`);
        if (!connection) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('You can only send gifts to your connections');
        // ── Transfer wallets ──
        const fromNewBal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$calculations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["round2"])((fromUser.balance || 0) - parsedAmount);
        const toNewBal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$calculations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["round2"])((toUser.balance || 0) + parsedAmount);
        await Promise.all([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbUpdate"])(`users/${from}`, {
                balance: fromNewBal
            }),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbUpdate"])(`users/${to}`, {
                balance: toNewBal
            })
        ]);
        // ── Record gift ──
        const gift = {
            from,
            fromName: fromUser.name,
            fromUsername: fromUser.username || '',
            to,
            toName: toUser.name,
            toUsername: toUser.username || '',
            cardId,
            cardEmoji: cardEmoji || '🎁',
            cardName,
            amount: parsedAmount,
            message: message?.trim() || '',
            createdAt: Date.now()
        };
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbPush"])('gifts', gift);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])({
            giftId: result.name,
            gift,
            senderNewBalance: fromNewBal,
            receiverNewBalance: toNewBal
        }, 201);
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serverErr"])(e);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0tu.0ja._.js.map