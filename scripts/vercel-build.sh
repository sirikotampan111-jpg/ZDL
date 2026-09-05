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
else
  echo "⚠️  DATABASE_URL not set — deploying WITHOUT database (public pages render 200 with empty states)."
  echo "   → Add DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, NEXT_PUBLIC_SITE_URL in Vercel → Settings → Environment Variables, then redeploy."
  DATABASE_URL='postgresql://placeholder:placeholder@localhost:5432/placeholder' prisma generate --schema=prisma/schema.postgres.prisma
fi

echo "▶ Next.js build"
next build
