'use client'
import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'
import type { CategoryWithCount } from '@/types'
import { PARISHES } from '@/types'

type Props = { categories: CategoryWithCount[] }

export default function Sidebar({ categories }: Props) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const activeCat = searchParams.get('category') ?? ''
  const activeParish = searchParams.get('parish') ?? ''

  function buildUrl(params: Record<string, string>) {
    const p = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([k, v]) => {
      if (v) p.set(k, v); else p.delete(k)
    })
    p.delete('page')
    return `/browse?${p.toString()}`
  }

  const totalListings = categories.reduce((s, c) => s + c._count.listings, 0)

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Categories */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{
          background: 'var(--green)', color: '#fff', fontSize: '0.75rem',
          fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
          padding: '0.65rem 1rem',
        }}>Categories</div>
        <ul style={{ listStyle: 'none' }}>
          <SidebarItem
            href={buildUrl({ category: '', parish: activeParish })}
            icon="🏠" label="All Categories"
            count={totalListings} active={!activeCat}
          />
          {categories.map(cat => (
            <SidebarItem
              key={cat.id}
              href={buildUrl({ category: cat.slug, parish: activeParish })}
              icon={cat.icon ?? '📦'}
              label={cat.name}
              count={cat._count.listings}
              active={activeCat === cat.slug}
            />
          ))}
        </ul>
      </div>

      {/* Parish filter */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{
          background: 'var(--green)', color: '#fff', fontSize: '0.75rem',
          fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
          padding: '0.65rem 1rem',
        }}>Filter by Parish</div>
        <ul style={{ listStyle: 'none' }}>
          <SidebarItem
            href={buildUrl({ parish: '' })}
            icon="📍" label="All Parishes"
            active={!activeParish}
          />
          {PARISHES.map(p => (
            <SidebarItem
              key={p}
              href={buildUrl({ parish: p })}
              icon="📍" label={p}
              active={activeParish === p}
            />
          ))}
        </ul>
      </div>
    </aside>
  )
}

function SidebarItem({ href, icon, label, count, active }: {
  href: string; icon: string; label: string; count?: number; active: boolean
}) {
  return (
    <li>
      <Link href={href} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0.5rem 1rem', textDecoration: 'none',
        color: active ? 'var(--green)' : 'var(--ink)',
        fontSize: '0.875rem', fontWeight: active ? 600 : 400,
        borderBottom: '1px solid var(--border)',
        background: active ? 'var(--green-light)' : 'transparent',
        borderLeft: active ? '3px solid var(--green)' : '3px solid transparent',
        transition: 'all 0.1s',
      }}>
        <span style={{ fontSize: '0.95rem', width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
        <span style={{ flex: 1, lineHeight: 1.3 }}>{label}</span>
        {count !== undefined && (
          <span style={{
            fontSize: '0.72rem', background: active ? 'rgba(26,122,60,0.12)' : 'var(--subtle)',
            color: active ? 'var(--green)' : 'var(--muted)',
            padding: '1px 7px', borderRadius: 20, flexShrink: 0,
          }}>{count.toLocaleString()}</span>
        )}
      </Link>
    </li>
  )
}
