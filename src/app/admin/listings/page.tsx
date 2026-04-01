import { requireAdmin } from '@/lib/admin-guard'
import { prisma } from '@/lib/prisma'
import AdminShell from '@/components/admin/AdminShell'
import AdminListingsTable from '@/components/admin/AdminListingsTable'

export const dynamic = 'force-dynamic'

type SP = { status?: string; tier?: string; q?: string; page?: string }

export default async function AdminListingsPage({ searchParams }: { searchParams: SP }) {
  await requireAdmin()
  const now = new Date()
  const page = Math.max(1, Number(searchParams.page ?? 1))
  const PAGE = 30

  const where: any = {
    ...(searchParams.status === 'EXPIRED'
      ? { OR: [{ status: 'EXPIRED' }, { expiresAt: { lte: now } }] }
      : searchParams.status ? { status: searchParams.status } : {}),
    ...(searchParams.tier ? { tier: searchParams.tier } : {}),
    ...(searchParams.q ? { title: { contains: searchParams.q, mode: 'insensitive' } } : {}),
  }

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where, orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE, take: PAGE,
      include: { category: true, user: { select: { name: true, email: true } } },
    }),
    prisma.listing.count({ where }),
  ])

  return (
    <AdminShell>
      <AdminListingsTable listings={listings as any} total={total} page={page} pages={Math.ceil(total / PAGE)} searchParams={searchParams} />
    </AdminShell>
  )
}
