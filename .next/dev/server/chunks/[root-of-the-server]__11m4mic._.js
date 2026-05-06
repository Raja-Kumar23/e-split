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
"[project]/app/api/groups/[groupId]/expenses/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
/**
 * /api/groups/[groupId]/expenses
 * POST → add expense, deduct payer's full amount from wallet, track totalSpent
 *
 * Body: { desc, amount, paidBy, splitWith?, isDirectPayment?, paymentMethod?, paymentDetail? }
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebaseAdmin.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$calculations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/calculations.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/apiHelpers.js [app-route] (ecmascript)");
;
;
;
async function GET(request, { params }) {
    try {
        const { groupId } = await params;
        const group = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbGet"])(`groups/${groupId}`);
        if (!group) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('Group not found', 404);
        const expenses = group.expenses || {};
        // Sort newest first
        const sorted = Object.entries(expenses).map(([id, e])=>({
                id,
                ...e
            })).sort((a, b)=>b.createdAt - a.createdAt);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])(sorted);
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serverErr"])(e);
    }
}
async function POST(request, { params }) {
    try {
        const { groupId } = await params;
        const body = await request.json();
        const { desc, amount, paidBy, splitWith, isDirectPayment, paymentMethod, paymentDetail } = body;
        // ── Validation ──
        if (!desc || !desc.trim()) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('Description is required');
        if (!amount || isNaN(amount) || amount <= 0) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('Amount must be a positive number');
        if (!paidBy) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('paidBy is required');
        const group = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbGet"])(`groups/${groupId}`);
        if (!group) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('Group not found', 404);
        if (!group.members?.[paidBy]) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('Payer is not a member of this group', 403);
        const memberUids = Object.keys(group.members);
        const participants = Array.isArray(splitWith) && splitWith.length > 0 ? splitWith : memberUids;
        // Validate all participants are group members
        for (const uid of participants){
            if (!group.members[uid]) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])(`User ${uid} is not a group member`);
        }
        const parsedAmount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$calculations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["round2"])(parseFloat(amount));
        const perPerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$calculations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["round2"])(parsedAmount / participants.length);
        // ── Check payer wallet balance ──
        const payerData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbGet"])(`users/${paidBy}`);
        if (!payerData) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('Payer not found', 404);
        if ((payerData.balance || 0) < parsedAmount) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])(`Insufficient balance. Have ${payerData.balance?.toFixed(2)}, need ${parsedAmount.toFixed(2)}`);
        }
        // ── Write expense ──
        const expense = {
            desc: desc.trim(),
            amount: parsedAmount,
            paidBy,
            splitWith: participants,
            perPerson,
            isDirectPayment: isDirectPayment || false,
            paymentMethod: paymentMethod || null,
            paymentDetail: paymentDetail || null,
            createdAt: Date.now()
        };
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbPush"])(`groups/${groupId}/expenses`, expense);
        // ── Deduct FULL amount from payer's wallet ──
        // payer fronted 100% of the money upfront
        const newBalance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$calculations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["round2"])((payerData.balance || 0) - parsedAmount);
        // Only payer's own share counts toward totalSpent
        const newTotalSpent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$calculations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["round2"])((payerData.totalSpent || 0) + perPerson);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbUpdate"])(`users/${paidBy}`, {
            balance: newBalance,
            totalSpent: newTotalSpent
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])({
            expenseId: result.name,
            expense,
            payerNewBalance: newBalance,
            perPerson,
            participantCount: participants.length
        }, 201);
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serverErr"])(e);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__11m4mic._.js.map