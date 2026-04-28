import { db } from "@/lib/db/drizzle";
import { billing, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isPostgresConfigured } from "@/lib/db/postgres";

export { isPostgresConfigured } from "@/lib/db/postgres";

export type BillingCycle = "monthly" | "annual";
export type BillingPlan = "free" | "pro" | "agency";

function toBillingState(row: any | null) {
  return {
    ownerId: row?.ownerId ?? null,
    plan: (row?.plan as BillingPlan) ?? "free",
    cycle: (row?.cycle as BillingCycle) ?? null,
    stripeCustomerId: row?.stripeCustomerId ?? null,
    stripeSubscriptionId: row?.stripeSubscriptionId ?? null,
    stripeSessionId: row?.stripeSessionId ?? null,
    stripeInvoiceId: row?.stripeInvoiceId ?? null,
    stripeInvoiceUrl: row?.stripeInvoiceUrl ?? null,
    stripeStatus: row?.stripeStatus ?? null,
    createdAt: row ? row.createdAt.toISOString() : null,
    updatedAt: row ? row.updatedAt.toISOString() : null,
  };
}

export async function getBillingState(ownerId: string) {
  if (!isPostgresConfigured()) return toBillingState(null);

  const result = await db.query.billing.findFirst({
    where: eq(billing.ownerId, ownerId),
  });

  return toBillingState(result ?? null);
}

export async function findBillingOwnerIdByStripeCustomerId(stripeCustomerId: string) {
  if (!isPostgresConfigured()) return null;

  const result = await db.query.billing.findFirst({
    where: eq(billing.stripeCustomerId, stripeCustomerId),
    columns: {
      ownerId: true,
    },
  });

  return result?.ownerId ?? null;
}

export async function upsertBillingState({
  ownerId,
  plan,
  cycle,
  stripeCustomerId,
  stripeSubscriptionId,
  stripeSessionId,
  stripeInvoiceId,
  stripeInvoiceUrl,
  stripeStatus,
}: {
  ownerId: string;
  plan: BillingPlan;
  cycle?: BillingCycle | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripeSessionId?: string | null;
  stripeInvoiceId?: string | null;
  stripeInvoiceUrl?: string | null;
  stripeStatus?: string | null;
}) {
  return await db.transaction(async (tx) => {
    const [row] = await tx.insert(billing)
      .values({
        ownerId,
        plan,
        cycle: cycle ?? null,
        stripeCustomerId: stripeCustomerId ?? null,
        stripeSubscriptionId: stripeSubscriptionId ?? null,
        stripeSessionId: stripeSessionId ?? null,
        stripeInvoiceId: stripeInvoiceId ?? null,
        stripeInvoiceUrl: stripeInvoiceUrl ?? null,
        stripeStatus: stripeStatus ?? null,
      })
      .onConflictDoUpdate({
        target: billing.ownerId,
        set: {
          plan,
          cycle: cycle ?? undefined,
          stripeCustomerId: stripeCustomerId ?? undefined,
          stripeSubscriptionId: stripeSubscriptionId ?? undefined,
          stripeSessionId: stripeSessionId ?? undefined,
          stripeInvoiceId: stripeInvoiceId ?? undefined,
          stripeInvoiceUrl: stripeInvoiceUrl ?? undefined,
          stripeStatus: stripeStatus ?? undefined,
          updatedAt: new Date(),
        }
      })
      .returning();

    // Also update the tier in the user table for redundancy/ease of access
    await tx.update(users)
      .set({
        tier: plan,
        updatedAt: new Date()
      })
      .where(eq(users.id, ownerId));

    return toBillingState(row);
  });
}
