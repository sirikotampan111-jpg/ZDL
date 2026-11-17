#!/bin/bash
# ZDL local E2E: seed → build → start server → run e2e → cleanup
# Mirrors the Vercel pipeline (vercel-build.sh: generate → db push → seed → next build)
set -u
cd /home/z/my-project

PORT=3999
export NEXTAUTH_SECRET=local-e2e-secret-zdl
export NEXTAUTH_URL=http://localhost:$PORT
export ADMIN_PASSWORD=2xlYZ7mEnF7Zwe9H   # keep in sync with e2e-demo.mjs default
export NODE_ENV=production

# kill anything on the port — next-server renames itself, so match by socket, not name
for pid in $(lsof -t -i tcp:$PORT 2>/dev/null); do kill -9 "$pid" 2>/dev/null; done
for pid in $(pgrep -f "$PORT" 2>/dev/null); do kill -9 "$pid" 2>/dev/null; done
sleep 1

# 1) seed BEFORE build so prerendered pages (homepage, sitemap, /demo ISR) include content
node scripts/seed-core.mjs
node scripts/seed-content.mjs

# 2) build — clear .next so the build cache cannot reuse stale prerendered
#    pages from an earlier build that ran against an empty database
if [ "${SKIP_BUILD:-0}" = "1" ]; then
  echo "[run-local-e2e] SKIP_BUILD=1 — using existing .next"
else
  rm -rf .next
  npm run build > /tmp/next-build.log 2>&1 || { echo "[run-local-e2e] BUILD FAILED"; tail -30 /tmp/next-build.log; exit 1; }
fi
echo "[run-local-e2e] build ok"

# 3) start
nohup npx next start -p $PORT > /tmp/next-$PORT.log 2>&1 &
SERVER_PID=$!
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done
code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/ 2>/dev/null)
echo "[run-local-e2e] server http_code=$code (pid $SERVER_PID)"
if [ "$code" != "200" ]; then
  echo "[run-local-e2e] server failed — log tail:"; tail -20 /tmp/next-$PORT.log
  kill -9 $SERVER_PID 2>/dev/null; exit 1
fi

# 4) e2e
node scripts/e2e-demo.mjs http://localhost:$PORT
E2E_RC=$?

# 5) cleanup
kill -9 $SERVER_PID 2>/dev/null
for pid in $(pgrep -f "$PORT" 2>/dev/null); do kill -9 "$pid" 2>/dev/null; done
echo "[run-local-e2e] done, e2e_rc=$E2E_RC"
exit $E2E_RC
