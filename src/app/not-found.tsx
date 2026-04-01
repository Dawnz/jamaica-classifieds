import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🇯🇲</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>404 — Not Found</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>This listing may have expired or been removed.</p>
        <Link href="/browse" style={{ background: 'var(--green)', color: '#fff', padding: '0.65rem 1.5rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
          Browse All Listings
        </Link>
      </div>
    </>
  )
}
