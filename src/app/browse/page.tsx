import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Sidebar from '@/components/layout/Sidebar'
import ListingCard from '@/components/listings/ListingCard'
import SmartFilters from '@/components/listings/SmartFilters'
import SearchBar from '@/components/listings/SearchBar'
import SponsorBanner from '@/components/layout/SponsorBanner'
import AdColumn from '@/components/layout/AdColumn'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 24

type SearchParams = {
  category?: string; parish?: string; q?: string; sort?: string
  page?: string; minPrice?: string; maxPrice?: string; tier?: string
  make?: string; model?: string; year?: string; condition?: string; transmission?: string
  listing_type?: string; property_type?: string; bedrooms?: string; bathrooms?: string
  job_type?: string; industry?: string; brand?: string; type?: string
}

export default async function BrowsePage({ searchParams }: { searchParams: SearchParams }) {
  const now = new Date()
  const page = Math.max(1, Number(searchParams.page ?? 1))
  const skip = (page - 1) * PAGE_SIZE

  const categoryRecord = searchParams.category
    ? await prisma.category.findUnique({ where: { slug: searchParams.category } })
    : null

  const where: any = {
    status: 'ACTIVE', expiresAt: { gt: now },
    ...(categoryRecord ? { categoryId: categoryRecord.id } : {}),
    ...(searchParams.parish ? { parish: searchParams.parish } : {}),
    ...(searchParams.tier ? { tier: searchParams.tier } : {}),
    ...(searchParams.q ? {
      OR: [
        { title: { contains: searchParams.q, mode: 'insensitive' } },
        { description: { contains: searchParams.q, mode: 'insensitive' } },
      ],
    } : {}),
    ...((searchParams.minPrice || searchParams.maxPrice) ? {
      price: {
        ...(searchParams.minPrice ? { gte: Number(searchParams.minPrice) } : {}),
        ...(searchParams.maxPrice ? { lte: Number(searchParams.maxPrice) } : {}),
      },
    } : {}),
  }

  const FIELD_KEYS = ['make','model','year','condition','transmission','listing_type','property_type','bedrooms','bathrooms','job_type','industry','brand','type']
  const fieldFilters = FIELD_KEYS.filter(k => (searchParams as any)[k])
  if (fieldFilters.length > 0) {
    where.fields = {
      some: {
        AND: fieldFilters.map(k => ({ key: k, value: { contains: (searchParams as any)[k], mode: 'insensitive' } })),
      },
    }
  }

  const orderBy: any = {
    'oldest': { createdAt: 'asc' },
    'price-asc': { price: 'asc' },
    'price-desc': { price: 'desc' },
  }[searchParams.sort ?? ''] ?? [{ tier: 'desc' }, { createdAt: 'desc' }]

  const [listings, total, categories] = await Promise.all([
    prisma.listing.findMany({
      where, orderBy, skip, take: PAGE_SIZE,
      include: { images: { take: 1, orderBy: { order: 'asc' } }, category: true },
    }),
    prisma.listing.count({ where }),
    prisma.category.findMany({
      where: { isActive: true }, orderBy: { order: 'asc' },
      include: { _count: { select: { listings: { where: { status: 'ACTIVE', expiresAt: { gt: now } } } } } },
    }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  function pageUrl(p: number) {
    const params = new URLSearchParams(searchParams as any)
    params.set('page', String(p))
    return `/browse?${params.toString()}`
  }

  return (
    <>
      <Navbar />

      {/* Search bar */}
      <div style={{ background: 'var(--green)', padding: '0.85rem 1.5rem' }}>
        <SearchBar initialQ={searchParams.q} initialCategory={searchParams.category} />
      </div>

      {/* Sponsor banner */}
      <SponsorBanner />

      {/* 3-column layout: sidebar | listings | ads */}
      <div style={{
        maxWidth: 1400, margin: '1.25rem auto 0', padding: '0 1.25rem',
        display: 'grid',
        gridTemplateColumns: '220px 1fr 220px',
        gap: '1.25rem',
        alignItems: 'start',
      }}>

        {/* LEFT — category + parish sidebar */}
        <Sidebar categories={categories as any} />

        {/* CENTRE — filters + listing grid */}
        <div>
          {searchParams.category && (
            <SmartFilters categorySlug={searchParams.category} />
          )}

          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
              <strong style={{ color: 'var(--ink)' }}>{total.toLocaleString()}</strong> listing{total !== 1 ? 's' : ''} found
              {categoryRecord ? ` in ${categoryRecord.name}` : ''}
              {searchParams.q ? ` for "${searchParams.q}"` : ''}
            </span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <SortLink searchParams={searchParams} label="Newest" value="" />
              <SortLink searchParams={searchParams} label="Oldest" value="oldest" />
              <SortLink searchParams={searchParams} label="Price ↑" value="price-asc" />
              <SortLink searchParams={searchParams} label="Price ↓" value="price-desc" />
            </div>
          </div>

          {/* Listing grid */}
          {listings.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {listings.map(l => <ListingCard key={l.id} listing={l as any} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>No listings found</h3>
              <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Try different keywords or browse all categories</p>
              <Link href="/browse" style={{ background: 'var(--green)', color: '#fff', padding: '0.65rem 1.5rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Browse All</Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '2rem' }}>
              {page > 1 && <Link href={pageUrl(page - 1)} style={pageLinkStyle(false)}>← Prev</Link>}
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <Link key={p} href={pageUrl(p)} style={pageLinkStyle(p === page)}>{p}</Link>
              ))}
              {page < totalPages && <Link href={pageUrl(page + 1)} style={pageLinkStyle(false)}>Next →</Link>}
            </div>
          )}
        </div>

        {/* RIGHT — ad column */}
        <AdColumn />

      </div>

      <Footer />
    </>
  )
}

function pageLinkStyle(active: boolean): React.CSSProperties {
  return {
    padding: '0.45rem 0.85rem', borderRadius: 8,
    border: active ? '2px solid var(--green)' : '1px solid var(--border)',
    background: active ? 'var(--green)' : '#fff',
    color: active ? '#fff' : 'var(--ink)',
    fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
  }
}

function SortLink({ searchParams, label, value }: { searchParams: SearchParams; label: string; value: string }) {
  const active = (searchParams.sort ?? '') === value
  const params = new URLSearchParams(searchParams as any)
  if (value) params.set('sort', value); else params.delete('sort')
  params.delete('page')
  return (
    <Link href={`/browse?${params.toString()}`} style={{
      fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: 20,
      border: active ? '1.5px solid var(--green)' : '1px solid var(--border)',
      background: active ? 'var(--green-light)' : '#fff',
      color: active ? 'var(--green)' : 'var(--muted)',
      textDecoration: 'none', fontWeight: active ? 600 : 400,
    }}>{label}</Link>
  )
}