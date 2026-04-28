import { NextRequest } from "next/server";
import { getCurrentUserId } from "@/lib/auth/session";
import { getStripe } from "@/lib/stripe";
import { BillingPlan, BillingCycle } from "@/lib/db/billing";
import { getStripePriceId, SUBSCRIPTION_TIERS } from "@/lib/subscriptions";

export const runtime = "nodejs";

function getPlanAndCycle(searchParams: URLSearchParams) {
  const planParam = searchParams.get("plan");
  const cycleParam = searchParams.get("cycle");

  const plan: BillingPlan = (["pro", "agency"] as string[]).includes(planParam ?? "")
    ? (planParam as BillingPlan)
    : "pro";

  const cycle: BillingCycle = cycleParam === "annual" ? "annual" : "monthly";

  return { plan, cycle } as const;
}

export async function GET(req: NextRequest) {
  const { plan, cycle } = getPlanAndCycle(req.nextUrl.searchParams);
  const priceId = getStripePriceId(plan, cycle);

  if (!priceId) {
    return Response.redirect(
      new URL(
        `/pricing?error=invalid_plan&plan=${encodeURIComponent(plan)}&cycle=${encodeURIComponent(cycle)}`,
        req.url,
      ).toString(),
      302,
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;
  const stripe = getStripe();
  const ownerId = await getCurrentUserId();

  if (!ownerId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", `/billing?plan=${encodeURIComponent(plan)}&cycle=${encodeURIComponent(cycle)}`);
    return Response.redirect(signInUrl.toString(), 302);
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/api/billing/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled&plan=${encodeURIComponent(plan)}&cycle=${encodeURIComponent(cycle)}`,
      client_reference_id: ownerId,
      metadata: {
        plan,
        cycle,
        ownerId,
      },
      subscription_data: {
        metadata: {
          plan,
          cycle,
          ownerId,
        },
      },
      allow_promotion_codes: true,
    });

    if (!session.url) {
      throw new Error("Stripe session URL is missing");
    }

    return Response.redirect(session.url, 303);
  } catch (error) {
    console.error("[MintWrite] Stripe checkout creation failed:", error);
    return new Response(JSON.stringify({ error: "Unable to initiate checkout." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
