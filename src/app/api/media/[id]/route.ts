import { NextRequest } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/media/[id]
 * Public route that serves an image stored in Postgres (Neon) as bytea.
 * URLs are immutable per id, so we cache aggressively.
 */

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const media = await db.media.findUnique({
      where: { id },
      select: { data: true, mimeType: true, filename: true, size: true },
    });

    if (!media?.data) {
      return new Response("Not found", { status: 404 });
    }

    const body = Buffer.from(media.data);

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": media.mimeType || "application/octet-stream",
        "Content-Length": String(body.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename="${encodeURIComponent(media.filename || "image")}"`,
      },
    });
  } catch (error) {
    console.error("[MEDIA_GET]", error);
    return new Response("Internal error", { status: 500 });
  }
}
