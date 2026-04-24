import { db } from "@/lib/db/client"
import crypto from "node:crypto"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!)
    const digest = hmac.update(rawBody).digest('hex')
    const signature = req.headers.get('x-signature')

    if (signature !== digest) {
      return new Response('Invalid signature', { status: 401 })
    }

    const payload = JSON.parse(rawBody)
    const eventName = payload.meta.event_name
    const customData = payload.meta.custom_data

    if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
      const userId = customData.user_id
      const variantId = payload.data.attributes.variant_id
      
      let tier = 'free'
      if (variantId === Number(process.env.LEMON_SQUEEZY_PRO_VARIANT_ID)) tier = 'pro'
      if (variantId === Number(process.env.LEMON_SQUEEZY_AGENCY_VARIANT_ID)) tier = 'agency'

      await db.query(
        'UPDATE users SET tier = $1 WHERE id = $2',
        [tier, userId]
      )
    }

    if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
      const userId = customData.user_id
      await db.query(
        "UPDATE users SET tier = 'free' WHERE id = $1",
        [userId]
      )
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
