'use client'
import { useState } from 'react'
import Image from 'next/image'

type Props = {
  images: { id: string; url: string }[]
  title: string
}

export default function ImageGallery({ images, title }: Props) {
  const [active, setActive] = useState(0)

  if (images.length === 0) return null

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Main image */}
      <div style={{ position: 'relative', width: '100%', height: 'clamp(200px, 40vw, 420px)', borderRadius: 14, overflow: 'hidden', background: '#F4F4F2', marginBottom: 8 }}>
        <Image src={images[active].url} alt={title} fill style={{ objectFit: 'cover' }} priority />

        {/* Left arrow */}
        {images.length > 1 && (
          <button type="button" onClick={() => setActive(p => Math.max(0, p - 1))} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none',
            borderRadius: '50%', width: 40, height: 40, fontSize: '1.25rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: active === 0 ? 0.3 : 1, transition: 'opacity 0.15s',
          }}>‹</button>
        )}

        {/* Right arrow */}
        {images.length > 1 && (
          <button type="button" onClick={() => setActive(p => Math.min(images.length - 1, p + 1))} style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none',
            borderRadius: '50%', width: 40, height: 40, fontSize: '1.25rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: active === images.length - 1 ? 0.3 : 1, transition: 'opacity 0.15s',
          }}>›</button>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute', bottom: 12, right: 12,
            background: 'rgba(0,0,0,0.55)', color: '#fff',
            fontSize: '0.75rem', fontWeight: 600,
            padding: '3px 12px', borderRadius: 20,
          }}>
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {images.map((img, i) => (
            <div key={img.id} onClick={() => setActive(i)} style={{
              position: 'relative', width: 90, height: 68,
              borderRadius: 8, overflow: 'hidden', flexShrink: 0,
              cursor: 'pointer',
              border: i === active ? '2px solid #1A7A3C' : '2px solid transparent',
              opacity: i === active ? 1 : 0.6,
              transition: 'all 0.15s',
            }}>
              <Image src={img.url} alt={`${title} ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="90px" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}