import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth/session";
import { revokeInvite, getWorkspaceForUser } from "@/lib/db/workspace";

export const dynamic = "force-dynamic";

// DELETE /api/workspace/invites/[inviteId] — revoke invite
export async function DELETE(
  _req: Request,
  { params }: { params: { inviteId: string } }
) {
  const userId = await getCurrentUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const result = await getWorkspaceForUser(userId);
    if (!result) return NextResponse.json({ error: "No workspace" }, { status: 404 });
    if (result.role !== "admin") {
      return NextResponse.json({ error: "Only admins can revoke invites." }, { status: 403 });
    }

    await revokeInvite(params.inviteId, result.workspace.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[workspace/invites/[id]] DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
