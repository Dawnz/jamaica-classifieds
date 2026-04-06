import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProfileClient from './ProfileClient'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')

  const userId = (session.user as any).id

  const [user, listings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, parish: true, image: true, bio: true, createdAt: true, password: true },
    }),
    prisma.listing.findMany({
      where: { userId, status: 'ACTIVE', expiresAt: { gt: new Date() } },
      include: { images: { take: 1 }, category: true },
      orderBy: { createdAt: 'desc' },
      take: 12,
    }),
  ])

  if (!user) redirect('/')

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1800, margin: '2rem auto', padding: '0 1.25rem' }}>
        <ProfileClient
          user={{ ...user, hasPassword: !!user.password, password: undefined } as any}
          listings={listings as any}
        />
      </div>
      <Footer />
    </>
  )
}