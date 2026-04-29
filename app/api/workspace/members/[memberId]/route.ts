import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth/session";
import {
  getWorkspaceForUser,
  removeMember,
  updateMemberRole,
} from "@/lib/db/workspace";

export const dynamic = "force-dynamic";

// DELETE /api/workspace/members/[memberId] — remove member
export async function DELETE(
  _req: Request,
  { params }: { params: { memberId: string } }
) {
  const userId = await getCurrentUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const result = await getWorkspaceForUser(userId);
    if (!result) return NextResponse.json({ error: "No workspace" }, { status: 404 });
    if (result.role !== "admin") {
      return NextResponse.json({ error: "Only admins can remove members." }, { status: 403 });
    }

    await removeMember(result.workspace.id, params.memberId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[workspace/members/[id]] DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH /api/workspace/members/[memberId] — change role
export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  const userId = await getCurrentUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const result = await getWorkspaceForUser(userId);
    if (!result) return NextResponse.json({ error: "No workspace" }, { status: 404 });
    if (result.role !== "admin") {
      return NextResponse.json({ error: "Only admins can change roles." }, { status: 403 });
    }

    const { role } = await req.json();
    const updated = await updateMemberRole(result.workspace.id, params.memberId, role);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[workspace/members/[id]] PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
