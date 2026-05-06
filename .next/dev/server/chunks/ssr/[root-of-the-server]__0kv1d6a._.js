module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/app/components/Toast.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastProvider",
    ()=>ToastProvider,
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const ToastCtx = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function ToastProvider({ children }) {
    const [toasts, setToasts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const showToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((msg, type = 'info')=>{
        const id = Date.now() + Math.random();
        setToasts((p)=>[
                ...p,
                {
                    id,
                    msg,
                    type
                }
            ]);
        setTimeout(()=>setToasts((p)=>p.filter((t)=>t.id !== id)), 3500);
    }, []);
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastCtx.Provider, {
        value: showToast,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "toast-container",
                children: toasts.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `toast ${t.type}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: icons[t.type] || 'ℹ️'
                            }, void 0, false, {
                                fileName: "[project]/app/components/Toast.js",
                                lineNumber: 23,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: t.msg
                            }, void 0, false, {
                                fileName: "[project]/app/components/Toast.js",
                                lineNumber: 24,
                                columnNumber: 13
                            }, this)
                        ]
                    }, t.id, true, {
                        fileName: "[project]/app/components/Toast.js",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/Toast.js",
                lineNumber: 20,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Toast.js",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
const useToast = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ToastCtx);
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[project]/app/lib/firebase.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$totp$2d$b6f03300$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__p__as__getAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/totp-b6f03300.js [app-ssr] (ecmascript) <export p as getAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$database$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/database/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$node$2d$esm$2f$index$2e$node$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/database/dist/node-esm/index.node.esm.js [app-ssr] (ecmascript)");
'use client';
;
;
;
const firebaseConfig = {
    apiKey: 'AIzaSyDuYkJ6kz0W7UfVfE8MB5uV-yBLfD7a2uo',
    authDomain: 'kslcaptain.firebaseapp.com',
    databaseURL: 'https://kslcaptain-default-rtdb.firebaseio.com',
    projectId: 'kslcaptain',
    storageBucket: 'kslcaptain.firebasestorage.app',
    messagingSenderId: '975351727139',
    appId: '1:975351727139:web:a353c7a8c992b6fcfb5d96'
};
const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApps"])().length === 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeApp"])(firebaseConfig) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApps"])()[0];
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$totp$2d$b6f03300$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__p__as__getAuth$3e$__["getAuth"])(app);
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$node$2d$esm$2f$index$2e$node$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDatabase"])(app);
}),
"[project]/app/lib/calculations.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/app/components/AuthProvider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$totp$2d$b6f03300$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__z__as__onAuthStateChanged$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/totp-b6f03300.js [app-ssr] (ecmascript) <export z as onAuthStateChanged>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$database$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/database/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$node$2d$esm$2f$index$2e$node$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/database/dist/node-esm/index.node.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebase.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$calculations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/calculations.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const AuthCtx = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userData, setUserData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const unsub = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$totp$2d$b6f03300$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__z__as__onAuthStateChanged$3e$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"], async (user)=>{
            if (user) {
                setCurrentUser(user);
                try {
                    const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$node$2d$esm$2f$index$2e$node$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["get"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$node$2d$esm$2f$index$2e$node$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ref"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], 'users/' + user.uid));
                    if (snap.exists()) {
                        setUserData(snap.val());
                    } else {
                        const name = user.displayName || user.email.split('@')[0];
                        const username = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$calculations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateUsername"])(name);
                        const newData = {
                            name,
                            email: user.email,
                            username,
                            balance: 20000,
                            totalSpent: 0,
                            createdAt: Date.now()
                        };
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$node$2d$esm$2f$index$2e$node$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["set"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$node$2d$esm$2f$index$2e$node$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ref"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], 'users/' + user.uid), newData);
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$node$2d$esm$2f$index$2e$node$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["set"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$database$2f$dist$2f$node$2d$esm$2f$index$2e$node$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ref"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], 'usernames/' + username), user.uid);
                        setUserData(newData);
                    }
                } catch (e) {
                    console.error('Auth load error', e);
                }
            } else {
                setCurrentUser(null);
                setUserData(null);
            }
            setLoading(false);
        });
        return unsub;
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthCtx.Provider, {
        value: {
            currentUser,
            userData,
            setUserData,
            loading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/components/AuthProvider.js",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
const useAuth = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthCtx);
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0kv1d6a._.js.map