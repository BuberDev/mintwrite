import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js"

export const setupLemonSqueezy = () => {
  lemonSqueezySetup({
    apiKey: process.env.LEMON_SQUEEZY_API_KEY!,
    onError: (error) => console.error("Lemon Squeezy error:", error),
  })
}

export const createSubscriptionCheckout = async (userId: string, variantId: string) => {
  setupLemonSqueezy()
  
  const checkout = await createCheckout(
    process.env.LEMON_SQUEEZY_STORE_ID!,
    variantId,
    {
      checkoutData: {
        custom: {
          user_id: userId,
        },
      },
      productOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    }
  )

  return checkout.data?.data.attributes.url
}
