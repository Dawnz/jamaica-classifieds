'use client'
import { useState } from 'react'

type Props = { title: string; phone: string | null; email: string | null }

export default function ListingActions({ title, phone, email }: Props) {
  const [copied, setCopied]     = useState(false)
  const [reported, setReported] = useState(false)

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleReport() {
    setReported(true)
    setTimeout(() => setReported(false), 3000)
  }

  const btnStyle = (active: boolean, activeColor: string): React.CSSProperties => ({
    flex: 1,
    background: '#fff',
    border: '1px solid #E5E5E0',
    borderRadius: 8,
    padding: '0.5rem',
    fontSize: '0.8rem',
    cursor: 'pointer',
    color: active ? activeColor : '#6B7280',
    fontWeight: 500,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {phone && (
        <a
          href={`tel:${phone}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: '#1A7A3C',
            color: '#fff',
            borderRadius: 10,
            padding: '0.75rem',
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none'
          }}
        >
          📞 {phone}
        </a>
      )}

      {email && (
        <a
          href={`mailto:${email}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: '#F4F4F2',
            color: '#1D2124',
            borderRadius: 10,
            border: '1px solid #E5E5E0',
            padding: '0.65rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}
        >
          ✉️ Send Email
        </a>
      )}

      {phone && (
        <a
          href={`https://wa.me/${phone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: '#25D366',
            color: '#fff',
            borderRadius: 10,
            padding: '0.65rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}
        >
          💬 WhatsApp
        </a>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={handleShare} style={btnStyle(copied, '#1A7A3C')}>
          {copied ? '✅ Link copied!' : '📤 Share'}
        </button>

        <button type="button" onClick={handleReport} style={btnStyle(reported, '#C0392B')}>
          {reported ? '✅ Reported' : '🚩 Report'}
        </button>
      </div>

      <div style={{ fontSize: '0.75rem', color: '#6B7280', textAlign: 'center' }}>
        ⚠️ Never send money before seeing the item. Meet in a safe public place.
      </div>
    </div>
  )
}