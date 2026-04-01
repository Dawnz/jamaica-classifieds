import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function PaymentSuccess() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 480 }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--green)', marginBottom: '0.5rem' }}>You&apos;re Premium!</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Your listing has been upgraded. It now appears at the top of search results with a Featured badge for the next 60 days.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/my-ads" style={{ background: 'var(--green)', color: '#fff', padding: '0.65rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>
              View My Ads
            </Link>
            <Link href="/browse" style={{ background: '#fff', color: 'var(--ink)', padding: '0.65rem 1.5rem', borderRadius: 10, border: '1px solid var(--border)', textDecoration: 'none', fontWeight: 600 }}>
              Browse Listings
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
