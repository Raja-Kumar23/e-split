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
"[project]/app/api/groups/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
/**
 * /api/groups
 * GET  ?uid=xxx          → return all groups where uid is a member
 * POST { name, desc, members: {uid: {name,email,username}}, createdBy } → create group
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebaseAdmin.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/apiHelpers.js [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get('uid');
        if (!uid) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('uid required', 400);
        const allGroups = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbGet"])('groups');
        if (!allGroups) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])({});
        const myGroups = {};
        for (const [gid, g] of Object.entries(allGroups)){
            if (g.members && g.members[uid]) {
                myGroups[gid] = g;
            }
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])(myGroups);
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serverErr"])(e);
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { name, desc, members, createdBy } = body;
        if (!name || !name.trim()) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('Group name is required');
        if (!createdBy) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('createdBy is required');
        if (!members || !members[createdBy]) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])('Creator must be in members');
        const newGroup = {
            name: name.trim(),
            desc: desc?.trim() || '',
            members,
            createdBy,
            createdAt: Date.now(),
            expenses: {},
            payments: {}
        };
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dbPush"])('groups', newGroup);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])({
            groupId: result.name,
            group: newGroup
        }, 201);
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$apiHelpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serverErr"])(e);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__08la2gn._.js.map