import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { findBillingOwnerIdByStripeCustomerId, upsertBillingState, BillingPlan } from "@/lib/db/billing";
import { db } from "@/lib/db/drizzle";
import { users, billing } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getPlanFromMetadata(metadata: Record<string, string> | null | undefined): BillingPlan {
  const plan = metadata?.plan;
  if (plan === "pro" || plan === "agency") {
    return plan as BillingPlan;
  }
  return "free";
}

function getPlanFromPriceId(priceId: string | undefined): BillingPlan | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRO_MONTHLY_PRICE_ID) return "pro";
  if (priceId === process.env.STRIPE_PRO_ANNUAL_PRICE_ID) return "pro";
  if (priceId === process.env.STRIPE_AGENCY_MONTHLY_PRICE_ID) return "agency";
  if (priceId === process.env.STRIPE_AGENCY_ANNUAL_PRICE_ID) return "agency";
  return null;
}

function getCycleFromPriceId(priceId: string | undefined): "monthly" | "annual" | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRO_ANNUAL_PRICE_ID || priceId === process.env.STRIPE_AGENCY_ANNUAL_PRICE_ID) {
    return "annual";
  }
  return "monthly";
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    console.error("[MintWrite] Invalid Stripe webhook signature:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const ownerId =
          (typeof session.client_reference_id === "string" && session.client_reference_id) ||
          (typeof session.customer === "string" ? await findBillingOwnerIdByStripeCustomerId(session.customer) : null);

        if (!ownerId) {
          break;
        }

        const plan = getPlanFromMetadata(session.metadata);
        const cycle = session.metadata?.cycle === "annual" ? "annual" : "monthly";

        // Update user tier directly
        await db.update(users)
          .set({ tier: plan, updatedAt: new Date() })
          .where(eq(users.id, ownerId));

        let stripeInvoiceUrl: string | null = null;
        if (typeof session.invoice === "string") {
          try {
            const invoice = await stripe.invoices.retrieve(session.invoice);
            stripeInvoiceUrl = invoice.hosted_invoice_url ?? invoice.invoice_pdf ?? null;
          } catch (invoiceError) {
            console.error("[MintWrite] Failed to fetch invoice in webhook:", invoiceError);
          }
        }

        await upsertBillingState({
          ownerId,
          plan,
          cycle,
          stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
          stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : null,
          stripeSessionId: session.id,
          stripeInvoiceId: typeof session.invoice === "string" ? session.invoice : null,
          stripeInvoiceUrl,
          stripeStatus: session.payment_status ?? session.status ?? null,
        });
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === "string" ? subscription.customer : null;
        if (!customerId) break;

        const ownerId = await findBillingOwnerIdByStripeCustomerId(customerId);
        if (!ownerId) break;

        const priceId = subscription.items?.data?.[0]?.price?.id;
        const derivedPlan = getPlanFromPriceId(priceId);
        const derivedCycle = getCycleFromPriceId(priceId);

        const plan = derivedPlan || getPlanFromMetadata(subscription.metadata);
        const cycle = derivedCycle || (subscription.metadata?.cycle === "annual" ? "annual" : "monthly");
        const activePlan = event.type === "customer.subscription.deleted" ? "free" : plan;

        await db.update(users)
          .set({ tier: activePlan, updatedAt: new Date() })
          .where(eq(users.id, ownerId));

        await upsertBillingState({
          ownerId,
          plan: activePlan,
          cycle,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          stripeStatus: subscription.status ?? null,
        });
        break;
      }
      case "invoice.payment_succeeded":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
        if (!customerId) break;

        const ownerId = await findBillingOwnerIdByStripeCustomerId(customerId);
        if (!ownerId) break;

        // Fetch current billing state to preserve plan if needed
        const currentBilling = await db.query.billing.findFirst({
          where: eq(billing.ownerId, ownerId),
          columns: { plan: true }
        });
        const currentPlan = (currentBilling?.plan as BillingPlan) || "free";

        const invoiceAny = invoice as unknown as { subscription?: string | null };
        const subscription = typeof invoiceAny.subscription === "string" ? invoiceAny.subscription : null;
        const status = event.type === "invoice.payment_succeeded" ? "active" : "past_due";

        await upsertBillingState({
          ownerId,
          plan: currentPlan,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription,
          stripeInvoiceId: invoice.id,
          stripeInvoiceUrl: invoice.hosted_invoice_url ?? invoice.invoice_pdf ?? null,
          stripeStatus: status,
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[MintWrite] Stripe webhook handling failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
