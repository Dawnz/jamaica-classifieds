import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { images: true, category: true, subCategory: true, fields: true, user: { select: { name: true, image: true, createdAt: true } } },
  })
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(listing)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const listing = await prisma.listing.findUnique({ where: { id: params.id } })
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const isOwner = listing.userId === (session.user as any).id
  const isAdmin = (session.user as any).role === 'ADMIN'
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await prisma.listing.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
