'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { CATEGORY_FILTERS, PARISHES } from '@/types'

export default function SmartFilters({ categorySlug }: { categorySlug: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filters = CATEGORY_FILTERS[categorySlug] ?? []

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    filters.forEach(f => { init[f.key] = searchParams.get(f.key) ?? '' })
    init.minPrice = searchParams.get('minPrice') ?? ''
    init.maxPrice = searchParams.get('maxPrice') ?? ''
    return init
  })

  if (!filters.length) return null

  function apply() {
    const p = new URLSearchParams(searchParams.toString())
    Object.entries(values).forEach(([k, v]) => {
      if (v) p.set(k, v); else p.delete(k)
    })
    p.delete('page')
    router.push(`/browse?${p.toString()}`)
  }

  function clear() {
    const p = new URLSearchParams(searchParams.toString())
    filters.forEach(f => p.delete(f.key))
    p.delete('minPrice'); p.delete('maxPrice'); p.delete('page')
    router.push(`/browse?${p.toString()}`)
    const reset: Record<string, string> = {}
    filters.forEach(f => { reset[f.key] = '' })
    reset.minPrice = ''; reset.maxPrice = ''
    setValues(reset)
  }

  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)', borderRadius: 12,
      padding: '0.875rem 1rem', marginBottom: '1rem',
      display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end',
    }}>
      {filters.map(f => (
        <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {f.label}
          </label>
          <select
            value={values[f.key] ?? ''}
            onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
            style={{
              fontFamily: 'var(--font-sans)', fontSize: '0.85rem',
              border: '1px solid var(--border)', borderRadius: 8,
              padding: '0.4rem 0.65rem', background: '#fff', color: 'var(--ink)',
              cursor: 'pointer', outline: 'none', minWidth: 130,
            }}
          >
            <option value="">Any {f.label}</option>
            {f.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ))}

      {/* Price range */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Min Price (J$)</label>
        <input
          type="number" placeholder="0" value={values.minPrice}
          onChange={e => setValues(v => ({ ...v, minPrice: e.target.value }))}
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', border: '1px solid var(--border)', borderRadius: 8, padding: '0.4rem 0.65rem', width: 110, outline: 'none' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Max Price (J$)</label>
        <input
          type="number" placeholder="Any" value={values.maxPrice}
          onChange={e => setValues(v => ({ ...v, maxPrice: e.target.value }))}
          style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', border: '1px solid var(--border)', borderRadius: 8, padding: '0.4rem 0.65rem', width: 110, outline: 'none' }}
        />
      </div>

      <button onClick={apply} style={{
        background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 8,
        padding: '0.5rem 1.25rem', fontFamily: 'var(--font-sans)',
        fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
      }}>Apply</button>
      <button onClick={clear} style={{
        background: 'none', border: '1px solid var(--border)', color: 'var(--muted)',
        borderRadius: 8, padding: '0.5rem 0.9rem',
        fontFamily: 'var(--font-sans)', fontSize: '0.85rem', cursor: 'pointer',
      }}>Clear</button>
    </div>
  )
}
