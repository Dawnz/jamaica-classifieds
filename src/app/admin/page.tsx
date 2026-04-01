import { requireAdmin } from '@/lib/admin-guard'
import { prisma } from '@/lib/prisma'
import AdminShell from '@/components/admin/AdminShell'
import StatCard from '@/components/admin/StatCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  await requireAdmin()
  const now = new Date()

  const [totalListings, activeListings, premiumListings, expiredListings,
         totalUsers, totalCategories, recentListings] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { status: 'ACTIVE', expiresAt: { gt: now } } }),
    prisma.listing.count({ where: { tier: 'PREMIUM', status: 'ACTIVE' } }),
    prisma.listing.count({ where: { OR: [{ status: 'EXPIRED' }, { expiresAt: { lte: now } }] } }),
    prisma.user.count(),
    prisma.category.count({ where: { isActive: true } }),
    prisma.listing.findMany({
      orderBy: { createdAt: 'desc' }, take: 8,
      include: { category: true, user: { select: { name: true, email: true } } },
    }),
  ])

  const stats = [
    { label: 'Active Listings',  value: activeListings,  icon: '📋', color: '#1A7A3C', href: '/admin/listings?status=ACTIVE' },
    { label: 'Premium Listings', value: premiumListings, icon: '⭐', color: '#C9961E', href: '/admin/listings?tier=PREMIUM' },
    { label: 'Expired Listings', value: expiredListings, icon: '⏳', color: '#6B7280', href: '/admin/listings?status=EXPIRED' },
    { label: 'Total Users',      value: totalUsers,      icon: '👥', color: '#185FA5', href: '/admin/users' },
    { label: 'Total Listings',   value: totalListings,   icon: '📦', color: '#115529', href: '/admin/listings' },
    { label: 'Categories',       value: totalCategories, icon: '📂', color: '#6B3FA0', href: '/admin/categories' },
  ]

  return (
    <AdminShell>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: '2rem' }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Recent listings table */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Recent Listings</h2>
          <Link href="/admin/listings" style={{ fontSize: '0.8rem', color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--subtle)' }}>
                {['Title','Category','Posted by','Status','Tier','Created','Actions'].map(h => (
                  <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentListings.map((l, i) => {
                const expired = new Date(l.expiresAt) < now
                const s = expired ? 'EXPIRED' : l.status
                const statusColors: Record<string, [string,string]> = {
                  ACTIVE: ['#D1FAE5','#065F46'], EXPIRED: ['#F3F4F6','#6B7280'],
                  PENDING: ['#FEF3C7','#92400E'], REMOVED: ['#FEE2E2','#991B1B'],
                }
                const [sbg, sc] = statusColors[s] ?? ['#F3F4F6','#6B7280']
                return (
                  <tr key={l.id} style={{ borderTop: '1px solid var(--border)', background: i%2===0?'#fff':'rgba(0,0,0,.01)' }}>
                    <td style={{ padding: '0.75rem 1rem', maxWidth: 240 }}>
                      <Link href={`/listings/${l.id}`} style={{ color: 'var(--ink)', fontWeight: 600, textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {l.title}
                      </Link>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{l.category.icon} {l.category.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{l.user.name ?? l.user.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ background: sbg, color: sc, fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{s}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {l.tier === 'PREMIUM'
                        ? <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>⭐ PREMIUM</span>
                        : <span style={{ background: 'var(--subtle)', color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>FREE</span>
                      }
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--muted)', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                      {new Date(l.createdAt).toLocaleDateString('en-JM')}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/listings/${l.id}`} style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 6, border: '1px solid #185FA5', color: '#185FA5', textDecoration: 'none' }}>View</Link>
                        <Link href={`/admin/listings`} style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 6, border: '1px solid #1A7A3C', color: '#1A7A3C', textDecoration: 'none' }}>Manage</Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
