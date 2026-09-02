import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 submissions per 10 minutes per IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const rl = rateLimit(`contact:${ip}`, { limit: 3, windowMs: 10 * 60 * 1000 });
    if (!rl.ok) {
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan. Silakan coba lagi dalam ${rl.retryAfterSec} detik atau hubungi kami via WhatsApp.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Data tidak valid";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, business, email, whatsapp, projectType, description } = parsed.data;

    await db.contactMessage.create({
      data: {
        name,
        business: business || null,
        email: email.toLowerCase(),
        whatsapp: whatsapp || null,
        projectType: projectType || null,
        description,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[CONTACT_POST]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
