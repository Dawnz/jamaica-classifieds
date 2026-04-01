'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Listing = {
  id: string; title: string; status: string; tier: string; parish: string
  expiresAt: Date; createdAt: Date
  category: { name: string; icon: string | null }
  user: { name: string | null; email: string }
}
type Props = { listings: Listing[]; total: number; page: number; pages: number; searchParams: any }

export default function AdminListingsTable({ listings, total, page, pages, searchParams }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [search, setSearch] = useState(searchParams.q ?? '')

  function buildUrl(p: Record<string, string>) {
    const params = new URLSearchParams(searchParams)
    Object.entries(p).forEach(([k, v]) => { if (v) params.set(k, v); else params.delete(k) })
    params.delete('page')
    return `/admin/listings?${params.toString()}`
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/listings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    startTransition(() => router.refresh())
  }
  async function deleteListing(id: string) {
    if (!confirm('Permanently delete this listing?')) return
    await fetch(`/api/admin/listings/${id}`, { method: 'DELETE' })
    startTransition(() => router.refresh())
  }

  const now = new Date()

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && router.push(buildUrl({ q: search }))}
          placeholder="Search listings…" style={iStyle} />
        <button onClick={() => router.push(buildUrl({ q: search }))} style={fBtn('var(--green)', '#fff')}>Search</button>
        {['', 'ACTIVE', 'EXPIRED', 'REMOVED'].map(s => (
          <Link key={s||'all'} href={buildUrl({ status: s })} style={fBtn((searchParams.status??'')=== s?'var(--green)':'#fff',(searchParams.status??'')=== s?'#fff':'var(--muted)')}>{s||'All'}</Link>
        ))}
        {['', 'PREMIUM', 'FREE'].map(t => (
          <Link key={t||'all-t'} href={buildUrl({ tier: t })} style={fBtn((searchParams.tier??'')=== t?'#C9961E':'#fff',(searchParams.tier??'')=== t?'#fff':'var(--muted)')}>{t||'All Tiers'}</Link>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--muted)' }}>{total.toLocaleString()} listings</span>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'var(--subtle)' }}>
              {['Title','Category','Parish','Posted by','Status','Tier','Expires','Actions'].map(h => (
                <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--muted)', fontSize: '0.72rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>No listings found</td></tr>
            ) : listings.map((l, i) => {
              const expired = new Date(l.expiresAt) < now
              return (
                <tr key={l.id} style={{ borderTop: '1px solid var(--border)', background: i%2===0?'#fff':'rgba(0,0,0,.01)' }}>
                  <td style={{ padding: '0.7rem 1rem', maxWidth: 220 }}>
                    <Link href={`/listings/${l.id}`} target="_blank" style={{ color: 'var(--ink)', fontWeight: 600, textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</Link>
                  </td>
                  <td style={{ padding: '0.7rem 1rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{l.category.icon} {l.category.name}</td>
                  <td style={{ padding: '0.7rem 1rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{l.parish}</td>
                  <td style={{ padding: '0.7rem 1rem', color: 'var(--muted)', fontSize: '0.8rem' }}>{l.user.name ?? l.user.email}</td>
                  <td style={{ padding: '0.7rem 1rem' }}><SBadge status={l.status} expired={expired} /></td>
                  <td style={{ padding: '0.7rem 1rem' }}><TBadge tier={l.tier} /></td>
                  <td style={{ padding: '0.7rem 1rem', color: expired?'#C0392B':'var(--muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{new Date(l.expiresAt).toLocaleDateString('en-JM')}</td>
                  <td style={{ padding: '0.7rem 1rem' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {l.status !== 'ACTIVE' && <button onClick={() => updateStatus(l.id,'ACTIVE')} style={aBtn('#1A7A3C')}>Activate</button>}
                      {l.status === 'ACTIVE' && <button onClick={() => updateStatus(l.id,'REMOVED')} style={aBtn('#C0392B')}>Remove</button>}
                      <button onClick={() => deleteListing(l.id)} style={aBtn('#6B7280')}>Delete</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '1.25rem' }}>
          {page > 1 && <Link href={buildUrl({ page: String(page-1) })} style={pBtn(false)}>← Prev</Link>}
          {Array.from({length: Math.min(pages, 7)}, (_,i) => i+1).map(p => (
            <Link key={p} href={buildUrl({ page: String(p) })} style={pBtn(p===page)}>{p}</Link>
          ))}
          {page < pages && <Link href={buildUrl({ page: String(page+1) })} style={pBtn(false)}>Next →</Link>}
        </div>
      )}
    </div>
  )
}

const iStyle: React.CSSProperties = { padding: '0.5rem 0.85rem', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none', minWidth: 220 }
const fBtn = (bg: string, color: string): React.CSSProperties => ({ padding: '0.45rem 0.85rem', borderRadius: 8, border: '1px solid var(--border)', background: bg, color, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap' })
const aBtn = (color: string): React.CSSProperties => ({ background: 'none', border: `1px solid ${color}`, color, borderRadius: 6, padding: '3px 8px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' })
const pBtn = (active: boolean): React.CSSProperties => ({ padding: '0.4rem 0.8rem', borderRadius: 8, textDecoration: 'none', border: active?'2px solid var(--green)':'1px solid var(--border)', background: active?'var(--green)':'#fff', color: active?'#fff':'var(--ink)', fontSize: '0.875rem', fontWeight: 500 })

function SBadge({ status, expired }: { status: string; expired: boolean }) {
  const s = expired ? 'EXPIRED' : status
  const m: Record<string, [string, string]> = { ACTIVE: ['#D1FAE5','#065F46'], EXPIRED: ['#F3F4F6','#6B7280'], PENDING: ['#FEF3C7','#92400E'], REMOVED: ['#FEE2E2','#991B1B'] }
  const [bg, color] = m[s] ?? ['#F3F4F6','#6B7280']
  return <span style={{ background: bg, color, fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{s}</span>
}
function TBadge({ tier }: { tier: string }) {
  return tier === 'PREMIUM'
    ? <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>⭐ PREMIUM</span>
    : <span style={{ background: 'var(--subtle)', color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>FREE</span>
}
