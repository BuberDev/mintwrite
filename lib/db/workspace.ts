import { db } from "@/lib/db/drizzle";
import {
  workspaces,
  workspaceMembers,
  workspaceInvites,
  users,
} from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import crypto from "crypto";

export type WorkspaceRole = "admin" | "member" | "viewer";

// ─── Slugify ─────────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function generateInviteToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ─── Workspace Queries ────────────────────────────────────────────────────────

export async function getWorkspaceForUser(userId: string) {
  // Check if user owns a workspace
  const owned = await db.query.workspaces.findFirst({
    where: eq(workspaces.ownerId, userId),
    with: {
      members: {
        with: { user: true },
      },
      invites: true,
    },
  });
  if (owned) return { workspace: owned, role: "admin" as WorkspaceRole };

  // Check if user is a member of a workspace
  const membership = await db.query.workspaceMembers.findFirst({
    where: eq(workspaceMembers.userId, userId),
    with: {
      workspace: {
        with: {
          members: {
            with: { user: true },
          },
          invites: true,
        },
      },
    },
  });
  if (membership) {
    return {
      workspace: membership.workspace,
      role: membership.role as WorkspaceRole,
    };
  }

  return null;
}

export async function createWorkspace(ownerId: string, name: string) {
  const baseSlug = slugify(name);
  // Ensure slug uniqueness by appending random suffix if needed
  const slug = `${baseSlug}-${crypto.randomBytes(3).toString("hex")}`;

  const [workspace] = await db
    .insert(workspaces)
    .values({ ownerId, name, slug })
    .returning();

  // Owner is always an admin member
  await db.insert(workspaceMembers).values({
    workspaceId: workspace.id,
    userId: ownerId,
    role: "admin",
  });

  return workspace;
}

export async function updateWorkspaceName(workspaceId: string, name: string) {
  const [updated] = await db
    .update(workspaces)
    .set({ name, updatedAt: new Date() })
    .where(eq(workspaces.id, workspaceId))
    .returning();
  return updated;
}

// ─── Members ─────────────────────────────────────────────────────────────────

export async function getWorkspaceMembers(workspaceId: string) {
  return db.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.workspaceId, workspaceId),
    with: { user: true },
  });
}

export async function updateMemberRole(
  workspaceId: string,
  memberId: string,
  role: WorkspaceRole
) {
  const [updated] = await db
    .update(workspaceMembers)
    .set({ role })
    .where(
      and(
        eq(workspaceMembers.id, memberId),
        eq(workspaceMembers.workspaceId, workspaceId)
      )
    )
    .returning();
  return updated;
}

export async function removeMember(workspaceId: string, memberId: string) {
  await db
    .delete(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.id, memberId),
        eq(workspaceMembers.workspaceId, workspaceId)
      )
    );
}

// ─── Invites ─────────────────────────────────────────────────────────────────

export async function getPendingInvites(workspaceId: string) {
  const now = new Date();
  return db.query.workspaceInvites.findMany({
    where: and(
      eq(workspaceInvites.workspaceId, workspaceId),
      gt(workspaceInvites.expiresAt, now)
    ),
  });
}

export async function createInvite(
  workspaceId: string,
  invitedByUserId: string,
  email: string,
  role: WorkspaceRole = "member"
) {
  const token = generateInviteToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const [invite] = await db
    .insert(workspaceInvites)
    .values({ workspaceId, invitedByUserId, email, role, token, expiresAt })
    .returning();

  return invite;
}

export async function acceptInvite(token: string, userId: string) {
  const now = new Date();
  const invite = await db.query.workspaceInvites.findFirst({
    where: and(
      eq(workspaceInvites.token, token),
      gt(workspaceInvites.expiresAt, now)
    ),
    with: { workspace: true },
  });

  if (!invite) throw new Error("Invite not found or expired");
  if (invite.acceptedAt) throw new Error("Invite already accepted");

  // Add user to workspace
  await db
    .insert(workspaceMembers)
    .values({
      workspaceId: invite.workspaceId,
      userId,
      role: invite.role as WorkspaceRole,
    })
    .onConflictDoNothing();

  // Mark invite as accepted
  await db
    .update(workspaceInvites)
    .set({ acceptedAt: now })
    .where(eq(workspaceInvites.id, invite.id));

  return invite.workspace;
}

export async function revokeInvite(inviteId: string, workspaceId: string) {
  await db
    .delete(workspaceInvites)
    .where(
      and(
        eq(workspaceInvites.id, inviteId),
        eq(workspaceInvites.workspaceId, workspaceId)
      )
    );
}
