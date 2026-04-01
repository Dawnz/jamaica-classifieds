import { requireAdmin } from '@/lib/admin-guard'
import { prisma } from '@/lib/prisma'
import AdminShell from '@/components/admin/AdminShell'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  await requireAdmin()
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { listings: true } } },
  })

  return (
    <AdminShell>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'auto' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>All Users</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{users.length} total</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--subtle)' }}>
              {['Name','Email','Role','Listings','Parish','Joined','Actions'].map(h => (
                <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--muted)', fontSize: '0.72rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} style={{ borderTop: '1px solid var(--border)', background: i%2===0?'#fff':'rgba(0,0,0,.01)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{u.name ?? '—'}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--muted)' }}>{u.email}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ background: u.role === 'ADMIN' ? '#FEF3C7' : 'var(--subtle)', color: u.role === 'ADMIN' ? '#92400E' : 'var(--muted)', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--muted)', textAlign: 'center' }}>{u._count.listings}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--muted)' }}>{u.parish ?? '—'}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  {new Date(u.createdAt).toLocaleDateString('en-JM')}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <a href={`/browse?user=${u.id}`} style={{ fontSize: '0.75rem', color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>View Ads</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}
