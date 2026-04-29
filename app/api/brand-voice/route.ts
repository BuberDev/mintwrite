import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth/session";
import {
  getBrandVoicesForUser,
  createBrandVoice,
} from "@/lib/db/brand-voice";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/brand-voice — list user's brand voices
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const voices = await getBrandVoicesForUser(userId);
    return NextResponse.json(voices);
  } catch (error) {
    console.error("[brand-voice] GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/brand-voice — create brand voice profile
export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (user?.tier !== "agency") {
      return NextResponse.json(
        { error: "Custom Brand Voice is an Agency-plan feature." },
        { status: 403 }
      );
    }

    const { name, projectId, samples } = await req.json();

    if (!name || !samples || !Array.isArray(samples) || samples.length === 0) {
      return NextResponse.json(
        { error: "Name and at least one sample are required." },
        { status: 400 }
      );
    }

    const bv = await createBrandVoice({ userId, projectId, name, samples });
    return NextResponse.json(bv);
  } catch (error) {
    console.error("[brand-voice] POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
