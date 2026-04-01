import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-guard'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!await requireAdminApi()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const data = await req.json()
  const cat = await prisma.category.update({ where: { id: params.id }, data })
  return NextResponse.json(cat)
}
