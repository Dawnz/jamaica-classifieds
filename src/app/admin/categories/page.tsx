import { requireAdmin } from '@/lib/admin-guard'
import { prisma } from '@/lib/prisma'
import AdminShell from '@/components/admin/AdminShell'
import AdminCategoriesClient from '@/components/admin/AdminCategoriesClient'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  await requireAdmin()
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      subCategories: { orderBy: { name: 'asc' } },
      _count: { select: { listings: true } },
    },
  })
  return <AdminShell><AdminCategoriesClient categories={categories as any} /></AdminShell>
}
