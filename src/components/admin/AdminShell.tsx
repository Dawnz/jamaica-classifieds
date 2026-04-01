'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin',            icon: '📊', label: 'Dashboard' },
  { href: '/admin/listings',   icon: '📋', label: 'Listings' },
  { href: '/admin/categories', icon: '📂', label: 'Categories' },
  { href: '/admin/users',      icon: '👥', label: 'Users' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--subtle)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: 'var(--ink)', flexShrink: 0,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold)', fontSize: '1.1rem', fontWeight: 900 }}>
            JC Admin
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,.4)', marginTop: 2 }}>
            Jamaica Classifieds
          </div>
        </div>
        <nav style={{ flex: 1, padding: '0.75rem 0' }}>
          {NAV.map(item => {
            const active = path === item.href
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0.6rem 1rem', textDecoration: 'none',
                fontSize: '0.875rem', fontWeight: 500,
                color: active ? '#fff' : 'rgba(255,255,255,.55)',
                background: active ? 'rgba(255,255,255,.1)' : 'transparent',
                borderLeft: active ? '3px solid var(--gold)' : '3px solid transparent',
                transition: 'all 0.1s',
              }}>
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <Link href="/" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,.4)', textDecoration: 'none' }}>
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <header style={{
          background: '#fff', borderBottom: '1px solid var(--border)',
          padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h1 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink)' }}>
            {NAV.find(n => n.href === path)?.label ?? 'Admin'}
          </h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
            {new Date().toLocaleDateString('en-JM', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </header>
        <div style={{ padding: '1.5rem' }}>{children}</div>
      </div>
    </div>
  )
}
