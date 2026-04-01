'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { ListingCard } from '@/types'

export default function ListingCard({ listing }: { listing: ListingCard }) {
  const [hovered, setHovered] = useState(false)
  const isPremium = listing.tier === 'PREMIUM'
  const img = listing.images[0]?.url

  const timeAgo = (date: Date) => {
    const diff = Date.now() - new Date(date).getTime()
    const h = Math.floor(diff / 3600000)
    if (h < 1) return 'Just now'
    if (h < 24) return `${h}h ago`
    const d = Math.floor(h / 24)
    if (d < 7) return `${d}d ago`
    return new Date(date).toLocaleDateString('en-JM', { day: 'numeric', month: 'short' })
  }

  return (
    <Link href={`/listings/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#fff',
          border: isPremium ? '1.5px solid var(--gold)' : '1px solid var(--border)',
          borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
          transition: 'box-shadow 0.15s, transform 0.15s',
          position: 'relative', height: '100%',
          boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
          transform: hovered ? 'translateY(-2px)' : 'none',
        }}
      >
        {isPremium && (
          <span style={{
            position: 'absolute', top: 10, left: 10, zIndex: 2,
            background: 'var(--gold)', color: '#7B3F00',
            fontSize: '0.7rem', fontWeight: 700,
            padding: '2px 8px', borderRadius: 20,
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>⭐ Featured</span>
        )}
        <div style={{ width: '100%', height: 160, background: 'var(--subtle)', position: 'relative', overflow: 'hidden' }}>
          {img ? (
            <Image src={img} alt={listing.title} fill style={{ objectFit: 'cover' }} sizes="280px" />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2.5rem' }}>
              {listing.category.icon ?? '📦'}
            </div>
          )}
        </div>
        <div style={{ padding: '0.75rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            {listing.category.icon} {listing.category.name}
          </div>
          <div style={{
            fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)',
            marginBottom: 4, lineHeight: 1.35,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {listing.title}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--green)', marginBottom: 6 }}>
            {listing.priceLabel ?? 'Contact for price'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--muted)' }}>
            <span>📍 {listing.parish}</span>
            <span>{timeAgo(listing.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
