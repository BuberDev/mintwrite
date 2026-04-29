import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth/session";
import {
  getWorkspaceForUser,
  createWorkspace,
  updateWorkspaceName,
} from "@/lib/db/workspace";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/workspace — fetch user's workspace
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const result = await getWorkspaceForUser(userId);
    return NextResponse.json(result ?? null);
  } catch (error) {
    console.error("[workspace] GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/workspace — create workspace (or rename)
export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    // Check tier
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (user?.tier !== "agency") {
      return NextResponse.json(
        { error: "Multi-user Workspace is an Agency-plan feature." },
        { status: 403 }
      );
    }

    const { name, action, workspaceId } = await req.json();

    if (action === "rename" && workspaceId) {
      const updated = await updateWorkspaceName(workspaceId, name);
      return NextResponse.json(updated);
    }

    const workspace = await createWorkspace(userId, name);
    return NextResponse.json(workspace);
  } catch (error) {
    console.error("[workspace] POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
