import Link from 'next/link'

const AD_SLOTS = [
  { id: 1, color: '#185FA5' },
  { id: 2, color: '#1A7A3C' },
  { id: 3, color: '#7B3F00' },
  { id: 4, color: '#6B3FA0' },
]

export default function AdColumn() {
  return (
    <>
      {AD_SLOTS.map(slot => (
        <Link key={slot.id} href="/contact" style={{ textDecoration: 'none' }}>
          <div style={{
            border: `1.5px dashed ${slot.color}`, borderRadius: 10,
            padding: '1.25rem 0.75rem', background: `${slot.color}08`,
            textAlign: 'center', minHeight: 120,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <div style={{ fontSize: '1.25rem' }}>📢</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: slot.color }}>Your Ad Here</div>
            <div style={{ fontSize: '0.68rem', color: '#9CA3AF', lineHeight: 1.4 }}>
              220×200 banner<br />Reach thousands<br />of Jamaicans
            </div>
            <div style={{ marginTop: 4, background: slot.color, color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
              Advertise
            </div>
          </div>
        </Link>
      ))}
    </>
  )
}
