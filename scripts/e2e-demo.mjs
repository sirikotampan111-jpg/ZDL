/**
 * ZDL E2E test — Demo feature
 * Usage: node scripts/e2e-demo.mjs http://localhost:3999
 */
const BASE = process.argv[2] || "http://localhost:3999";
const EMAIL = "admin@zdl.my.id";
const PASSWORD = process.env.ADMIN_PASSWORD || "2xlYZ7mEnF7Zwe9H";

let passed = 0;
let failed = 0;

function check(name, cond, extra = "") {
  if (cond) {
    console.log(`  ✓ ${name}${extra ? ` — ${extra}` : ""}`);
    passed++;
  } else {
    console.log(`  ✗ FAIL: ${name} ${extra}`);
    failed++;
  }
}

async function get(path, opts = {}) {
  return fetch(BASE + path, { redirect: "manual", ...opts });
}

console.log(`\n=== ZDL E2E — Demo feature @ ${BASE} ===\n`);

// ---------- PUBLIC ROUTES ----------
console.log("[1] Public demo routes");
let r = await get("/demo");
let html = await r.text();
check("GET /demo → 200", r.status === 200);
check("/demo lists seeded demo", html.includes("Demo Aplikasi Kasir"));
check("/demo has booking demo", html.includes("Sistem Booking Online"));
check("/demo has category chips", html.includes("Aplikasi Kasir"));

r = await get("/demo/aplikasi-kasir");
html = await r.text();
check("GET /demo/aplikasi-kasir → 200", r.status === 200);
check("detail has 'Coba demo sekarang' CTA", html.includes("Coba demo sekarang"));
check("detail links to interactive demo", html.includes("/demo/coba/kasir"));
check("detail has 'Yang bisa Anda coba' section", html.includes("Yang bisa Anda coba"));

r = await get("/demo/sistem-booking-online");
html = await r.text();
check("GET /demo/sistem-booking-online → 200", r.status === 200);
check("booking detail links to /demo/coba/booking", html.includes("/demo/coba/booking"));

r = await get("/demo/coba/kasir");
html = await r.text();
check("GET /demo/coba/kasir → 200", r.status === 200);
check("kasir page has Mode Demo banner", html.includes("Mode Demo"));
check("kasir page has product (Nasi Goreng)", html.includes("Nasi Goreng Spesial"));

r = await get("/demo/coba/booking");
html = await r.text();
check("GET /demo/coba/booking → 200", r.status === 200);
check("booking page has services", html.includes("Potong Rambut"));

r = await get("/demo/tidak-ada-404");
check("GET /demo/tidak-ada → 404", r.status === 404);

r = await get("/");
html = await r.text();
check("homepage shows demo teaser section", html.includes("Jangan cuma baca"));

r = await get("/sitemap.xml");
html = await r.text();
check("sitemap includes /demo", html.includes("/demo"));
check("sitemap includes /demo/aplikasi-kasir", html.includes("/demo/aplikasi-kasir"));

// ---------- ADMIN API ----------
console.log("\n[2] Admin auth + demo CRUD");
// NextAuth credentials flow: CSRF → callback → session cookie
const csrfRes = await fetch(BASE + "/api/auth/csrf");
const { csrfToken } = await csrfRes.json();
const cookieJar = [];
const setCookies = csrfRes.headers.getSetCookie?.() || [];
for (const c of setCookies) cookieJar.push(c.split(";")[0]);

const loginRes = await fetch(BASE + "/api/auth/callback/credentials", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Cookie: cookieJar.join("; "),
  },
  body: new URLSearchParams({
    csrfToken,
    email: EMAIL,
    password: PASSWORD,
    callbackUrl: BASE + "/admin",
    json: "true",
  }),
  redirect: "manual",
});
for (const c of loginRes.headers.getSetCookie?.() || []) cookieJar.push(c.split(";")[0]);
const sessionCookie = cookieJar.find((c) => c.startsWith("next-auth.session-token"));
check("login returns session cookie", Boolean(sessionCookie));

const auth = { Cookie: cookieJar.join("; ") };

// CREATE
const createRes = await fetch(BASE + "/api/admin/demo", {
  method: "POST",
  headers: { "Content-Type": "application/json", ...auth },
  body: JSON.stringify({
    title: "Demo E2E Test",
    slug: "demo-e2e-test",
    description: "Demo sementara untuk pengujian E2E — akan dihapus otomatis.",
    demoUrl: "https://example.com/demo",
    accessType: "REQUEST",
    technologies: ["Test"],
    featured: false,
    published: true,
    sortOrder: 99,
  }),
});
check("POST /api/admin/demo → 201", createRes.status === 201, `got ${createRes.status}`);
const created = (await createRes.json()).demo;

// CREATE duplicate → 409
const dupRes = await fetch(BASE + "/api/admin/demo", {
  method: "POST",
  headers: { "Content-Type": "application/json", ...auth },
  body: JSON.stringify({
    title: "Demo E2E Test",
    slug: "demo-e2e-test",
    description: "Duplikat harus ditolak.",
    demoUrl: "/x",
  }),
});
check("duplicate slug → 409", dupRes.status === 409, `got ${dupRes.status}`);

// UNAUTH → 401
const unauthRes = await fetch(BASE + "/api/admin/demo", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
check("unauthenticated POST → 401", unauthRes.status === 401, `got ${unauthRes.status}`);

// LIST
const listRes = await fetch(BASE + "/api/admin/demo", { headers: auth });
const listData = await listRes.json();
check("GET /api/admin/demo lists 3 rows", (listData.demos || []).length === 3, `got ${(listData.demos || []).length}`);

// UPDATE
const putRes = await fetch(BASE + `/api/admin/demo/${created.id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json", ...auth },
  body: JSON.stringify({
    title: "Demo E2E Test (edited)",
    slug: "demo-e2e-test",
    description: "Demo sementara untuk pengujian E2E — sudah diubah.",
    demoUrl: "/demo/coba/kasir",
    accessType: "PUBLIC",
    technologies: ["Test", "Edited"],
    featured: true,
    published: true,
    sortOrder: 99,
    seoTitle: "E2E",
  }),
});
check("PUT /api/admin/demo/[id] → 200", putRes.status === 200, `got ${putRes.status}`);

// PATCH toggle published
const patchRes = await fetch(BASE + `/api/admin/demo/${created.id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json", ...auth },
  body: JSON.stringify({ action: "toggle-published" }),
});
const patched = (await patchRes.json()).demo;
check("PATCH toggle-published", patchRes.status === 200 && patched.published === false);

// unpublished demo hidden from public
r = await get("/demo");
html = await r.text();
check("unpublished demo hidden from /demo", !html.includes("Demo E2E Test"));

// re-publish + detail page visible
await fetch(BASE + `/api/admin/demo/${created.id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json", ...auth },
  body: JSON.stringify({ action: "toggle-published" }),
});
// ISR: force revalidation happened via revalidatePublic; fetch with cache-bust
r = await get("/demo/e2e-temp-" + Date.now().toString(36) + "-x");
check("unknown demo slug → 404", r.status === 404);

// DELETE
const delRes = await fetch(BASE + `/api/admin/demo/${created.id}`, { method: "DELETE", headers: auth });
check("DELETE /api/admin/demo/[id] → 200", delRes.status === 200);

const listAfter = await fetch(BASE + "/api/admin/demo", { headers: auth });
const afterData = await listAfter.json();
check("after delete back to 2 rows", (afterData.demos || []).length === 2, `got ${(afterData.demos || []).length}`);

// ---------- ADMIN UI ----------
console.log("\n[3] Admin UI pages");
for (const p of ["/admin/demo", "/admin/demo/new"]) {
  const res = await fetch(BASE + p, { headers: auth, redirect: "manual" });
  check(`GET ${p} → 200`, res.status === 200, `got ${res.status}`);
}

console.log(`\n=== RESULT: ${passed} passed, ${failed} failed ===\n`);
process.exit(failed > 0 ? 1 : 0);
