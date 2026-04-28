import { getCurrentUserId } from "@/lib/auth/session";
import { getBillingState, isPostgresConfigured } from "@/lib/db/billing";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function serviceUnavailable() {
  return new Response(
    JSON.stringify({
      error: "Postgres is not configured. Set POSTGRES_URL (and related vars) in .env.local.",
    }),
    { status: 503, headers: { "Content-Type": "application/json" } },
  );
}

export async function GET(req: Request) {
  if (!isPostgresConfigured()) {
    return serviceUnavailable();
  }

  try {
    const ownerId = await getCurrentUserId();
    if (!ownerId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", "/account");
      return Response.redirect(signInUrl.toString(), 302);
    }
    const billing = await getBillingState(ownerId);

    if (!billing.stripeCustomerId) {
      return new Response(JSON.stringify({ error: "No active Stripe customer found." }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
    const session = await stripe.billingPortal.sessions.create({
      customer: billing.stripeCustomerId,
      return_url: `${appUrl}/account`,
    });

    return Response.redirect(session.url, 303);
  } catch (error) {
    console.error("[MintWrite] Failed to create billing portal session:", error);
    return new Response(JSON.stringify({ error: "Failed to open billing portal." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
