import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import SearchBar from '@/components/listings/SearchBar'
import ListingCard from '@/components/listings/ListingCard'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const now = new Date()

  const [categories, featured, latest] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true }, orderBy: { order: 'asc' },
      include: { _count: { select: { listings: { where: { status: 'ACTIVE', expiresAt: { gt: now } } } } } },
    }),
    prisma.listing.findMany({
      where: { tier: 'PREMIUM', status: 'ACTIVE', expiresAt: { gt: now } },
      include: { images: { take: 1, orderBy: { order: 'asc' } }, category: true },
      orderBy: { createdAt: 'desc' }, take: 4,
    }),
    prisma.listing.findMany({
      where: { status: 'ACTIVE', expiresAt: { gt: now } },
      include: { images: { take: 1, orderBy: { order: 'asc' } }, category: true },
      orderBy: { createdAt: 'desc' }, take: 16,
    }),
  ])

  const totalListings = categories.reduce((s, c) => s + c._count.listings, 0)

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #115529 0%, #1A7A3C 60%, #2D9E56 100%)',
        padding: '3rem 2rem 2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: '1.25rem' }}>
          {['#000','#F7C948','#1A7A3C','#F7C948','#000'].map((c, i) => (
            <div key={i} style={{ width: 40, height: 6, background: c, borderRadius: 3 }} />
          ))}
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '0.5rem' }}>
          Jamaica&apos;s #1{' '}
          <span style={{ color: 'var(--gold)' }}>Classifieds Marketplace</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', marginBottom: '1.75rem' }}>
          {totalListings.toLocaleString()} active listings across all 14 parishes
        </p>
        <SearchBar />
      </div>

      <div style={{ maxWidth: 1800, margin: '0 auto', padding: '1.5rem 1.25rem' }}>

        {/* Category pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '2rem' }}>
          {categories.map(cat => (
            <Link key={cat.id} href={`/browse?category=${cat.slug}`} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 20, padding: '0.35rem 0.9rem',
              fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink)',
              textDecoration: 'none',
            }}>
              <span>{cat.icon}</span> {cat.name}
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', background: 'var(--subtle)', padding: '1px 6px', borderRadius: 20 }}>
                {cat._count.listings}
              </span>
            </Link>
          ))}
        </div>

        {/* Featured listings */}
        {featured.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--ink)' }}>⭐ Featured Listings</h2>
              <Link href="/browse?tier=PREMIUM" style={{ fontSize: '0.875rem', color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem' }}>
              {featured.map(l => <ListingCard key={l.id} listing={l as any} />)}
            </div>
          </section>
        )}

        {/* Latest listings */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--ink)' }}>Latest Listings</h2>
            <Link href="/browse" style={{ fontSize: '0.875rem', color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {latest.map(l => <ListingCard key={l.id} listing={l as any} />)}
          </div>
        </section>

        {/* Premium CTA */}
        <div style={{
          marginTop: '2.5rem',
          background: 'linear-gradient(135deg, #7B4F00, #C9961E)',
          borderRadius: 14, padding: '1.5rem 2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
        }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>Get more eyes on your listing</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>Premium ads get top placement and 5× more views — from J$1,500</p>
          </div>
          <Link href="/post-ad" style={{ background: '#fff', color: '#7B4F00', borderRadius: 8, padding: '0.65rem 1.5rem', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Post a Premium Ad
          </Link>
        </div>
      </div>

      <Footer />
    </>
  )
}