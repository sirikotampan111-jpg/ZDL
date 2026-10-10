import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession, unauthorized } from "@/lib/api-auth";

// Node.js runtime: uses Prisma + Buffer for bytea storage in Neon.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/upload
 * Stores the uploaded image binary directly in Postgres (Neon) as bytea.
 * No external object storage needed. The file is later served through
 * GET /api/media/[id] and referenced by the URL `/api/media/{id}`.
 */

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
];

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    const mimeType = file.type || "application/octet-stream";
    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: `Tipe file tidak didukung (${mimeType}). Gunakan JPG, PNG, WebP, GIF, SVG, atau AVIF.` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Create the record first, then point its URL at the serving route.
    const created = await db.media.create({
      data: {
        filename: file.name || "upload",
        url: "pending",
        mimeType,
        size: buffer.length,
        alt: (formData.get("alt") as string) || null,
        data: buffer,
      },
    });

    const url = `/api/media/${created.id}`;
    const media = await db.media.update({
      where: { id: created.id },
      data: { url },
    });

    return NextResponse.json(
      { media: { id: media.id, filename: media.filename, url: media.url, mimeType: media.mimeType, size: media.size, alt: media.alt } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return NextResponse.json({ error: "Gagal mengunggah file" }, { status: 500 });
  }
}
