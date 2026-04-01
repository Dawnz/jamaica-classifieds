import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MyAdsClient from './MyAdsClient'

export const dynamic = 'force-dynamic'

export default async function MyAdsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')

  const listings = await prisma.listing.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: 'desc' },
    include: { images: { take: 1 }, category: true },
  })

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: 4 }}>My Ads</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{listings.length} listing{listings.length !== 1 ? 's' : ''}</p>
          </div>
          <a href="/post-ad" style={{ background: 'var(--green)', color: '#fff', padding: '0.65rem 1.25rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
            + Post New Ad
          </a>
        </div>
        <MyAdsClient listings={listings as any} />
      </div>
      <Footer />
    </>
  )
}
