import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { getAdminSession, unauthorized } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * File upload endpoint.
 * NOTE: On self-hosted/VPS this writes to /public/uploads.
 * On serverless (Vercel), filesystem is read-only — the admin UI also supports
 * adding media by URL (e.g. Vercel Blob / Cloudinary) which is the recommended path.
 */
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const alt = (formData.get("alt") as string | null) || null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }
    if (!IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Format tidak didukung. Gunakan JPG, PNG, WebP, GIF, atau SVG." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".png";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    // Write to public/uploads (works in dev / self-hosted / standalone node)
    let url: string;
    try {
      const fs = await import("fs/promises");
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, safeName), buffer);
      url = `/uploads/${safeName}`;
    } catch {
      return NextResponse.json(
        {
          error:
            "Upload file gagal (filesystem read-only). Gunakan opsi 'Tambah dari URL' di Media Library.",
        },
        { status: 500 }
      );
    }

    const created = await db.media.create({
      data: {
        filename: file.name,
        url,
        mimeType: file.type,
        size: file.size,
        alt,
      },
    });

    return NextResponse.json({ media: created }, { status: 201 });
  } catch (error) {
    console.error("[UPLOAD_POST]", error);
    return NextResponse.json({ error: "Gagal mengunggah file" }, { status: 500 });
  }
}
