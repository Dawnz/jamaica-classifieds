'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Props = { initialQ?: string; initialCategory?: string }

export default function SearchBar({ initialQ = '', initialCategory = '' }: Props) {
  const [q, setQ] = useState(initialQ)
  const [category, setCategory] = useState(initialCategory)
  const router = useRouter()
  const [, startTransition] = useTransition()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    startTransition(() => router.push(`/browse?${params.toString()}`))
  }

  return (
    <form onSubmit={handleSearch} style={{
      maxWidth: 900, margin: '0 auto',
      background: '#fff', borderRadius: 14,
      boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
      display: 'flex', overflow: 'hidden',
      border: '2px solid var(--gold)',
    }}>
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        style={{
          border: 'none', outline: 'none', background: 'var(--subtle)',
          fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 500,
          color: 'var(--ink)', padding: '0 1rem',
          borderRight: '1.5px solid var(--border)', minWidth: 160, cursor: 'pointer',
        }}
      >
        <option value="">All Categories</option>
        {CATEGORY_OPTIONS.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
      </select>
      <input
        type="text" value={q} onChange={e => setQ(e.target.value)}
        placeholder="Search listings in Jamaica…"
        style={{
          flex: 1, border: 'none', outline: 'none',
          fontFamily: 'var(--font-sans)', fontSize: '1rem',
          padding: '0.85rem 1rem', color: 'var(--ink)',
        }}
      />
      <button type="submit" style={{
        background: 'var(--green)', color: '#fff', border: 'none',
        padding: '0 1.5rem', fontFamily: 'var(--font-sans)',
        fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
      }}>
        Search
      </button>
    </form>
  )
}

const CATEGORY_OPTIONS = [
  { slug: 'real-estate', name: 'Real Estate' },
  { slug: 'auto', name: 'Auto' },
  { slug: 'jobs', name: 'Jobs' },
  { slug: 'mobile-devices', name: 'Mobile Devices' },
  { slug: 'computers', name: 'Computers' },
  { slug: 'games', name: 'Games' },
  { slug: 'baby', name: 'Baby' },
  { slug: 'clothing-accessories', name: 'Clothing & Accessories' },
  { slug: 'home-office', name: 'Home & Office' },
  { slug: 'cosmetics', name: 'Cosmetics' },
  { slug: 'pets-animals', name: 'Pets & Animals' },
  { slug: 'media-entertainment', name: 'Media & Entertainment' },
  { slug: 'services', name: 'Services' },
  { slug: 'cleaning-supplies', name: 'Cleaning Supplies' },
  { slug: 'food-beverages', name: 'Food & Beverages' },
  { slug: 'jewelry', name: 'Jewelry' },
  { slug: 'medical', name: 'Medical' },
  { slug: 'personal-care-beauty', name: 'Personal Care & Beauty' },
  { slug: 'furniture', name: 'Furniture' },
  { slug: 'appliances', name: 'Appliances' },
  { slug: 'sports-fitness', name: 'Sports & Fitness' },
  { slug: 'other', name: 'Other' },
]
