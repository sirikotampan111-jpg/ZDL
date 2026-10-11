#!/usr/bin/env bash
# ZDL — Vercel build script (referenced by vercel.json)
# Keeps vercel.json buildCommand short (256 char API limit).
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "▶ DATABASE_URL found — full database setup"
  prisma generate --schema=prisma/schema.postgres.prisma
  echo "▶ Syncing tables (prisma db push)"
  prisma db push --skip-generate --schema=prisma/schema.postgres.prisma
  echo "▶ Seeding admin & categories"
  node scripts/seed-core.mjs
  echo "▶ Seeding starting content (portfolio + journal)"
  node scripts/seed-content.mjs || echo "⚠️  content seed failed — continuing build"
else
  echo "⚠️  DATABASE_URL not set — deploying WITHOUT database (public pages render 200 with empty states)."
  echo "   → Add DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, NEXT_PUBLIC_SITE_URL in Vercel → Settings → Environment Variables, then redeploy."
  DATABASE_URL='postgresql://placeholder:placeholder@localhost:5432/placeholder' prisma generate --schema=prisma/schema.postgres.prisma
fi

echo "▶ Next.js build"
# Prerendering runs parallel workers — give each enough DB connections so a
# transient pool limit never bakes a 404 into statically generated pages.
BUILD_DB_URL="$DATABASE_URL"
if echo "$BUILD_DB_URL" | grep -q "connection_limit=1"; then
  BUILD_DB_URL="${BUILD_DB_URL/connection_limit=1/connection_limit=5}"
fi
DATABASE_URL="$BUILD_DB_URL" next build
