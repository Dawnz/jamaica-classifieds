'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Listing = {
  id: string; title: string; status: string; tier: string; priceLabel: string | null
  parish: string; expiresAt: Date; createdAt: Date; viewCount: number
  category: { name: string; icon: string | null }
  images: { url: string }[]
}

export default function MyAdsClient({ listings }: { listings: Listing[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const now = new Date()

  async function deleteListing(id: string) {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    await fetch(`/api/listings/${id}`, { method: 'DELETE' })
    startTransition(() => router.refresh())
  }

  if (listings.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 14, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
        <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>No ads yet</h3>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Post your first ad and reach thousands of Jamaicans.</p>
        <Link href="/post-ad" style={{ background: 'var(--green)', color: '#fff', padding: '0.65rem 1.5rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
          Post a Free Ad
        </Link>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {listings.map(l => {
        const expired = new Date(l.expiresAt) < now
        const daysLeft = Math.max(0, Math.ceil((new Date(l.expiresAt).getTime() - now.getTime()) / 86400000))
        const img = l.images[0]?.url

        return (
          <div key={l.id} style={{
            background: '#fff', border: l.tier === 'PREMIUM' ? '1.5px solid var(--gold)' : '1px solid var(--border)',
            borderRadius: 12, display: 'flex', gap: '1rem', padding: '1rem', alignItems: 'flex-start',
            opacity: expired ? 0.7 : 1,
          }}>
            {/* Thumbnail */}
            <div style={{ width: 110, height: 80, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--subtle)', position: 'relative' }}>
              {img ? (
                <Image src={img} alt={l.title} fill style={{ objectFit: 'cover' }} sizes="110px" />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2rem' }}>
                  {l.category.icon ?? '📦'}
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                {l.tier === 'PREMIUM' && (
                  <span style={{ background: 'var(--gold)', color: '#7B3F00', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>⭐ Featured</span>
                )}
                <StatusPill status={l.status} expired={expired} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <Link href={`/listings/${l.id}`} style={{ color: 'var(--ink)', textDecoration: 'none' }}>{l.title}</Link>
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <span>{l.category.icon} {l.category.name}</span>
                <span>📍 {l.parish}</span>
                <span>👁️ {l.viewCount} views</span>
                {!expired ? (
                  <span style={{ color: daysLeft <= 5 ? '#C0392B' : 'var(--muted)' }}>⏳ {daysLeft}d left</span>
                ) : (
                  <span style={{ color: '#C0392B' }}>⏳ Expired</span>
                )}
              </div>
            </div>

            {/* Price + actions */}
            <div style={{ flexShrink: 0, textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ fontWeight: 700, color: 'var(--green)', fontSize: '0.95rem' }}>
                {l.priceLabel ?? 'No price'}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Link href={`/listings/${l.id}`} style={actionBtn('#185FA5')}>View</Link>
                {!expired && l.tier === 'FREE' && (
                  <Link href={`/payment/boost/${l.id}`} style={actionBtn('#C9961E')}>⭐ Boost</Link>
                )}
                <button onClick={() => deleteListing(l.id)} style={{ ...actionBtn('#C0392B'), background: 'none', fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function StatusPill({ status, expired }: { status: string; expired: boolean }) {
  const s = expired ? 'EXPIRED' : status
  const m: Record<string, [string, string]> = {
    ACTIVE: ['#D1FAE5','#065F46'], EXPIRED: ['#F3F4F6','#6B7280'],
    PENDING: ['#FEF3C7','#92400E'], REMOVED: ['#FEE2E2','#991B1B'],
  }
  const [bg, color] = m[s] ?? ['#F3F4F6','#6B7280']
  return <span style={{ background: bg, color, fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{s}</span>
}

const actionBtn = (color: string): React.CSSProperties => ({
  border: `1px solid ${color}`, color, borderRadius: 6, padding: '4px 10px',
  fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap',
})
