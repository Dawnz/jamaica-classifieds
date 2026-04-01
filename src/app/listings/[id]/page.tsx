import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ListingActions from '@/components/listings/ListingActions'

export const dynamic = 'force-dynamic'

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { order: 'asc' } },
      category: true,
      subCategory: true,
      fields: true,
      user: { select: { name: true, image: true, createdAt: true } },
    },
  })

  if (!listing || listing.status !== 'ACTIVE' || listing.expiresAt < new Date()) {
    notFound()
  }

  prisma.listing.update({
    where: { id: listing.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {})

  const isPremium   = listing.tier === 'PREMIUM'
  const memberSince = new Date(listing.user.createdAt).toLocaleDateString('en-JM', { month: 'long', year: 'numeric' })
  const postedOn    = new Date(listing.createdAt).toLocaleDateString('en-JM', { day: 'numeric', month: 'long', year: 'numeric' })
  const expiresOn   = new Date(listing.expiresAt).toLocaleDateString('en-JM', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: '1.5rem auto', padding: '0 1.25rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>

        {/* LEFT */}
        <div>
          {/* Breadcrumb */}
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <Link href="/browse" style={{ color: 'var(--green)', textDecoration: 'none' }}>All Listings</Link>
            <span>/</span>
            <Link href={`/browse?category=${listing.category.slug}`} style={{ color: 'var(--green)', textDecoration: 'none' }}>
              {listing.category.icon} {listing.category.name}
            </Link>
            {listing.subCategory && (
              <><span>/</span><span>{listing.subCategory.name}</span></>
            )}
          </div>

          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {isPremium && (
              <span style={{ background: 'var(--gold)', color: '#7B3F00', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>
                ⭐ Featured
              </span>
            )}
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.2 }}>
              {listing.title}
            </h1>
          </div>

          {/* Price */}
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--green)', marginBottom: '1.25rem' }}>
            {listing.priceLabel ?? 'Contact for price'}
          </div>

          {/* Images */}
          {listing.images.length > 0 ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', width: '100%', height: 380, borderRadius: 14, overflow: 'hidden', background: 'var(--subtle)', marginBottom: 8 }}>
                <Image src={listing.images[0].url} alt={listing.title} fill style={{ objectFit: 'cover' }} priority />
              </div>
              {listing.images.length > 1 && (
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                  {listing.images.slice(1).map((img, i) => (
                    <div key={img.id} style={{ position: 'relative', width: 100, height: 75, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                      <Image src={img.url} alt={`${listing.title} ${i + 2}`} fill style={{ objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ width: '100%', height: 300, background: 'var(--subtle)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', marginBottom: '1.5rem' }}>
              {listing.category.icon ?? '📦'}
            </div>
          )}

          {/* Dynamic fields */}
          {listing.fields.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: '1.25rem' }}>
              <div style={{ background: 'var(--green)', color: '#fff', padding: '0.65rem 1rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Listing Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                {listing.fields.map((f, i) => (
                  <div key={f.id} style={{
                    padding: '0.65rem 1rem',
                    background: i % 2 === 0 ? '#fff' : 'var(--subtle)',
                    borderBottom: i < listing.fields.length - 2 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: '1.25rem' }}>
            <div style={{ background: 'var(--green)', color: '#fff', padding: '0.65rem 1rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Description
            </div>
            <div style={{ padding: '1.25rem', fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>
              {listing.description}
            </div>
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--muted)', flexWrap: 'wrap' }}>
            <span>📅 Posted: {postedOn}</span>
            <span>📍 {listing.parish}{listing.address ? `, ${listing.address}` : ''}</span>
            <span>👁️ {listing.viewCount + 1} views</span>
            <span>⏳ Expires: {expiresOn}</span>
          </div>
        </div>

        {/* RIGHT — contact card */}
        <div>
          <div style={{
            background: '#fff',
            border: isPremium ? '1.5px solid var(--gold)' : '1px solid var(--border)',
            borderRadius: 14, overflow: 'hidden', position: 'sticky', top: 80,
          }}>
            <div style={{
              background: isPremium ? 'linear-gradient(135deg, #7B4F00, #C9961E)' : 'var(--green)',
              padding: '1rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>Listed by</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                {listing.contactName ?? listing.user.name ?? 'Seller'}
              </div>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <ListingActions
                title={listing.title}
                phone={listing.contactPhone}
                email={listing.contactEmail}
              />

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.75rem 0' }} />

              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Member since</span>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{memberSince}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Location</span>
                  <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{listing.parish}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
