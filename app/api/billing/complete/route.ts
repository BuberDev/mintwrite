import { NextRequest } from "next/server";
import { upsertBillingState, BillingPlan } from "@/lib/db/billing";
import { getStripe } from "@/lib/stripe";
import { getCurrentUserId } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

export const runtime = "nodejs";

type BillingCycle = "monthly" | "annual";

function toBillingCycle(value: unknown): BillingCycle {
  return value === "annual" ? "annual" : "monthly";
}

function getTierForPlan(plan: unknown): BillingPlan {
  if (plan === "enterprise" || plan === "pro" || plan === "standard") {
    return plan as BillingPlan;
  }
  return "standard";
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Missing session_id." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.mode !== "subscription") {
      return new Response(JSON.stringify({ error: "Checkout session is not a subscription." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (session.payment_status !== "paid" && session.status !== "complete") {
      return new Response(JSON.stringify({ error: "Checkout session is not paid." }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ownerId = session.client_reference_id || (await getCurrentUserId());
    if (!ownerId) {
      return new Response(JSON.stringify({ error: "Unauthorized." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    let stripeInvoiceUrl: string | null = null;
    if (typeof session.invoice === "string") {
      try {
        const invoice = await stripe.invoices.retrieve(session.invoice);
        stripeInvoiceUrl = invoice.hosted_invoice_url ?? invoice.invoice_pdf ?? null;
      } catch (invoiceError) {
        console.error("[MintWrite] Failed to retrieve Stripe invoice:", invoiceError);
      }
    }

    const plan = getTierForPlan(session.metadata?.plan);
    const tier = plan;

    await db.query("UPDATE users SET tier = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [tier, ownerId]);

    await upsertBillingState({
      ownerId,
      plan,
      cycle: toBillingCycle(session.metadata?.cycle),
      stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
      stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : null,
      stripeSessionId: session.id,
      stripeInvoiceId: typeof session.invoice === "string" ? session.invoice : null,
      stripeInvoiceUrl,
      stripeStatus: session.payment_status ?? session.status ?? null,
    });

    return Response.redirect(new URL("/account?billing=success", req.url).toString(), 303);
  } catch (error) {
    console.error("[MintWrite] Failed to confirm Stripe checkout:", error);
    return new Response(JSON.stringify({ error: "Failed to confirm checkout." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
