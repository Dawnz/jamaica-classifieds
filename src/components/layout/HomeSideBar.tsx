import Link from 'next/link'
import type { CategoryWithCount } from '@/types'

type Props = { categories: CategoryWithCount[]; totalListings: number }

export default function HomeSidebar({ categories, totalListings }: Props) {
  return (
    <aside style={{ position: 'sticky', top: 70 }}>
      <div style={{ background: '#fff', border: '1px solid #E5E5E0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ background: '#1A7A3C', color: '#fff', padding: '0.6rem 0.875rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Categories
        </div>
        <Link href="/browse" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.5rem 0.875rem', textDecoration: 'none', fontSize: '0.8rem',
          fontWeight: 600, color: '#1A7A3C', background: '#E8F5ED',
          borderBottom: '1px solid #E5E5E0', borderLeft: '3px solid #1A7A3C',
        }}>
          <span>🏠 All Categories</span>
          <span style={{ fontSize: '0.7rem', background: 'rgba(26,122,60,0.12)', color: '#1A7A3C', padding: '1px 6px', borderRadius: 20 }}>
            {totalListings}
          </span>
        </Link>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {categories.map(cat => (
            <li key={cat.id}>
              <Link href={`/browse?category=${cat.slug}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.45rem 0.875rem', textDecoration: 'none', fontSize: '0.8rem',
                color: '#1D2124', borderBottom: '1px solid #F4F4F2',
                borderLeft: '3px solid transparent',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '0.85rem', width: 18, textAlign: 'center', flexShrink: 0 }}>{cat.icon}</span>
                  <span style={{ lineHeight: 1.2 }}>{cat.name}</span>
                </span>
                {cat._count.listings > 0 && (
                  <span style={{ fontSize: '0.68rem', color: '#9CA3AF', flexShrink: 0 }}>{cat._count.listings}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/browse" style={{
          display: 'block', padding: '0.6rem 0.875rem', background: '#F4F4F2',
          textDecoration: 'none', fontSize: '0.75rem', color: '#6B7280',
          fontWeight: 600, textAlign: 'center', borderTop: '1px solid #E5E5E0',
        }}>
          📍 Filter by Parish →
        </Link>
      </div>
    </aside>
  )
}