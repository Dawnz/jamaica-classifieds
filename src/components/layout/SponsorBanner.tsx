'use client'
import { useState, useEffect } from 'react'

const SPONSORS = [
  { id: 1, name: 'Your Business Here',  tagline: 'Reach thousands of Jamaicans daily — advertise with us',         cta: 'Get Started',  color: '#1A7A3C' },
  { id: 2, name: 'Premium Sponsor Slot', tagline: 'Banner advertising available — contact us for rates',            cta: 'Contact Us',   color: '#185FA5' },
  { id: 3, name: 'Advertise Here',       tagline: 'Top banner placement — maximum visibility across Jamaica',       cta: 'Learn More',   color: '#7B3F00' },
  { id: 4, name: 'Sponsor This Space',   tagline: 'Your brand in front of buyers and sellers island-wide',          cta: 'Enquire Now',  color: '#6B3FA0' },
]

export default function SponsorBanner() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading]   = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true)
      setTimeout(() => { setCurrent(c => (c + 1) % SPONSORS.length); setFading(false) }, 400)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const s = SPONSORS[current]

  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #E5E5E0', borderTop: '1px solid #E5E5E0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0.5rem 1.25rem' }}>
        <div
          className="sponsor-inner"
          style={{
            padding: '0.6rem 1rem', border: `1.5px solid ${s.color}`,
            borderRadius: 6, background: `${s.color}08`,
            opacity: fading ? 0 : 1, transition: 'opacity 0.4s ease',
          }}
        >
          {/* Dots + label */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
            {SPONSORS.map((_, i) => (
              <button key={i} type="button" onClick={() => setCurrent(i)} style={{
                width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: i === current ? s.color : '#D1D5DB', padding: 0,
              }} />
            ))}
            <span style={{ fontSize: '0.7rem', color: '#9CA3AF', marginLeft: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Sponsored
            </span>
          </div>

          {/* Content */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: s.color, marginRight: 10 }}>{s.name}</span>
            <span className="sponsor-tagline" style={{ fontSize: '0.875rem', color: '#6B7280' }}>{s.tagline}</span>
          </div>

          {/* CTA */}
          <a href="/contact" style={{
            background: s.color, color: '#fff', padding: '0.4rem 1rem',
            borderRadius: 6, fontSize: '0.8rem', fontWeight: 700,
            textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
          }}>{s.cta}</a>
        </div>
      </div>
    </div>
  )
}
