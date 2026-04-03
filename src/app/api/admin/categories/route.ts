export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-guard'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  if (!await requireAdminApi()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await req.json()

  // If categoryId provided, it's a sub-category
  if (body.categoryId) {
    const sub = await prisma.subCategory.create({
      data: { name: body.name, slug: body.slug, categoryId: body.categoryId },
    })
    return NextResponse.json(sub, { status: 201 })
  }

  const cat = await prisma.category.create({
    data: { name: body.name, slug: body.slug, icon: body.icon || null, order: body.order ?? 99 },
  })
  return NextResponse.json(cat, { status: 201 })
}

