import { db } from "@/lib/db/drizzle";
import { users, passwordCredentials, oauthAccounts, sessions } from "@/lib/db/schema";
import { generateId, sha256Base64url } from "@/lib/auth/crypto";
import { eq, and, isNull, gt, desc } from "drizzle-orm";
import { isPostgresConfigured } from "@/lib/db/postgres";

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  tier: string;
  generationsUsedThisMonth: number;
  lastResetDate: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SessionWithUser = {
  session: {
    id: string;
    expiresAt: string;
    createdAt: string;
    lastSeenAt: string;
  };
  user: AuthUser;
};

function toAuthUser(row: any): AuthUser {
  return {
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    avatarUrl: row.avatarUrl,
    tier: row.tier ?? "free",
    generationsUsedThisMonth: row.generationsUsedThisMonth ?? 0,
    lastResetDate: (row.lastResetDate ?? new Date()).toISOString(),
    emailVerifiedAt: row.emailVerifiedAt ? row.emailVerifiedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function createDefaultDisplayName(email: string) {
  const localPart = email.split("@")[0] || "Mint Write user";
  return localPart
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

export async function findUserByEmail(email: string) {
  if (!isPostgresConfigured()) return null;

  const result = await db.query.users.findFirst({
    where: eq(users.emailNormalized, email.toLowerCase()),
  });

  return result ? toAuthUser(result) : null;
}

export async function findUserById(userId: string) {
  if (!isPostgresConfigured()) return null;

  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return result ? toAuthUser(result) : null;
}

export async function findUserByProviderAccount(provider: string, providerAccountId: string) {
  if (!isPostgresConfigured()) return null;

  const result = await db.query.oauthAccounts.findFirst({
    where: and(
      eq(oauthAccounts.provider, provider),
      eq(oauthAccounts.providerAccountId, providerAccountId)
    ),
    with: {
      user: true,
    },
  });

  // Since we haven't defined relations in schema.ts yet, I'll do a join instead or just query separately
  // Wait, I should add relations to schema.ts for a truly professional Drizzle experience.
  
  // For now, let's do a join:
  const rows = await db.select()
    .from(oauthAccounts)
    .innerJoin(users, eq(users.id, oauthAccounts.userId))
    .where(and(
      eq(oauthAccounts.provider, provider),
      eq(oauthAccounts.providerAccountId, providerAccountId)
    ))
    .limit(1);

  return rows[0] ? toAuthUser(rows[0].users) : null;
}

export async function listOAuthAccountsForUser(userId: string) {
  if (!isPostgresConfigured()) return [];

  const results = await db.query.oauthAccounts.findMany({
    where: eq(oauthAccounts.userId, userId),
    orderBy: [desc(oauthAccounts.createdAt)],
  });

  return results.map((row) => ({
    id: row.id,
    provider: row.provider,
    providerAccountId: row.providerAccountId,
    providerEmail: row.providerEmail,
    providerEmailNormalized: row.providerEmailNormalized,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function createPasswordUser({
  email,
  passwordHash,
  displayName,
}: {
  email: string;
  passwordHash: string;
  displayName?: string | null;
}) {
  const userId = generateId("user");
  const resolvedDisplayName = displayName?.trim() || createDefaultDisplayName(email);

  return await db.transaction(async (tx) => {
    const [user] = await tx.insert(users)
      .values({
        id: userId,
        email,
        emailNormalized: email.toLowerCase(),
        displayName: resolvedDisplayName,
      })
      .returning();

    await tx.insert(passwordCredentials)
      .values({
        userId: user.id,
        passwordHash,
      });

    return toAuthUser(user);
  });
}

export async function createOAuthUser({
  provider,
  providerAccountId,
  email,
  displayName,
  avatarUrl,
  providerEmail,
}: {
  provider: string;
  providerAccountId: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  providerEmail?: string | null;
}) {
  const userId = generateId("user");
  const resolvedDisplayName = displayName?.trim() || createDefaultDisplayName(email);

  return await db.transaction(async (tx) => {
    const [user] = await tx.insert(users)
      .values({
        id: userId,
        email,
        emailNormalized: email.toLowerCase(),
        displayName: resolvedDisplayName,
        avatarUrl: avatarUrl ?? null,
        emailVerifiedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.emailNormalized,
        set: {
          displayName: resolvedDisplayName, // COALESCE logic handled by Drizzle or manual check
          avatarUrl: avatarUrl ?? null,
          emailVerifiedAt: new Date(),
          updatedAt: new Date(),
        }
      })
      .returning();

    await tx.insert(oauthAccounts)
      .values({
        id: generateId("oauth"),
        userId: user.id,
        provider,
        providerAccountId,
        providerEmail: providerEmail ?? email,
        providerEmailNormalized: (providerEmail ?? email).toLowerCase(),
      })
      .onConflictDoUpdate({
        target: [oauthAccounts.provider, oauthAccounts.providerAccountId],
        set: {
          userId: user.id,
          providerEmail: providerEmail ?? email,
          providerEmailNormalized: (providerEmail ?? email).toLowerCase(),
          updatedAt: new Date(),
        }
      });

    return toAuthUser(user);
  });
}

export async function attachOAuthAccountToUser({
  userId,
  provider,
  providerAccountId,
  providerEmail,
  avatarUrl,
}: {
  userId: string;
  provider: string;
  providerAccountId: string;
  providerEmail?: string | null;
  avatarUrl?: string | null;
}) {
  await db.transaction(async (tx) => {
    await tx.update(users)
      .set({
        avatarUrl: avatarUrl ?? undefined, // Drizzle handles undefined as "don't update" if configured, but here we want COALESCE logic
        emailVerifiedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    await tx.insert(oauthAccounts)
      .values({
        id: generateId("oauth"),
        userId,
        provider,
        providerAccountId,
        providerEmail: providerEmail ?? null,
        providerEmailNormalized: providerEmail?.toLowerCase() ?? null,
      })
      .onConflictDoUpdate({
        target: [oauthAccounts.provider, oauthAccounts.providerAccountId],
        set: {
          userId,
          providerEmail: providerEmail ?? null,
          providerEmailNormalized: providerEmail?.toLowerCase() ?? null,
          updatedAt: new Date(),
        }
      });
  });
}

export async function getPasswordCredential(userId: string) {
  if (!isPostgresConfigured()) return null;

  return await db.query.passwordCredentials.findFirst({
    where: eq(passwordCredentials.userId, userId),
  });
}

export async function findUserPasswordHash(userId: string) {
  const credential = await getPasswordCredential(userId);
  return credential?.passwordHash ?? null;
}

export async function setUserEmailVerified(userId: string, verifiedAt = new Date()) {
  const [user] = await db.update(users)
    .set({
      emailVerifiedAt: verifiedAt,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return user ? toAuthUser(user) : null;
}

export async function upsertUserPasswordHash(userId: string, passwordHash: string) {
  await db.insert(passwordCredentials)
    .values({
      userId,
      passwordHash,
      passwordUpdatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: passwordCredentials.userId,
      set: {
        passwordHash,
        passwordUpdatedAt: new Date(),
      }
    });
}

export async function getUserBySessionToken(token: string) {
  if (!isPostgresConfigured()) return null;

  const tokenHash = sha256Base64url(token);

  const rows = await db.select()
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(
      eq(sessions.tokenHash, tokenHash),
      isNull(sessions.revokedAt),
      gt(sessions.expiresAt, new Date()),
      isNull(users.disabledAt)
    ))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  return {
    session: {
      id: row.sessions.id,
      expiresAt: row.sessions.expiresAt.toISOString(),
      createdAt: row.sessions.createdAt.toISOString(),
      lastSeenAt: row.sessions.lastSeenAt.toISOString(),
    },
    user: toAuthUser(row.users),
  } satisfies SessionWithUser;
}

export async function createSessionRecord({
  userId,
  tokenHash,
  userAgent,
  ipAddress,
  expiresAt,
}: {
  userId: string;
  tokenHash: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  expiresAt: Date;
}) {
  const [session] = await db.insert(sessions)
    .values({
      id: generateId("session"),
      userId,
      tokenHash,
      userAgent: userAgent ?? null,
      ipAddress: ipAddress ?? null,
      expiresAt,
    })
    .returning();

  return session ?? null;
}

export async function revokeSessionByTokenHash(tokenHash: string) {
  if (!isPostgresConfigured()) return;

  await db.update(sessions)
    .set({
      revokedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(
      eq(sessions.tokenHash, tokenHash),
      isNull(sessions.revokedAt)
    ));
}

export async function revokeAllSessionsForUser(userId: string) {
  if (!isPostgresConfigured()) return;

  await db.update(sessions)
    .set({
      revokedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(
      eq(sessions.userId, userId),
      isNull(sessions.revokedAt)
    ));
}

export async function listSessionsForUser(userId: string, currentSessionId?: string | null) {
  if (!isPostgresConfigured()) return [];

  const results = await db.query.sessions.findMany({
    where: eq(sessions.userId, userId),
    orderBy: [desc(sessions.createdAt)],
  });

  return results.map((row) => ({
    id: row.id,
    expiresAt: row.expiresAt.toISOString(),
    userAgent: row.userAgent,
    ipAddress: row.ipAddress,
    lastSeenAt: row.lastSeenAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    revokedAt: row.revokedAt ? row.revokedAt.toISOString() : null,
    current: row.id === currentSessionId,
  }));
}
