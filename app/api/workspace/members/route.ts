import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth/session";
import {
  getWorkspaceForUser,
  createInvite,
  getWorkspaceMembers,
  getPendingInvites,
} from "@/lib/db/workspace";

export const dynamic = "force-dynamic";

// GET /api/workspace/members — get members + pending invites
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const result = await getWorkspaceForUser(userId);
    if (!result) {
      return NextResponse.json({ members: [], invites: [] });
    }

    const [members, invites] = await Promise.all([
      getWorkspaceMembers(result.workspace.id),
      getPendingInvites(result.workspace.id),
    ]);

    return NextResponse.json({ members, invites, userRole: result.role });
  } catch (error) {
    console.error("[workspace/members] GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/workspace/members — invite a member
export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const result = await getWorkspaceForUser(userId);
    if (!result) {
      return NextResponse.json({ error: "No workspace found" }, { status: 404 });
    }

    if (result.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can invite members." },
        { status: 403 }
      );
    }

    const { email, role } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const invite = await createInvite(
      result.workspace.id,
      userId,
      email,
      role ?? "member"
    );

    return NextResponse.json(invite);
  } catch (error) {
    console.error("[workspace/members] POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
