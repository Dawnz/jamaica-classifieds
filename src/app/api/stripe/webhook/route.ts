import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2024-06-20' })

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? '')
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const listingId = session.metadata?.listingId

    if (listingId) {
      // Upgrade listing to PREMIUM and extend expiry by 60 days
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 60)

      await prisma.listing.update({
        where: { id: listingId },
        data: { tier: 'PREMIUM', expiresAt, status: 'ACTIVE' },
      })

      await prisma.payment.update({
        where: { listingId },
        data: { status: 'COMPLETED', stripePaymentId: session.payment_intent as string },
      })
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    const listingId = session.metadata?.listingId
    if (listingId) {
      await prisma.payment.updateMany({ where: { listingId, status: 'PENDING' }, data: { status: 'FAILED' } })
    }
  }

  return NextResponse.json({ received: true })
}
