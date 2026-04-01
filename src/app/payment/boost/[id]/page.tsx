'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'

export default function BoostPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function startCheckout() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId: params.id }),
    })
    if (res.ok) {
      const { url } = await res.json()
      window.location.href = url
    } else {
      alert('Could not start checkout. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '2.5rem', maxWidth: 480, width: '100%', border: '1.5px solid var(--gold)', boxShadow: '0 8px 32px rgba(0,0,0,.08)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Boost to Premium</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Get your listing seen by more buyers across Jamaica.
          </p>

          {/* Feature list */}
          <div style={{ background: 'var(--green-light)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.75rem', textAlign: 'left' }}>
            {[
              '🔝 Top placement in search results',
              '⭐ Featured badge on your listing',
              '📈 Up to 5× more views',
              '⏰ Extended to 60 days active',
              '🔔 Highlighted in category pages',
            ].map(f => (
              <div key={f} style={{ fontSize: '0.9rem', color: 'var(--green-dark)', fontWeight: 500, padding: '0.35rem 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                {f}
              </div>
            ))}
          </div>

          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--green)', marginBottom: '0.25rem' }}>J$1,500</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>One-time payment · No subscription</div>

          <button onClick={startCheckout} disabled={loading} style={{
            width: '100%', background: loading ? '#aaa' : 'var(--green)',
            color: '#fff', border: 'none', borderRadius: 12,
            padding: '0.9rem', fontFamily: 'var(--font-sans)',
            fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Redirecting to payment…' : '⭐ Boost My Ad — J$1,500'}
          </button>
          <button onClick={() => router.back()} style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
