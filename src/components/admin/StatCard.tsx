'use client'
import Link from 'next/link'
import { useState } from 'react'

type Props = { label: string; value: number; icon: string; color: string; href: string }

export default function StatCard({ label, value, icon, color, href }: Props) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#fff', border: '1px solid var(--border)', borderRadius: 12,
          padding: '1.1rem 1.25rem', transition: 'box-shadow 0.15s',
          boxShadow: hovered ? '0 4px 16px rgba(0,0,0,.08)' : 'none',
        }}
      >
        <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{icon}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color, lineHeight: 1 }}>
          {value.toLocaleString()}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 4 }}>{label}</div>
      </div>
    </Link>
  )
}
