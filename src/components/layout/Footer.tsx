import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--ink)', color: 'rgba(255,255,255,0.55)',
      textAlign: 'center', padding: '2.5rem 2rem', marginTop: '3rem',
      fontSize: '0.85rem',
    }}>
      {/* Flag bar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', gap: 0 }}>
        {['#000','#000','#F7C948','#1A7A3C','#1A7A3C','#F7C948','#000','#000'].map((c,i) => (
          <div key={i} style={{ width: 36, height: 4, background: c }} />
        ))}
      </div>

      <span style={{
        fontFamily: 'var(--font-serif)', color: 'var(--gold)',
        fontSize: '1.3rem', fontWeight: 900, display: 'block', marginBottom: '0.5rem',
      }}>Jamaica Classifieds</span>
      <p style={{ marginBottom: '1.25rem', opacity: 0.7 }}>
        Jamaica&apos;s #1 classifieds marketplace — serving all 14 parishes.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {[
          ['Browse Ads', '/browse'],
          ['Post a Free Ad', '/post-ad'],
          ['Premium Ads', '/post-ad#premium'],
          ['Contact Us', '/contact'],
          ['Privacy Policy', '/privacy'],
          ['Terms of Use', '/terms'],
        ].map(([label, href]) => (
          <Link key={label} href={href} style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
            {label}
          </Link>
        ))}
      </div>
      <p style={{ opacity: 0.4, fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} Jamaica Classifieds. All rights reserved.
      </p>
    </footer>
  )
}
