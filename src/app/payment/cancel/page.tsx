import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function PaymentCancel() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 480 }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😕</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>Payment Cancelled</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>No charge was made. Your listing is still active as a free ad.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/my-ads" style={{ background: 'var(--green)', color: '#fff', padding: '0.65rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>
              Back to My Ads
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
