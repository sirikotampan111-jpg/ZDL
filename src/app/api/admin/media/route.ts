import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mediaSchema } from "@/lib/validators";
import { getAdminSession, unauthorized } from "@/lib/api-auth";

/**
 * GET  /api/admin/media — list media library
 * POST /api/admin/media — add media:
 *   • multipart/form-data (file)  → upload binary, stored as bytea in Neon,
 *     served afterwards via GET /api/media/[id]  (url = /api/media/{id})
 *   • application/json (filename + url) → register an external image URL
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

export async function GET() {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const media = await db.media.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      filename: true,
      url: true,
      mimeType: true,
      size: true,
      alt: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ media });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const contentType = req.headers.get("content-type") || "";

  /* --------------------------------------------------------------- */
  /* A) File upload → store bytes in Neon (bytea)                     */
  /* --------------------------------------------------------------- */
  if (contentType.includes("multipart/form-data")) {
    try {
      const formData = await req.formData();
      const file = formData.get("file");

      if (!file || typeof file === "string") {
        return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
      }

      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
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
        select: { id: true, filename: true, url: true, mimeType: true, size: true, alt: true },
      });

      return NextResponse.json({ media }, { status: 201 });
    } catch (error) {
      console.error("[MEDIA_UPLOAD]", error);
      return NextResponse.json({ error: "Gagal mengunggah file" }, { status: 500 });
    }
  }

  /* --------------------------------------------------------------- */
  /* B) External URL registration (JSON)                              */
  /* --------------------------------------------------------------- */
  try {
    const body = await req.json();
    const parsed = mediaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Data tidak valid" },
        { status: 400 }
      );
    }

    const created = await db.media.create({ data: parsed.data });
    return NextResponse.json({ media: created }, { status: 201 });
  } catch (error) {
    console.error("[MEDIA_POST]", error);
    return NextResponse.json({ error: "Gagal menyimpan media" }, { status: 500 });
  }
}
