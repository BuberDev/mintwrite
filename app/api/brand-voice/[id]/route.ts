import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth/session";
import { getBrandVoiceById, deleteBrandVoice } from "@/lib/db/brand-voice";

export const dynamic = "force-dynamic";

// GET /api/brand-voice/[id]
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const userId = await getCurrentUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const voice = await getBrandVoiceById(params.id, userId);
    if (!voice) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(voice);
  } catch (error) {
    console.error("[brand-voice/[id]] GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/brand-voice/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const userId = await getCurrentUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    await deleteBrandVoice(params.id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[brand-voice/[id]] DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
