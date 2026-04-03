export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2024-06-20' })

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { listingId } = await req.json()

  const listing = await prisma.listing.findUnique({ where: { id: listingId }, include: { category: true } })
  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  if (listing.userId !== (session.user as any).id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'jmd',
        product_data: {
          name: '⭐ Premium Ad — Jamaica Classifieds',
          description: `Boost: ${listing.title}`,
          images: [],
        },
        unit_amount: 150000, // J$1,500 in cents
      },
      quantity: 1,
    }],
    metadata: { listingId, userId: (session.user as any).id },
    success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel?listing=${listingId}`,
  })

  // Create pending payment record
  await prisma.payment.upsert({
    where: { listingId },
    update: { stripeSessionId: checkoutSession.id, status: 'PENDING' },
    create: {
      amount: 150000,
      currency: 'jmd',
      status: 'PENDING',
      stripeSessionId: checkoutSession.id,
      userId: (session.user as any).id,
      listingId,
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}

