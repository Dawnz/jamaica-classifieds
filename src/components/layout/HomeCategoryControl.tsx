'use client'
import { useState, useMemo } from 'react'
import ListingCard from '../listings/ListingCard'
import { CATEGORY_FILTERS } from '@/types'

type Category = { id: string; name: string; slug: string; icon: string | null }
type Listing = {
  id: string; title: string; priceLabel: string | null; parish: string
  tier: string; createdAt: Date
  category: { name: string; slug: string; icon: string | null }
  images: { url: string }[]
}

export default function HomeCategoryControl({ categories, listings }: { categories: Category[]; listings: Listing[] }) {
  const [activeCat, setActiveCat] = useState('all')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [sort, setSort] = useState('newest')

  const activeCategory = categories.find(c => c.slug === activeCat)
  const dynamicFilters = CATEGORY_FILTERS[activeCat] ?? []

  const filtered = useMemo(() => {
    const result = activeCat === 'all' ? listings : listings.filter(l => l.category.slug === activeCat)
    return result
  }, [activeCat, listings])

  return (
    <div>
      {/* Dark category control bar */}
      <div style={{ background: '#1B3A5C', borderRadius: '10px 10px 0 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <TabBtn label="All" icon="🏠" active={activeCat === 'all'} onClick={() => { setActiveCat('all'); setFilterValues({}) }} />
          {categories.slice(0, 10).map(cat => (
            <TabBtn key={cat.id} label={cat.name} icon={cat.icon ?? '📦'} active={activeCat === cat.slug} onClick={() => { setActiveCat(cat.slug); setFilterValues({}) }} />
          ))}
          <a href="/browse" style={{ padding: '0.6rem 1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
            More →
          </a>
        </div>

        {dynamicFilters.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0.6rem 0.875rem', alignItems: 'center' }}>
            {dynamicFilters.map(f => (
              <select key={f.key} value={filterValues[f.key] ?? ''} onChange={e => setFilterValues(v => ({ ...v, [f.key]: e.target.value }))}
                style={{ fontFamily: 'inherit', fontSize: '0.78rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, padding: '0.3rem 0.6rem', background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', outline: 'none' }}>
                <option value="" style={{ color: '#111' }}>Any {f.label}</option>
                {f.options.map(o => <option key={o} value={o} style={{ color: '#111' }}>{o}</option>)}
              </select>
            ))}
            {Object.values(filterValues).some(Boolean) && (
              <button onClick={() => setFilterValues({})} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 6, padding: '0.3rem 0.75rem', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.875rem', background: '#F4F4F2', border: '1px solid #E5E5E0', borderTop: 'none', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
          <strong style={{ color: '#1D2124' }}>{filtered.length}</strong> listings{activeCat !== 'all' && activeCategory ? ` in ${activeCategory.name}` : ''}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {[{ label: 'Newest', value: 'newest' }, { label: 'Price ↑', value: 'price-asc' }, { label: 'Price ↓', value: 'price-desc' }].map(s => (
            <button key={s.value} onClick={() => setSort(s.value)} style={{ padding: '0.25rem 0.65rem', borderRadius: 20, border: '1px solid #E5E5E0', background: sort === s.value ? '#1A7A3C' : '#fff', color: sort === s.value ? '#fff' : '#6B7280', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4-column grid */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          {filtered.slice(0, 48).map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 10, border: '1px solid #E5E5E0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔍</div>
          <p style={{ color: '#6B7280' }}>No listings in this category yet</p>
        </div>
      )}

      {filtered.length > 48 && (
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <a href={activeCat === 'all' ? '/browse' : `/browse?category=${activeCat}`} style={{ background: '#1A7A3C', color: '#fff', padding: '0.65rem 2rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', display: 'inline-block' }}>
            View All {filtered.length} Listings →
          </a>
        </div>
      )}
    </div>
  )
}

function TabBtn({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: '0.6rem 0.75rem', background: active ? 'rgba(255,255,255,0.15)' : 'transparent', border: 'none', borderBottom: active ? '2px solid #F7C948' : '2px solid transparent', color: active ? '#F7C948' : 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: active ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: '0.85rem' }}>{icon}</span>{label}
    </button>
  )
}